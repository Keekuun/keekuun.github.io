"use client";

export type SessionItem = {
  threadId: string;
  title: string;
  updatedAt: string;
};

type Props = {
  sessions: SessionItem[];
  activeThreadId: string | null;
  persistence: "postgres" | "local";
  onSelect: (threadId: string) => void;
  onNew: () => void;
  onDelete: (threadId: string) => void;
  collapsed?: boolean;
  onToggle?: () => void;
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function SessionSidebar({
  sessions,
  activeThreadId,
  persistence,
  onSelect,
  onNew,
  onDelete,
  collapsed,
  onToggle,
}: Props) {
  if (collapsed) {
    return (
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label="展开会话列表"
      >
        会话
      </button>
    );
  }

  return (
    <aside className="session-sidebar" aria-label="会话列表">
      <div className="session-sidebar-head">
        <h2 className="session-sidebar-title">会话</h2>
        <div className="session-sidebar-actions">
          <button type="button" className="btn-ghost btn-sm" onClick={onNew}>
            新建
          </button>
          {onToggle && (
            <button type="button" className="btn-ghost btn-sm" onClick={onToggle}>
              收起
            </button>
          )}
        </div>
      </div>
      <p className="session-sidebar-hint">
        {persistence === "postgres" ? "Neon 持久化" : "本地列表 + 服务端 checkpoint"}
      </p>
      <ul className="session-list">
        {sessions.length === 0 && (
          <li className="session-empty">暂无历史会话</li>
        )}
        {sessions.map((session) => (
          <li
            key={session.threadId}
            className={`session-item ${activeThreadId === session.threadId ? "active" : ""}`}
          >
            <button
              type="button"
              className="session-item-main"
              onClick={() => onSelect(session.threadId)}
            >
              <span className="session-item-title">{session.title}</span>
              <span className="session-item-time">
                {formatTime(session.updatedAt)}
              </span>
            </button>
            <button
              type="button"
              className="session-item-delete"
              aria-label="删除会话"
              onClick={() => onDelete(session.threadId)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
