---
title: GitHub Actions 自动化构建并发布 Release 版本
date: 2025-7-25
categories: 
- CI/CD
tags: 
- CI/CD
- GitHub Actions

---

## GitHub Actions 自动打包并发布你的应用

在日常开发中，当我们完成一个版本的功能后，最繁琐、也最容易出错的环节莫过于手动打包、命名、上传和发布。这个过程不仅耗时，还充满了重复性劳动。我们可以利用 GitHub Actions 实现**自动化发布**：每当你推送一个版本标签（如 `v1.0.0`），系统就会自动为你构建应用、打包产物，并创建一个带附件的 GitHub Release。

我们将通过两个真实的案例来学习：
1.  **一个 Node.js (Next.js) Web 应用**：使用高效的 `pnpm` 包管理器。
2.  **一个 Flutter 移动应用**：构建并签名一个 Android APK。

### 一、核心概念：GitHub Actions 是如何工作的？

在我们开始编写代码之前，先理解几个关键概念：

*   **Workflow (工作流)**：自动化过程的定义文件，存放在 `.github/workflows/` 目录下，使用 YAML 格式编写。
*   **Event (事件)**：触发工作流的特定活动，比如 `push` 代码、`pull_request`，或者我们这次要用的 `push` 一个标签。
*   **Job (任务)**：工作流由一个或多个任务组成，每个任务都在一个独立的运行器（Runner）虚拟机上执行。
*   **Step (步骤)**：任务中的最小执行单元，可以是一个 shell 命令或一个可复用的**Action**。
*   **Action (动作)**：一个预先打包好的脚本，用于执行复杂或重复的操作，例如 `actions/checkout` (检出代码) 或 `pnpm/action-setup` (安装 pnpm)。

我们的目标流程非常清晰：
**当 `v*` 格式的标签被推送到仓库时 -> 启动一个任务 -> 检出代码 -> 设置环境 -> 安装依赖 -> 构建 -> 打包 -> 创建 Release 并上传包。**

### 二、实战案例 1：自动化发布 Node.js 应用 (pnpm)

对于前端或 Node.js 项目，我们的目标是运行构建命令（如 `pnpm build`），然后将构建产物（如 `.next` 或 `dist` 目录）打包成 `.zip` 和 `.tar.gz` 文件上传。

