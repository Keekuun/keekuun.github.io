---
title: NodeJS实践之服务器资源监控脚本
date: 2025-06-11
categories: 
- 后端
tags: 
- Node
- JS
---

> 由于测试机部署了大量测试环境的代码，有时候会出现磁盘空间不足需要扩容的情况，故实现一个脚本，用于监控 Linux 服务器的磁盘和内存使用情况，并在超出阈值时通过钉钉机器人发送预警通知。

### 最终脚本 (monitor.js)

这个脚本是开箱即用的，你只需要修改顶部的配置部分。它不依赖任何外部 npm 包，只使用 Node.js 的内置模块，非常轻量。

```javascript
// monitor.js
const { exec } = require('child_process');
const https = require('https');
const url = require('url');

// ======================= 配置区 START =======================

const CONFIG = {
  // 钉钉机器人的 Webhook 地址 (必填)
  // 如何获取: https://open.dingtalk.com/document/robots/custom-robot-access
  DINGTALK_WEBHOOK_URL: 'https://oapi.dingtalk.com/robot/send?access_token=YOUR_ACCESS_TOKEN_HERE',

  // 检查的磁盘路径，'/' 表示根目录
  DISK_PATH_TO_CHECK: '/',

  // 磁盘使用率预警阈值 (百分比, 例如 80 表示超过80%就预警)
  DISK_THRESHOLD_PERCENT: 80,

  // 内存使用率预警阈值 (百分比)
  MEMORY_THRESHOLD_PERCENT: 85,

  // 检查间隔 (秒)
  CHECK_INTERVAL_SECONDS: 300, // 5分钟检查一次

  // 是否在每次检查时都打印正常状态日志
  LOG_NORMAL_STATUS: true,
};

// ======================= 配置区 END =======================


/**
 * 执行 shell 命令并返回一个 Promise
 * @param {string} command 要执行的命令
 * @returns {Promise<string>} 命令的标准输出
 */
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令出错: ${command}`, error);
        return reject(error);
      }
      if (stderr) {
        // 有些命令会把信息输出到 stderr，例如 `df` 在某些情况下
        // 我们不把它当作硬性错误，但可以记录下来
        // console.warn(`命令 ${command} 的标准错误输出: ${stderr}`);
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * 获取内存使用率
 * @returns {Promise<number>} 内存使用率 (0-100)
 */
async function getMemoryUsage() {
  // `free -m` 使用 megabytes 为单位显示内存
  // 输出格式类似:
  //                total        used        free      shared  buff/cache   available
  // Mem:            7810        4943         454         654        2412        2202
  const output = await executeCommand('free -m');
  const lines = output.split('\n');
  if (lines.length < 2) {
    throw new Error('无法解析 "free -m" 的输出');
  }

  // 解析 'Mem:' 这一行
  const memLine = lines[1];
  const stats = memLine.split(/\s+/); // 按一个或多个空格分割

  // stats[0] 是 'Mem:', stats[1] 是 total, stats[2] 是 used
  const totalMemory = parseInt(stats[1], 10);
  const usedMemory = parseInt(stats[2], 10);

  if (isNaN(totalMemory) || isNaN(usedMemory) || totalMemory === 0) {
    throw new Error('解析内存数据失败');
  }

  const usagePercent = (usedMemory / totalMemory) * 100;
  return parseFloat(usagePercent.toFixed(2));
}

/**
 * 获取指定路径的磁盘使用率
 * @param {string} path 要检查的磁盘路径
 * @returns {Promise<number>} 磁盘使用率 (0-100)
 */
async function getDiskUsage(path) {
  // `df -P /` 使用 POSIX 格式输出，确保列数固定，方便解析
  // 输出格式类似:
  // Filesystem     1024-blocks      Used Available Capacity Mounted on
  // /dev/sda1         51591168  25191168  26399996      50% /
  const output = await executeCommand(`df -P ${path}`);
  const lines = output.split('\n');
  if (lines.length < 2) {
    throw new Error('无法解析 "df -P" 的输出');
  }

  // 解析第二行数据
  const diskLine = lines[1];
  const stats = diskLine.split(/\s+/);

  // stats[4] 是使用率百分比，例如 '50%'
  const usageString = stats[4];
  if (!usageString || !usageString.includes('%')) {
    throw new Error('解析磁盘数据失败');
  }

  const usagePercent = parseInt(usageString.replace('%', ''), 10);
  return usagePercent;
}

/**
 * 发送钉钉通知
 * @param {string} title 标题
 * @param {string} message markdown格式的消息内容
 */
function sendDingTalkAlert(title, message) {
  const webhookUrl = CONFIG.DINGTALK_WEBHOOK_URL;
  if (!webhookUrl.includes('https://oapi.dingtalk.com')) {
    console.error('无效的钉钉 Webhook 地址，请检查配置。');
    return;
  }

  const postData = JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      title: title,
      text: message,
    },
  });

  const options = {
    ...url.parse(webhookUrl),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    let responseBody = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      console.log('钉钉通知发送成功:', responseBody);
    });
  });

  req.on('error', (e) => {
    console.error(`发送钉钉通知失败: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

/**
 * 主检查函数
 */
async function checkSystemUsage() {
  const now = new Date().toLocaleString();
  console.log(`[${now}] 开始检查系统状态...`);

  try {
    const [memoryUsage, diskUsage] = await Promise.all([
      getMemoryUsage(),
      getDiskUsage(CONFIG.DISK_PATH_TO_CHECK),
    ]);

    const isMemoryAlert = memoryUsage > CONFIG.MEMORY_THRESHOLD_PERCENT;
    const isDiskAlert = diskUsage > CONFIG.DISK_THRESHOLD_PERCENT;

    if (isMemoryAlert || isDiskAlert) {
      // 构建预警信息
      const title = '🚨 服务器资源预警';
      let message = `### ${title}\n\n`;
      message += `> **主机名:** ${process.env.HOSTNAME || '未知'}\n`;
      message += `> **检查时间:** ${now}\n\n`;

      if (isDiskAlert) {
        message += `**🔴 磁盘使用率过高!**\n`;
        message += `- **路径:** \`${CONFIG.DISK_PATH_TO_CHECK}\`\n`;
        message += `- **当前使用率:** \`${diskUsage}%\`\n`;
        message += `- **阈值:** \`${CONFIG.DISK_THRESHOLD_PERCENT}%\`\n\n`;
      }

      if (isMemoryAlert) {
        message += `**🟠 内存使用率过高!**\n`;
        message += `- **当前使用率:** \`${memoryUsage}%\`\n`;
        message += `- **阈值:** \`${CONFIG.MEMORY_THRESHOLD_PERCENT}%\`\n\n`;
      }
    
      console.warn('检测到资源超标，准备发送通知...');
      sendDingTalkAlert(title, message);

    } else {
      if(CONFIG.LOG_NORMAL_STATUS) {
        console.log(`[状态正常] 内存: ${memoryUsage}%, 磁盘: ${diskUsage}%`);
      }
    }
  } catch (error) {
    console.error('检查过程中发生严重错误:', error);
    // 可以在这里发送一条关于脚本错误的通知
    sendDingTalkAlert(
        '🚨 监控脚本错误', 
        `### 监控脚本执行失败\n\n**错误信息:**\n\`\`\`\n${error.message}\n\`\`\``
    );
  }
}

