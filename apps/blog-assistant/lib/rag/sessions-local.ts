import type { Citation } from "@/lib/citations";

export type RagStoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolSteps?: string[];
  citations?: Citation[];
};

const MESSAGE_PREFIX = "blog-assistant-rag-msgs:";
const MODE_KEY = "blog-assistant-mode";

export function loadPreferredMode(): "agent" | "rag" | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(MODE_KEY);
  return value === "agent" || value === "rag" ? value : null;
}

export function savePreferredMode(mode: "agent" | "rag"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_KEY, mode);
}

export function loadRagMessages(sessionId: string): RagStoredMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${MESSAGE_PREFIX}${sessionId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RagStoredMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRagMessages(
  sessionId: string,
  messages: RagStoredMessage[]
): void {
  if (typeof window === "undefined") return;
  if (messages.length === 0) {
    localStorage.removeItem(`${MESSAGE_PREFIX}${sessionId}`);
    return;
  }
  localStorage.setItem(
    `${MESSAGE_PREFIX}${sessionId}`,
    JSON.stringify(messages.slice(-40))
  );
}

export function deleteRagMessages(sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${MESSAGE_PREFIX}${sessionId}`);
}
