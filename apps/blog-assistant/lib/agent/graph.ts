import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { isAIMessage } from "@langchain/core/messages";
import { resolveCheckpointer } from "@/lib/agent/checkpointer";
import { agentTools } from "@/lib/agent/tools";

function createBoundModel() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY");
  }
  const model = new ChatOpenAI({
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
  return model.bindTools(agentTools);
}

async function buildGraph() {
  const model = createBoundModel();
  const toolNode = new ToolNode(agentTools, { handleToolErrors: true });

  async function agentNode(state: typeof MessagesAnnotation.State) {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  }

  function shouldContinue(state: typeof MessagesAnnotation.State) {
    const last = state.messages.at(-1);
    if (!last || !isAIMessage(last)) return END;
    return last.tool_calls?.length ? "tools" : END;
  }

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", agentNode)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, ["tools", END])
    .addEdge("tools", "agent");

  const checkpointer = await resolveCheckpointer();
  return workflow.compile({
    checkpointer: checkpointer as MemorySaver,
  });
}

let graphPromise: ReturnType<typeof buildGraph> | undefined;

export function getAgentGraph() {
  if (!graphPromise) {
    graphPromise = buildGraph();
  }
  return graphPromise;
}
