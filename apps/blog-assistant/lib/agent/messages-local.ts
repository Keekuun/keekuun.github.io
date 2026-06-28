import type { Citation } from "@/lib/citations";

export type AgentStoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolSteps?: string[];
  citations?: Citation[];
};

const MESSAGE_PREFIX = "blog-assistant-agent-msgs:";
const MAX_STORED = 60;

export function loadAgentMessages(sessionId: string): AgentStoredMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${MESSAGE_PREFIX}${sessionId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AgentStoredMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAgentMessages(
  sessionId: string,
  messages: AgentStoredMessage[]
): void {
  if (typeof window === "undefined") return;
  if (messages.length === 0) {
    localStorage.removeItem(`${MESSAGE_PREFIX}${sessionId}`);
    return;
  }
  localStorage.setItem(
    `${MESSAGE_PREFIX}${sessionId}`,
    JSON.stringify(messages.slice(-MAX_STORED))
  );
}

export function deleteAgentMessages(sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${MESSAGE_PREFIX}${sessionId}`);
}
