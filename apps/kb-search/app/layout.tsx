import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "博客知识库 | 前端 Jeek",
  description: "语义搜索 VuePress 博客文章，支持 AI 总结",
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
