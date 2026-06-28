import type { BaseMessage } from "@langchain/core/messages";

export function getLastHumanText(messages: BaseMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message._getType() !== "human") continue;
    const content = message.content;
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
  }
  return "";
}

/** 回退 checkpoint：保留到最后一条 user，去掉其后 ai/tool 消息 */
export function trimMessagesForRegenerate(
  messages: BaseMessage[]
): BaseMessage[] {
  const copy = [...messages];
  while (copy.length > 0) {
    const last = copy.at(-1);
    if (!last) break;
    if (last._getType() === "human") break;
    copy.pop();
  }
  if (copy.length === 0 || copy.at(-1)?._getType() !== "human") {
    return [];
  }
  return copy;
}
