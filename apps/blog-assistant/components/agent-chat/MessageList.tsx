"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Citation } from "@/lib/citations";
import { MessageBubble } from "./MessageBubble";

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
  onCopy?: (content: string) => void;
  /** 无缓存时全屏加载占位 */
  switching?: boolean;
  /** 有缓存时后台同步，仅轻量提示 */
  syncing?: boolean;
};

const VIRTUAL_THRESHOLD = 12;
const STICKY_BOTTOM_PX = 96;

type Row =
  | { kind: "message"; message: ChatMessage }
  | {
      kind: "streaming";
      message: ChatMessage;
      activeTools: string[];
      streamingCitations: Citation[];
    };

function buildRows(
  messages: ChatMessage[],
  streamingText: string,
  activeTools: string[],
  streamingCitations: Citation[]
): Row[] {
  const rows: Row[] = messages.map((message) => ({ kind: "message", message }));

  const showStreaming =
    Boolean(streamingText.trim()) ||
    activeTools.length > 0 ||
    streamingCitations.length > 0;

  if (showStreaming) {
    rows.push({
      kind: "streaming",
      message: {
        id: "__streaming__",
        role: "assistant",
        content: streamingText,
      },
      activeTools,
      streamingCitations,
    });
  }

  return rows;
}

export function MessageList({
  messages,
  streamingText = "",
  activeTools = [],
  streamingCitations = [],
  onCopy,
  switching = false,
  syncing = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const rows = useMemo(
    () => buildRows(messages, streamingText, activeTools, streamingCitations),
    [messages, streamingText, activeTools, streamingCitations]
  );

  const useVirtual = rows.length >= VIRTUAL_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 132,
    overscan: 6,
    enabled: useVirtual,
  });

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollRef.current;
    if (!el) return;

    if (useVirtual && rows.length > 0) {
      virtualizer.scrollToIndex(rows.length - 1, {
        align: "end",
        behavior,
      });
      return;
    }

    el.scrollTo({ top: el.scrollHeight, behavior });
  }, [rows.length, useVirtual, virtualizer]);

  const updateStickiness = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distance <= STICKY_BOTTOM_PX;
    stickToBottomRef.current = nearBottom;
    setShowScrollBtn(!nearBottom && rows.length > 0);
  }, [rows.length]);

  useEffect(() => {
    if (switching) {
      stickToBottomRef.current = true;
      setShowScrollBtn(false);
      return;
    }
    if (!stickToBottomRef.current) return;
    scrollToBottom("auto");
  }, [rows, switching, scrollToBottom]);

  useEffect(() => {
    if (switching || syncing) return;
    if (!stickToBottomRef.current) return;
    scrollToBottom("auto");
  }, [streamingText, switching, syncing, scrollToBottom]);

  function handleScrollToBottomClick() {
    stickToBottomRef.current = true;
    setShowScrollBtn(false);
    scrollToBottom("smooth");
  }

  let listBody: ReactNode;

  if (switching) {
    listBody = (
      <div className="message-list-loading" role="status">
        <div className="message-list-loading-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>加载会话中…</p>
      </div>
    );
  } else if (rows.length === 0) {
    listBody = null;
  } else if (useVirtual) {
    const virtualRows = virtualizer.getVirtualItems();
    listBody = (
      <div
        className="message-virtual-spacer"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualRows.map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={row.message.id}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="message-virtual-row"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              {row.kind === "streaming" ? (
                <MessageBubble
                  msg={row.message}
                  streaming
                  activeTools={row.activeTools}
                  streamingCitations={row.streamingCitations}
                />
              ) : (
                <MessageBubble msg={row.message} onCopy={onCopy} />
              )}
            </div>
          );
        })}
      </div>
    );
  } else {
    listBody = rows.map((row) =>
      row.kind === "streaming" ? (
        <MessageBubble
          key={row.message.id}
          msg={row.message}
          streaming
          activeTools={row.activeTools}
          streamingCitations={row.streamingCitations}
        />
      ) : (
        <MessageBubble key={row.message.id} msg={row.message} onCopy={onCopy} />
      )
    );
  }

  return (
    <div
      className={`message-scroll-wrap${syncing ? " message-scroll-wrap--syncing" : ""}`}
    >
      {syncing && (
        <div className="message-sync-bar" role="status" aria-live="polite">
          同步会话…
        </div>
      )}
      <div
        ref={scrollRef}
        className="message-scroll"
        onScroll={updateStickiness}
        aria-live="polite"
      >
        <div className={`message-list${useVirtual ? " message-list--virtual" : ""}`}>
          {listBody}
        </div>
      </div>

      {showScrollBtn && (
        <button
          type="button"
          className="scroll-bottom-btn"
          onClick={handleScrollToBottomClick}
          aria-label="滚动到最新消息"
        >
          ↓ 最新
        </button>
      )}
    </div>
  );
}
