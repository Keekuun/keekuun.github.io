import { createChatClient, getChatModel } from "@/lib/ai";
import { isDemoMode } from "@/lib/demo-mode";

export type HydeMode = "off" | "auto" | "on";

export function getHydeMode(): HydeMode {
  const value = (process.env.RAG_HYDE || "auto").trim().toLowerCase();
  if (value === "0" || value === "off" || value === "false") return "off";
  if (value === "1" || value === "on" || value === "true") return "on";
  return "auto";
}

function shouldUseHyde(query: string, historyLength: number): boolean {
  const mode = getHydeMode();
  if (mode === "off") return false;
  if (mode === "on") return true;

  if (historyLength > 0) return true;
  if (query.trim().length < 10) return false;
  return (
    query.length > 24 ||
    /如何|怎么|怎样|区别|关系|为什么|哪些|对比|原理|步骤|部署|实现/.test(query)
  );
}

/** HyDE：生成假设性文档段落用于 Embedding 检索（对齐 11 RAG 进阶） */
export async function expandQueryWithHyde(
  query: string,
  contextualQuery: string,
  historyLength = 0
): Promise<{ embeddingQuery: string; usedHyde: boolean }> {
  if (!shouldUseHyde(query, historyLength)) {
    return { embeddingQuery: contextualQuery, usedHyde: false };
  }
  if (isDemoMode()) {
    return { embeddingQuery: contextualQuery, usedHyde: false };
  }

  try {
    const client = createChatClient();
    const model = getChatModel();
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "你是本站技术博客的检索助手。根据用户问题，写一段「可能出现在博客中的」中文段落（120 字内，关键词密集，不要开场白）。",
        },
        { role: "user", content: contextualQuery },
      ],
    });

    const hypothetical = completion.choices[0]?.message?.content?.trim();
    if (!hypothetical) {
      return { embeddingQuery: contextualQuery, usedHyde: false };
    }

    return {
      embeddingQuery: `${contextualQuery}\n\n${hypothetical}`,
      usedHyde: true,
    };
  } catch {
    return { embeddingQuery: contextualQuery, usedHyde: false };
  }
}
