"use client";

import { memo } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { CitationList } from "./CitationList";
import type { ChatMessage } from "./MessageList";

type Props = {
  msg: ChatMessage;
  onCopy?: (content: string) => void;
  streaming?: boolean;
  activeTools?: string[];
  streamingCitations?: import("@/lib/citations").Citation[];
};

export const MessageBubble = memo(function MessageBubble({
  msg,
  onCopy,
  streaming = false,
  activeTools,
  streamingCitations,
}: Props) {
  const isAssistant = msg.role === "assistant" || streaming;

  return (
    <article
      className={`message message--${msg.role}${streaming ? " message--streaming" : ""}`}
      aria-label={msg.role === "user" ? "用户" : "助手"}
    >
      <div className="message-head">
        <div className="message-role">{msg.role === "user" ? "你" : "助手"}</div>
        {!streaming && onCopy && msg.content.trim() && (
          <button
            type="button"
            className="message-action"
            onClick={() => onCopy(msg.content)}
            aria-label="复制消息"
          >
            复制
          </button>
        )}
      </div>
      {msg.toolSteps && msg.toolSteps.length > 0 && (
        <ul className="tool-steps">
          {msg.toolSteps.map((step, index) => (
            <li key={`${index}-${step}`}>{step}</li>
          ))}
        </ul>
      )}
      {streaming && activeTools && activeTools.length > 0 && (
        <ul className="tool-steps tool-steps--active">
          {activeTools.map((name, index) => (
            <li key={`${index}-${name}`}>调用 {name}…</li>
          ))}
        </ul>
      )}
      {(msg.citations?.length ?? 0) > 0 && (
        <CitationList items={msg.citations!} />
      )}
      {streaming && streamingCitations && streamingCitations.length > 0 && (
        <CitationList items={streamingCitations} />
      )}
      {(msg.content.trim() || streaming) && (
        <div className="message-body">
          {isAssistant ? (
            <MarkdownContent content={msg.content} />
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      )}
    </article>
  );
});
