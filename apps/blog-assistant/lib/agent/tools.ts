import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { formatHitsForTool } from "@/lib/vector";
import { retrieveBlogChunks } from "@/lib/rag/retriever";

export const searchBlogTool = tool(
  async ({ query }) => {
    const { hits } = await retrieveBlogChunks(query, { topK: 5, rerank: true });
    if (hits.length === 0) {
      return "未在博客向量库中找到相关内容。请确认已运行索引脚本（pnpm rag:index）。";
    }
    return formatHitsForTool(hits);
  },
  {
    name: "search_blog",
    description:
      "搜索本站技术博客（AI、前端、WebGL 等）。问本站文章、系列教程、API 用法时用。",
    schema: z.object({
      query: z.string().describe("检索关键词，中文或英文"),
    }),
  }
);

export const searchWikipediaTool = tool(
  async ({ query, lang }) => {
    const language = lang === "en" ? "en" : "zh";
    const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
    if (language === "zh") {
      searchUrl.hostname = "zh.wikipedia.org";
    }
    searchUrl.searchParams.set("action", "query");
    searchUrl.searchParams.set("list", "search");
    searchUrl.searchParams.set("srsearch", query);
    searchUrl.searchParams.set("format", "json");
    searchUrl.searchParams.set("origin", "*");

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) {
      return `维基百科搜索失败：${searchRes.status}`;
    }
    const searchData = (await searchRes.json()) as {
      query?: { search?: Array<{ title?: string }> };
    };
    const title = searchData.query?.search?.[0]?.title;
    if (!title) {
      return `维基百科未找到与「${query}」相关的条目。`;
    }

    const summaryHost =
      language === "zh" ? "https://zh.wikipedia.org" : "https://en.wikipedia.org";
    const summaryUrl = `${summaryHost}/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) {
      return `维基百科摘要获取失败：${summaryRes.status}`;
    }
    const summary = (await summaryRes.json()) as {
      title?: string;
      extract?: string;
      content_urls?: { desktop?: { page?: string } };
    };

    const pageUrl = summary.content_urls?.desktop?.page ?? summaryHost;
    const extract = summary.extract?.slice(0, 1200) ?? "";
    return `标题：${summary.title ?? title}\n链接：${pageUrl}\n摘要：${extract}`;
  },
  {
    name: "search_wikipedia",
    description:
      "搜索维基百科补充站外概念。问通用计算机/科学概念、非本站专属话题时用。",
    schema: z.object({
      query: z.string().describe("检索关键词"),
      lang: z
        .enum(["zh", "en"])
        .optional()
        .describe("语言，默认 zh"),
    }),
  }
);

export const agentTools = [searchBlogTool, searchWikipediaTool];
