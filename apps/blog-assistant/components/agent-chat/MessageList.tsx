"use client";

import { MarkdownContent } from "@/components/MarkdownContent";
import { CitationList } from "./CitationList";
import type { Citation } from "@/lib/citations";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolSteps?: string[];
  citations?: Citation[];
};

type Props = {
  messages: ChatMessage[];
  streamingText?: string;
  activeTools?: string[];
  streamingCitations?: Citation[];
};

export function MessageList({
  messages,
  streamingText,
  activeTools,
  streamingCitations,
}: Props) {
  const showStreaming =
    Boolean(streamingText?.trim()) ||
    (activeTools?.length ?? 0) > 0 ||
    (streamingCitations?.length ?? 0) > 0;

  return (
    <div className="message-list" aria-live="polite">
      {messages.map((msg) => (
        <article
          key={msg.id}
          className={`message message--${msg.role}`}
          aria-label={msg.role === "user" ? "用户" : "助手"}
        >
          <div className="message-role">
            {msg.role === "user" ? "你" : "助手"}
          </div>
          {msg.toolSteps && msg.toolSteps.length > 0 && (
            <ul className="tool-steps">
              {msg.toolSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          )}
          {msg.citations && msg.citations.length > 0 && (
            <CitationList items={msg.citations} />
          )}
          <div className="message-body">
            {msg.role === "assistant" ? (
              <MarkdownContent content={msg.content} />
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        </article>
      ))}

      {showStreaming && (
        <article className="message message--assistant message--streaming">
          <div className="message-role">助手</div>
          {activeTools && activeTools.length > 0 && (
            <ul className="tool-steps tool-steps--active">
              {activeTools.map((name) => (
                <li key={name}>调用 {name}…</li>
              ))}
            </ul>
          )}
          {streamingCitations && streamingCitations.length > 0 && (
            <CitationList items={streamingCitations} />
          )}
          {streamingText && (
            <div className="message-body">
              <MarkdownContent content={streamingText} />
            </div>
          )}
        </article>
      )}
    </div>
  );
}
