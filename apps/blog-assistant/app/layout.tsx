import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "博客 AI 助手 | 前端 Jeek",
  description: "LangGraph Agent + 博客 RAG 流式对话（收官实战）",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
