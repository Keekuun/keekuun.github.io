(function () {
  var script = document.currentScript;
  if (!script) return;

  var base = script.getAttribute("data-base") || "";
  if (!base) {
    var src = script.src || "";
    base = src.replace(/\/embed\.js.*$/, "");
  }
  base = base.replace(/\/$/, "");

  var position = script.getAttribute("data-position") || "right";
  var width = script.getAttribute("data-width") || "380px";
  var height = script.getAttribute("data-height") || "520px";

  var root = document.createElement("div");
  root.id = "blog-assistant-widget-root";
  root.style.cssText =
    "position:fixed;bottom:20px;" +
    (position === "left" ? "left:20px;" : "right:20px;") +
    "z-index:99999;font-family:system-ui,sans-serif;";

  var panel = document.createElement("div");
  panel.style.cssText =
    "display:none;width:" +
    width +
    ";height:" +
    height +
    ";border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.18);margin-bottom:12px;background:#fff;";

  var iframe = document.createElement("iframe");
  iframe.src = base + "/widget";
  iframe.title = "博客 AI 助手";
  iframe.style.cssText = "width:100%;height:100%;border:0;";
  iframe.allow = "clipboard-write";
  panel.appendChild(iframe);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "AI 助手";
  btn.setAttribute("aria-label", "打开博客 AI 助手");
  btn.style.cssText =
    "padding:10px 16px;border-radius:999px;border:none;background:#2563eb;color:#fff;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,.35);";

  var open = false;
  btn.addEventListener("click", function () {
    open = !open;
    panel.style.display = open ? "block" : "none";
    btn.textContent = open ? "关闭助手" : "AI 助手";
  });

  root.appendChild(panel);
  root.appendChild(btn);
  document.body.appendChild(root);
})();
