import { type BaseMessage } from "@langchain/core/messages";

export type SerializedMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function messageText(content: BaseMessage["content"]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return "";
}

export function serializeMessages(messages: BaseMessage[]): SerializedMessage[] {
  const result: SerializedMessage[] = [];

  for (const message of messages) {
    const type = message.getType();
    if (type !== "human" && type !== "ai") continue;

    const content = messageText(message.content);
    if (type === "ai" && !content.trim()) continue;
    if (!content.trim()) continue;

    result.push({
      id: message.id ?? crypto.randomUUID(),
      role: type === "human" ? "user" : "assistant",
      content,
    });
  }

  return result;
}
