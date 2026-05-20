import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "博客知识库 | 前端 Jeek",
  description: "语义搜索 VuePress 博客文章，支持 AI 总结",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", type: "image/svg+xml" }],
  },
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