// --- 脚本启动 ---
console.log('启动系统资源监控脚本...');
console.log(`检查间隔: ${CONFIG.CHECK_INTERVAL_SECONDS} 秒`);

// 立即执行一次，然后设置定时器
checkSystemUsage();
setInterval(checkSystemUsage, CONFIG.CHECK_INTERVAL_SECONDS * 1000);
```

### 如何使用

#### 步骤 1: 获取钉钉机器人 Webhook

1.  在你的钉钉群组中，点击 "群设置" -> "智能群助手"。
2.  点击 "添加机器人"，选择 "自定义" 机器人。
3.  给机器人起个名字（例如 "服务器监控助手"），阅读并勾选同意书。
4.  在 "安全设置" 中，选择一种安全方式。**推荐使用 "加签"**，这更安全。但为了简化示例，我们先用最简单的 "自定义关键词"，比如可以设置为 "预警"。
5.  点击 "完成"，你会得到一个格式为 `https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxx` 的 Webhook 地址。**复制这个地址**。

#### 步骤 2: 配置并上传脚本

1.  将上面的代码保存为 `monitor.js` 文件。
2.  打开 `monitor.js`，找到顶部的 `CONFIG` 配置区。
3.  将你复制的钉钉 Webhook 地址粘贴到 `DINGTALK_WEBHOOK_URL` 的值中。
4.  根据你的需求，修改 `DISK_THRESHOLD_PERCENT`（磁盘阈值）、`MEMORY_THRESHOLD_PERCENT`（内存阈值）和 `CHECK_INTERVAL_SECONDS`（检查间隔）。
5.  将配置好的 `monitor.js` 文件上传到你的 Linux 测试服务器上。

#### 步骤 3: 运行脚本

你可以通过 SSH 连接到你的 Linux 服务器，然后执行以下命令。

**1. 前台运行（用于测试）**

直接运行脚本，你可以实时看到日志输出。当你关闭 SSH 连接时，脚本会停止。

```bash
# 确保你已经安装了 Node.js (推荐 v14 或更高版本)
node -v 

# 运行脚本
node monitor.js
```

如果一切正常，你会立刻看到第一次检查的日志。如果资源使用率超标，你的钉钉群就会收到一条格式精美的 Markdown 通知。

**2. 后台持久化运行（推荐用于生产环境）**

为了让脚本在你关闭 SSH 连接后依然持续运行，你需要使用一个进程管理工具，`pm2` 是 Node.js 生态中最优秀的选择。

```bash
# 全局安装 pm2 (如果尚未安装)
npm install pm2 -g

# 使用 pm2 启动你的监控脚本
pm2 start monitor.js --name "system-monitor"

# 查看 pm2 管理的进程列表
pm2 list

# 查看实时日志
pm2 logs system-monitor

# 停止脚本
pm2 stop system-monitor

# 设置开机自启 (非常重要！)
# 这会生成一行命令，你需要复制并执行它
pm2 startup
# ...执行 pm2 startup 生成的命令...
pm2 save
```

使用 `pm2` 后，你的监控脚本就会像一个系统服务一样，在后台稳定运行，并且在服务器重启后自动恢复。

这样，你就拥有了一个轻量、可靠且完全由自己掌控的服务器监控系统了。

> **注意**: 这个脚本只是针对 linux 系统的
> 
> 跨平台实现：https://github.com/Keekuun/nodejs-vitest-demo/blob/main/src/nodejs/monitor.js
