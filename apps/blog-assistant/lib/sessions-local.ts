export type LocalSession = {
  threadId: string;
  title: string;
  updatedAt: string;
};

const STORAGE_KEY = "blog-assistant-sessions";
const MAX_SESSIONS = 30;

export const PLACEHOLDER_SESSION_TITLE = "新会话";

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

export function createLocalSession(threadId: string): LocalSession[] {
  return upsertLocalSession(threadId, PLACEHOLDER_SESSION_TITLE);
}

/** 首条用户消息后更新标题；已有真实标题时仅刷新 updatedAt */
export function updateLocalSessionTitle(
  threadId: string,
  message: string
): LocalSession[] {
  const sessions = loadLocalSessions();
  const existing = sessions.find((s) => s.threadId === threadId);
  const trimmed = trimTitle(message);

  if (
    existing &&
    existing.title !== PLACEHOLDER_SESSION_TITLE &&
    trimmed !== PLACEHOLDER_SESSION_TITLE
  ) {
    const entry: LocalSession = {
      ...existing,
      updatedAt: new Date().toISOString(),
    };
    const next = [
      entry,
      ...sessions.filter((s) => s.threadId !== threadId),
    ].slice(0, MAX_SESSIONS);
    saveLocalSessions(next);
    return next;
  }

  return upsertLocalSession(threadId, trimmed);
}

export function upsertLocalSession(
  threadId: string,
  title: string
): LocalSession[] {
  const sessions = loadLocalSessions().filter((s) => s.threadId !== threadId);
  const entry: LocalSession = {
    threadId,
    title: title.trim() || PLACEHOLDER_SESSION_TITLE,
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
  if (oneLine.length <= max) return oneLine || PLACEHOLDER_SESSION_TITLE;
  return `${oneLine.slice(0, max)}…`;
}
