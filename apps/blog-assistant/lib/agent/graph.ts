import {
  Annotation,
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { isAIMessage, SystemMessage } from "@langchain/core/messages";
import {
  resolveCheckpointer,
  type CheckpointerMode,
} from "@/lib/agent/checkpointer";
import { isDatabaseConfigured } from "@/lib/db/pool";
import { getLastHumanText } from "@/lib/agent/regenerate";
import { buildAgentSystemPrompt } from "@/lib/agent/prompt";
import { agentTools } from "@/lib/agent/tools";
import { resolveIntent } from "@/lib/agent/llm-router";
import { type QueryIntent } from "@/lib/agent/router";

const AgentState = Annotation.Root({
  ...MessagesAnnotation.spec,
  intent: Annotation<QueryIntent>({
    reducer: (_, next) => next ?? "blog",
    default: () => "blog" as QueryIntent,
  }),
});

function createChatModel() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY");
  }
  return new ChatOpenAI({
    apiKey,
    model:
      process.env.DEEPSEEK_CHAT_MODEL ||
      process.env.OPENAI_CHAT_MODEL ||
      "deepseek-chat",
    temperature: 0.2,
    configuration: {
      baseURL:
        process.env.DEEPSEEK_BASE_URL ||
        process.env.OPENAI_BASE_URL ||
        "https://api.deepseek.com",
    },
  });
}

async function buildGraph(mode: CheckpointerMode) {
  const chatModel = createChatModel();
  const toolModel = chatModel.bindTools(agentTools);
  const toolNode = new ToolNode(agentTools, { handleToolErrors: true });

  async function routerNode(state: typeof AgentState.State) {
    const text = getLastHumanText(state.messages);
    const intent = await resolveIntent(text);
    return { intent };
  }

  async function directNode(state: typeof AgentState.State) {
    const system = buildAgentSystemPrompt(state.intent);
    const response = await chatModel.invoke([
      new SystemMessage(system),
      ...state.messages,
    ]);
    return { messages: [response] };
  }

  async function agentNode(state: typeof AgentState.State) {
    const system = buildAgentSystemPrompt(state.intent);
    const response = await toolModel.invoke([
      new SystemMessage(system),
      ...state.messages,
    ]);
    return { messages: [response] };
  }

  function routeByIntent(state: typeof AgentState.State) {
    return state.intent === "chat" ? "direct" : "agent";
  }

  function shouldContinue(state: typeof AgentState.State) {
    const last = state.messages.at(-1);
    if (!last || !isAIMessage(last)) return END;
    return last.tool_calls?.length ? "tools" : END;
  }

  const workflow = new StateGraph(AgentState)
    .addNode("router", routerNode)
    .addNode("direct", directNode)
    .addNode("agent", agentNode)
    .addNode("tools", toolNode)
    .addEdge(START, "router")
    .addConditionalEdges("router", routeByIntent, ["direct", "agent"])
    .addEdge("direct", END)
    .addConditionalEdges("agent", shouldContinue, ["tools", END])
    .addEdge("tools", "agent");

  const checkpointer = await resolveCheckpointer(mode);
  return workflow.compile({
    checkpointer: checkpointer as MemorySaver,
  });
}

const graphCache: Partial<Record<CheckpointerMode, ReturnType<typeof buildGraph>>> =
  {};

export function getAgentGraph(options?: { persistence?: boolean }) {
  const mode: CheckpointerMode =
    options?.persistence && isDatabaseConfigured() ? "postgres" : "memory";
  if (!graphCache[mode]) {
    graphCache[mode] = buildGraph(mode);
  }
  return graphCache[mode]!;
}

export type { QueryIntent };
