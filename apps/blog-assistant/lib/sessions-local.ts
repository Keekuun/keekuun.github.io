export type LocalSession = {
  threadId: string;
  title: string;
  updatedAt: string;
};

const STORAGE_KEY = "blog-assistant-sessions";
const MAX_SESSIONS = 30;

export function loadLocalSessions(): LocalSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalSessions(sessions: LocalSession[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
}

export function upsertLocalSession(
  threadId: string,
  title: string
): LocalSession[] {
  const sessions = loadLocalSessions().filter((s) => s.threadId !== threadId);
  const entry: LocalSession = {
    threadId,
    title: title.trim() || "新会话",
    updatedAt: new Date().toISOString(),
  };
  const next = [entry, ...sessions].slice(0, MAX_SESSIONS);
  saveLocalSessions(next);
  return next;
}

export function removeLocalSession(threadId: string): LocalSession[] {
  const next = loadLocalSessions().filter((s) => s.threadId !== threadId);
  saveLocalSessions(next);
  return next;
}

export function trimTitle(message: string, max = 48): string {
  const oneLine = message.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine || "新会话";
  return `${oneLine.slice(0, max)}…`;
}
