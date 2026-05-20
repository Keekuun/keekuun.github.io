import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "博客知识库检索",
  description: "基于 Upstash Vector 的博客 RAG 检索",
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