> [查看github nextjs demo release](https://github.com/Keekuun/nextjs-dashboard/releases)

#### 最终工作流文件 (`.github/workflows/release-nodejs.yml`)

```yaml
name: Build and Release Node.js App (pnpm)

on:
  push:
    tags:
      - 'v*' # 仅在推送 v 开头的标签时触发

# 关键点：授权工作流写入内容，用于创建 Release
# https://github.com/softprops/action-gh-release
permissions:
  contents: write

jobs:
  build-and-release:
    name: Build and Release
    runs-on: ubuntu-latest # 使用最新的 Ubuntu 运行器

    steps:
      # 1. 检出代码
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. 安装 pnpm - 这是 pnpm 项目的关键一步
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          # 注意 如果 package.json 中存在 
          version: 8 # 锁定主版本以保证稳定性

      # 3. 设置 Node.js 环境，并启用 pnpm 缓存
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm' # <-- 关键！让 setup-node 知道要缓存 pnpm 的全局存储

      # 4. 安装依赖 (使用 --frozen-lockfile 保证可复现性)
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # 5. 构建项目
      - name: Build application
        run: pnpm run build

      # 6. 打包产物 (为不同系统提供不同格式)
      - name: Create release package (TAR.GZ)
        # 将 .next 目录打包，并以版本号命名
        run: tar -czvf web-app-${{ github.ref_name }}.tar.gz .next

      - name: Create release package (ZIP)
        run: zip -r web-app-${{ github.ref_name }}.zip .next

      # 7. 创建 GitHub Release 并上传所有包
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          # 上传所有 .tar.gz 和 .zip 文件
          files: |
            *.tar.gz
            *.zip
```

#### 关键点解析 (运维视角)
*   **`cache: 'pnpm'`**: 这是 `pnpm` 工作流的性能核心。它告诉 GitHub Actions 去缓存 `pnpm` 的全局内容寻址存储区，而不是项目本地的 `node_modules`。这使得依赖缓存的命中率极高，能大幅缩短安装时间。
*   `pnpm install --frozen-lockfile`：等同于 `npm ci`，它强制根据 `pnpm-lock.yaml` 文件安装，确保了 CI 环境与本地开发环境的依赖完全一致，是**可复现构建**的基石。

---

### 三、实战案例 2：自动化发布 Flutter 应用 (Android APK)

对于移动应用，挑战升级了：我们不仅要构建，还需要**安全地处理签名密钥**来生成一个可发布的 release 版本 APK。

#### 最终工作流文件 (`.github/workflows/release-flutter.yml`)

```yaml
name: Build & Release Flutter APK

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  build-and-release-android:
    name: Build & Release Android APK
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. 设置 Flutter 环境 (推荐使用 .flutter-version 文件来锁定版本)
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          cache: true # 启用 Flutter SDK 缓存

      # 3. 解码并配置签名密钥 - 这是最关键的一步！
      - name: Decode and setup Keystore
        if: ${{ secrets.KEYSTORE_BASE64 != '' && secrets.KEY_PROPERTIES != '' }}
        run: |
          echo "Setting up keystore for signing..."
          echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 --decode > android/app/upload-keystore.jks
          echo "${{ secrets.KEY_PROPERTIES }}" > android/key.properties
          echo "Keystore setup complete."

      # 4. 安装依赖
      - name: Install dependencies
        run: flutter pub get

      # 5. 构建 release 版本的 APK
      - name: Build release APK
        run: flutter build apk --release

      # 6. 重命名 APK，使其包含版本标签，便于识别
      - name: Rename APK file
        run: mv build/app/outputs/flutter-apk/app-release.apk build/app/outputs/flutter-apk/app-${{ github.ref_name }}.apk

      # 7. 创建 GitHub Release 并上传 APK
      - name: Create GitHub Release and Upload APK
        uses: softprops/action-gh-release@v2
        with:
          files: build/app/outputs/flutter-apk/app-${{ github.ref_name }}.apk
```

#### 关键点解析 (运维视角)
*   **Secrets 管理**: 签名密钥是高度敏感的信息，绝不能硬编码在代码里。我们使用 **GitHub Repository Secrets** 来安全地存储它们 (`KEYSTORE_BASE64` 和 `KEY_PROPERTIES`)。
*   **在运行器中重建密钥文件**: `secrets` 只是安全的变量存储。在 CI 运行时，我们必须通过 `run` 命令将这些变量内容写回文件系统中的 `upload-keystore.jks` 和 `key.properties` 文件，这样 Flutter 的构建工具才能找到并使用它们进行签名。这是许多人初次配置时最容易忽略的地方。
*   **使用 `.flutter-version` 文件**: 在项目根目录创建一个 `.flutter-version` 文件并写入 Flutter 版本号（如 `3.16.9`）。`subosito/flutter-action` 会自动读取它，确保本地和 CI 使用完全一致的 Flutter SDK，避免环境不一致导致的构建失败。

---

### 四、运维最佳实践与故障排查

#### 最佳实践
1.  **版本锁定 (Pinning)**：总是锁定你的 Actions (`@v4`, `@v2`) 和工具 (`node-version: '20'`, `pnpm version: 8`) 的主版本号。这可以防止上游工具的破坏性更新意外搞砸你的构建。
2.  **依赖锁文件**：始终将 `pnpm-lock.yaml` (Node.js) 或 `pubspec.lock` (Flutter) 文件提交到你的 Git 仓库。这是保证构建可复现性的生命线。
3.  **使用缓存**：无论是 `pnpm` 还是 `Flutter SDK`，充分利用缓存可以显著提升构建速度，尤其是在大型项目中。

#### "我的 Action 为什么没有触发？" - 故障排查清单
*   **检查标签格式**：推送的标签是否以 `v` 开头？例如 `v1.0.0`。
*   **检查推送命令**：是否真的将标签推送到远程了？`git push` 不会推送标签，你必须使用 `git push origin <tag_name>` 或 `git push --tags`。
*   **检查文件位置**：检查 workflow 文件是否在正确的位置：`.github/workflows/your-file.yml`？目录和文件名都不能错。
*   **检查默认分支**：检查 workflow 文件是否已经合并到了默认分支（通常是 `main`）？标签是基于某个 commit 的，如果那个 commit 的历史里没有这个 workflow 文件，它就不会被执行。
*   **检查 Actions 是否被禁用**：在仓库的 `Settings` -> `Actions` -> `General` 中，确认 Actions 是否被允许运行。

### 总结

通过 GitHub Actions，我们把一个复杂、易错的手动流程，变成了一个可靠、高效、完全自动化的系统。现在，每次想发布一个新版本时，只需要专注于打好你的版本标签，然后 `git push`。一杯咖啡的时间，一个包含所有构建产物的正式 Release 就会出现在你的 GitHub 仓库中，等待交付给你的用户。

> [github release actions](https://github.com/softprops/action-gh-release)
> 
> [github nextjs demo release](https://github.com/Keekuun/nextjs-dashboard/releases)
> 
> [github flutter demo release](https://github.com/Keekuun/todo_list/releases)
