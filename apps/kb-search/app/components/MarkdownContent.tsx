"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  variant?: "default" | "compact";
};

export function MarkdownContent({ content, variant = "default" }: Props) {
  if (!content?.trim()) return null;

  return (
    <div
      className={`markdown-body ${variant === "compact" ? "markdown-body--compact" : ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer noopener">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
