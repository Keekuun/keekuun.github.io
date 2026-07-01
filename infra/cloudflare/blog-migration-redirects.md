# Cloudflare 301：主博客 AI / 3D 旧链接跳转

主站已删除 `docs/ai`、`docs/3d`，旧 URL（如 `blog.zkkysqs.top/ai/11-advanced-rag-patterns.html`）会 404。  
在 **Cloudflare** 为 `blog.zkkysqs.top` 配置 **Redirect Rules**（301），将流量转到独立站点。

## 操作路径

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择域名 **zkkysqs.top**
3. **Rules** → **Redirect Rules** → **Create rule**
4. 按下面两条规则各建一次（顺序：AI 在前、3D 在后即可）

---

## 规则 1：AI Lab

| 项 | 值 |
|----|-----|
| **Rule name** | `blog-ai-to-ai-lab` |
| **When** | Custom filter expression（见下） |
| **Then** | Dynamic |
| **Status code** | `301` |
| **Preserve query string** | 开启 |

**When（表达式）：**

```
(http.host eq "blog.zkkysqs.top" and (http.request.uri.path eq "/ai" or starts_with(http.request.uri.path, "/ai/")))
```

**Then → URL（动态表达式）：**

```
concat(
  "https://ai.zkkysqs.top",
  if(
    http.request.uri.path eq "/ai" or http.request.uri.path eq "/ai/" or http.request.uri.path eq "/ai/index.html" or http.request.uri.path eq "/ai/README.html",
    "/",
    if(
      http.request.uri.path matches "^/ai/.+/README\\.html$",
      regex_replace(
        regex_replace(http.request.uri.path, "^/ai/", "/"),
        "README\\.html$",
        ""
      ),
      regex_replace(
        regex_replace(http.request.uri.path, "^/ai", ""),
        "\\.html$",
        ""
      )
    )
  )
)
```

**映射示例：**

| 旧 URL | 新 URL |
|--------|--------|
| `/ai/` | `https://ai.zkkysqs.top/` |
| `/ai/11-advanced-rag-patterns.html` | `https://ai.zkkysqs.top/11-advanced-rag-patterns` |
| `/ai/langchain/01-runnable-lcel.html` | `https://ai.zkkysqs.top/langchain/01-runnable-lcel` |
| `/ai/langchain/README.html` | `https://ai.zkkysqs.top/langchain/` |

---

## 规则 2：3D Lab

| 项 | 值 |
|----|-----|
| **Rule name** | `blog-3d-to-3d-lab` |
| **When** | Custom filter expression（见下） |
| **Then** | Dynamic |
| **Status code** | `301` |
| **Preserve query string** | 开启 |

**When（表达式）：**

```
(http.host eq "blog.zkkysqs.top" and (http.request.uri.path eq "/3d" or starts_with(http.request.uri.path, "/3d/")))
```

**Then → URL（动态表达式）：**

```
concat(
  "https://3d.zkkysqs.top",
  if(
    http.request.uri.path eq "/3d" or http.request.uri.path eq "/3d/" or http.request.uri.path eq "/3d/index.html" or http.request.uri.path eq "/3d/README.html",
    "/",
    if(
      http.request.uri.path matches "^/3d/.+/README\\.html$",
      regex_replace(
        regex_replace(http.request.uri.path, "^/3d/", "/"),
        "README\\.html$",
        ""
      ),
      regex_replace(
        regex_replace(http.request.uri.path, "^/3d", ""),
        "\\.html$",
        ""
      )
    )
  )
)
```

**映射示例：**

| 旧 URL | 新 URL |
|--------|--------|
| `/3d/threejs/02-first-scene.html` | `https://3d.zkkysqs.top/threejs/02-first-scene` |
| `/3d/webgl/12-textures.html` | `https://3d.zkkysqs.top/webgl/12-textures` |
| `/3d/threejs/README.html` | `https://3d.zkkysqs.top/threejs/` |

---

## 验证

规则 **Deploy** 后，在终端执行（应返回 `301` 且 `location` 指向新站）：

```bash
curl -sI 'https://blog.zkkysqs.top/ai/19-blog-ai-assistant-capstone.html' | grep -iE '^(HTTP|location:)'
curl -sI 'https://blog.zkkysqs.top/3d/threejs/02-first-scene.html' | grep -iE '^(HTTP|location:)'
```

期望：

```
HTTP/2 301
location: https://ai.zkkysqs.top/19-blog-ai-assistant-capstone
```

```
HTTP/2 301
location: https://3d.zkkysqs.top/threejs/02-first-scene
```

## 说明

- 仅处理 **blog.zkkysqs.top** 子域，不影响 `ai.zkkysqs.top`、`3d.zkkysqs.top`。
- 免费版 Redirect Rules 有配额（通常足够 2 条规则）。
- 若曾用 Page Rules 做同类跳转，避免重复，保留 Redirect Rules 即可。
