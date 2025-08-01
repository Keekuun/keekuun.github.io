<template>
  <div v-show="isVisible" class="context-menu" :style="{
    top: `${y}px`,
    left: `${x}px`,
    '--theme-color': themeColor,
    '--bg-light': '#ffffff',
    '--bg-dark': '#1e1b2d',
    '--text-light': '#4a4158',
    '--text-dark': '#e2e0e7',
    '--border-light': '#f3f0ff',
    '--border-dark': '#2d2644',
    '--header-gradient-light': 'linear-gradient(to right, #f9f5ff, #f5f3ff)',
    '--header-gradient-dark': 'linear-gradient(to right, #312a48, #2d2644)',
    '--divider-light': '#f0e6ff',
    '--divider-dark': '#372f52',
    '--hover-light': '#f5f3ff',
    '--hover-dark': '#352e54',
  }">
    <div class="menu-container">
      <!-- 头部区域 -->
      <div class="menu-header">
        <div class="menu-title-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <span :style="{ color: themeColor }">{{ useWebsite.webInfo?.websiteName }}</span>

        <div class="menu-title-icon screen" @click="toggleFullscreen">
          <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
            <path v-if="isFullScreen"
              d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            <path v-else
              d="M20 9V6.616q0-.231-.192-.424T19.385 6H17V5h2.385q.69 0 1.152.463T21 6.616V9zM3 9V6.616q0-.691.463-1.153T4.615 5H7v1H4.616q-.231 0-.424.192T4 6.616V9zm14 10v-1h2.385q.23 0 .423-.192t.192-.424V15h1v2.385q0 .69-.462 1.152T19.385 19zM4.615 19q-.69 0-1.153-.462T3 17.384V15h1v2.385q0 .23.192.423t.423.192H7v1zm2.231-3.846V8.846h10.308v6.308zm1-1h8.308V9.846H7.846zm0 0V9.846z" />
          </svg>
        </div>

      </div>

      <!-- 菜单项列表 todo 后续改造为通过数据驱动渲染菜单 -->

      <!--      <ul class="menu-items">
        <li class="menu-item" @click="navigateTo(item.path)" v-for="item in useWebsite.menuInfo">
          <div class="menu-item-icon">
            <div v-html="item.svg"></div>
          </div>
          <span>{{ item.text }}</span>
        </li>
      </ul>-->

      <ul class="menu-items">
        <!-- 首页 -->
        <li class="menu-item" @click="navigateTo('/')">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span>首页</span>
        </li>

        <!-- 关于我 -->
        <li class="menu-item" @click="navigateTo('/about-me')">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.23 7.23 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10" />
            </svg>
          </div>
          <span>关于我</span>
        </li>

        <!-- 其他（子菜单） -->
        <li class="menu-item has-submenu">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 5h13" />
              <path d="M4 10h10" />
              <path d="M4 15h16" />
              <path d="M4 20h13" />
            </svg>
          </div>
          <span>其他</span>
          <div class="menu-item-arrow">
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <ul class="submenu" :style="themeColor">
            <li class="submenu-item" @click.stop="navigateTo('/tree-hole')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <span>树洞</span>
            </li>
            <li class="submenu-item" @click.stop="navigateTo('/message')">
              <div class="submenu-item-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span>留言板</span>
            </li>
          </ul>
        </li>

        <!-- 友链 -->
        <li class="menu-item" @click="navigateTo('/friend-link')">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <span>友链</span>
        </li>

        <!-- 音乐 -->
        <li class="menu-item" @click="navigateTo('/music')">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <span>音乐</span>
        </li>

        <!-- 相册 -->
        <li class="menu-item" @click="navigateTo('/photo')">
          <div class="menu-item-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <span>相册</span>
        </li>

        <!-- 分割线 -->
        <li class="menu-divider"></li>

        <!-- 刷新页面 - 特殊样式 -->
        <li class="menu-item refresh-item" @click="handleRefresh">
          <div class="menu-item-icon">
            <!--            <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>-->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <rect width="7.33" height="7.33" x="1" y="1" fill="currentColor">
                <animate id="svgSpinnersBlocksWave0" attributeName="x" begin="0;svgSpinnersBlocksWave1.end+0.3s"
                  dur="0.9s" values="1;4;1" />
                <animate attributeName="y" begin="0;svgSpinnersBlocksWave1.end+0.3s" dur="0.9s" values="1;4;1" />
                <animate attributeName="width" begin="0;svgSpinnersBlocksWave1.end+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="0;svgSpinnersBlocksWave1.end+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="8.33" y="1" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s"
                  values="8.33;11.33;8.33" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s" values="1;4;1" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="1" y="8.33" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s" values="1;4;1" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s"
                  values="8.33;11.33;8.33" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.15s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="15.66" y="1" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="15.66;18.66;15.66" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s" values="1;4;1" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="8.33" y="8.33" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="8.33;11.33;8.33" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="8.33;11.33;8.33" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="1" y="15.66" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s" values="1;4;1" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="15.66;18.66;15.66" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.3s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="15.66" y="8.33" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="15.66;18.66;15.66" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="8.33;11.33;8.33" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="8.33" y="15.66" fill="currentColor">
                <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="8.33;11.33;8.33" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="15.66;18.66;15.66" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.45s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
              <rect width="7.33" height="7.33" x="15.66" y="15.66" fill="currentColor">
                <animate id="svgSpinnersBlocksWave1" attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.6s"
                  dur="0.9s" values="15.66;18.66;15.66" />
                <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.6s" dur="0.9s"
                  values="15.66;18.66;15.66" />
                <animate attributeName="width" begin="svgSpinnersBlocksWave0.begin+0.6s" dur="0.9s"
                  values="7.33;1.33;7.33" />
                <animate attributeName="height" begin="svgSpinnersBlocksWave0.begin+0.6s" dur="0.9s"
                  values="7.33;1.33;7.33" />
              </rect>
            </svg>
          </div>
          <span>刷新页面</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, nextTick } from 'vue';
import { useRouter, useRoute, withBase } from 'vitepress'; // 引入 VitePress 路由
import { Website } from "./Website"
import { useFullscreen } from "./useFullscreen.mjs"
// 自定义处理全屏事件hook
const { isFullScreen, toggleFullscreen } = useFullscreen();
const useWebsite = ref(Website)

const router = useRouter(); // 获取 VitePress 路由实例
const route = useRoute();
const isVisible = ref(false);
const x = ref(0);
const y = ref(0);
// 缓存DOM元素引用
let contextMenu: HTMLElement | null = null;

// 子菜单可见状态
const submenuVisible = reactive({
  'archive': false,
  'others': false
});

// 主题颜色
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark');
});

const themeColor = computed(() => {
  return isDarkMode.value ? '#a78bfa' : '#8b5cf6';
});


function getContextMenu() {
  if (!contextMenu) {
    contextMenu = document.querySelector('.context-menu') as HTMLElement;
  }
  return contextMenu;
}

// 显示菜单
const showMenu = (event: MouseEvent) => {
  event.preventDefault();

  const element = getContextMenu();
  if (!element) return;

  // 先显示菜单以获取准确尺寸（但不可见）
  element.style.visibility = 'hidden';
  element.style.display = 'block';

  // 获取菜单和子菜单的精确尺寸
  const menuRect = element.getBoundingClientRect();
  const submenuWidth = 180; // 子菜单宽度（假设固定）

  // 初始位置为鼠标位置
  let posX = event.clientX;
  let posY = event.clientY;

  // 计算安全区域内的位置
  const rightEdge = window.innerWidth - 10; // 右侧安全边距
  const bottomEdge = window.innerHeight - 10; // 底部安全边距

  // 处理右侧溢出
  if (posX + menuRect.width + submenuWidth > rightEdge) {
    posX = Math.max(10, rightEdge - menuRect.width);
  }

  // 处理底部溢出
  if (posY + menuRect.height > bottomEdge) {
    posY = Math.max(10, bottomEdge - menuRect.height);
  }

  // 应用位置样式
  x.value = posX;
  y.value = posY;
  isVisible.value = true;

  // 延迟显示以确保位置计算完成
  setTimeout(() => {
    element.style.visibility = 'visible';
  }, 0);

  // 关闭所有子菜单
  Object.keys(submenuVisible).forEach(key => {
    submenuVisible[key] = false;
  });

  // 确保子菜单位置正确显示
  adjustSubmenuPositions();
}

// 调整子菜单位置，防止溢出屏幕
const adjustSubmenuPositions = () => {
  const submenus = document.querySelectorAll('.submenu') as NodeListOf<HTMLElement>;

  // 使用 requestAnimationFrame 批量处理样式更新
  requestAnimationFrame(() => {
    submenus.forEach(submenu => {
      const parentItem = submenu.closest('.has-submenu') as HTMLElement;

      // 重置样式以便获取初始位置
      submenu.style.left = '';
      submenu.style.right = '';
      submenu.style.top = '';

      // 获取父菜单项和子菜单的边界矩形
      const parentRect = parentItem.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();

      // 计算可用空间
      const availableRight = window.innerWidth - parentRect.right;
      const availableLeft = parentRect.left;
      const availableBottom = window.innerHeight - parentRect.bottom;
      const availableTop = parentRect.top;

      // 水平方向定位
      if (submenuRect.width > availableRight && availableLeft > availableRight) {
        // 右侧空间不足且左侧空间更大，向左显示
        submenu.style.right = '100%';
        submenu.style.left = 'auto';
      } else {
        // 默认向右显示
        submenu.style.left = '100%';
        submenu.style.right = 'auto';
      }

      // 垂直方向定位
      if (submenuRect.height > availableBottom && availableTop > availableBottom) {
        // 底部空间不足且顶部空间更大，向上显示
        submenu.style.top = `-${submenuRect.height - parentRect.height}px`;
      } else {
        // 默认向下显示
        submenu.style.top = '0';
      }
    });
  });
}

// 窗口大小变化时重新定位菜单
const handleResize = () => {
  if (isVisible.value) {
    adjustSubmenuPositions();
  }
};

// 隐藏菜单
const hideMenu = () => {
  isVisible.value = false;

  // 关闭所有子菜单
  Object.keys(submenuVisible).forEach(key => {
    submenuVisible[key] = false;
  });
};

// 导航到指定路由
const navigateTo = (path: string) => {
  const targetPath = withBase(path);
  const currentPath = route.path;

  console.log("targetPath", targetPath, "currentPath", currentPath)
  // 如果当前路径和目标路径相同，则不执行导航
  if (currentPath === targetPath) {
    hideMenu();
    return;
  }

  router.go(targetPath); // 使用 VitePress 路由的 goTo 方法
  hideMenu();
};

// 刷新页面
const handleRefresh = () => {
  window.location.reload();
  hideMenu();
};

// 点击其他地方时隐藏菜单
const handleClick = (event: MouseEvent) => {
  const contextMenu = getContextMenu();
  if (isVisible.value && contextMenu && !contextMenu.contains(event.target as Node)) {
    hideMenu();
  }
};


// 键盘ESC键关闭菜单
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    hideMenu();
  }
};

onMounted(() => {
  document.addEventListener('contextmenu', showMenu);
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);

});

onUnmounted(() => {
  document.removeEventListener('contextmenu', showMenu);
  document.removeEventListener('click', handleClick);
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
/* 右键菜单整体样式 */
.context-menu {
  position: fixed;
  z-index: 100000;
  user-select: none;
  animation: fadeIn 0.2s ease-out;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15));
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 菜单容器 */
.menu-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
  border: 1px solid #f3f0ff;
  min-width: 240px;
  color: #4a4158;
  position: relative;
  transition: all 0.2s ease;
  animation: slideIn 0.2s ease;
  overflow: visible !important;
  font-family: var(--vp-font-family-base);
}

html[class*='dark'] .menu-container {
  background-color: var(--bg-dark);
  border: 1px solid var(--border-dark);
  color: var(--text-dark);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 菜单头部 */
.menu-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-light);
  background: var(--header-gradient-light);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  font-weight: bold;
}

html[class*='dark'] .menu-header {
  background: var(--header-gradient-dark);
  border-bottom: 1px solid var(--divider-dark);
}

.menu-title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

.screen {
  margin-left: auto;
  transition: transform 0.3s;
}

.screen:hover {
  stroke: var(--vp-c-brand-1);
  transform: scale(1.15);
}


/* 菜单项 */
.menu-items {
  list-style: none;
  margin: 0;
  padding: 10px;
}

/* 分隔线 */
.menu-divider {
  height: 1px;
  margin: 10px 0;
  background: var(--divider-light);
}

html[class*='dark'] .menu-divider {
  background: var(--divider-dark);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 5px 14px;
  position: relative;
  font-size: 0.9rem;
  margin: 4px 0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: visible;
}

/* 子菜单箭头旋转 */
.has-submenu:hover .menu-item-arrow {
  transform: rotate(90deg);
}

/* 菜单hover背景等 */
.menu-item:hover {
  background-color: var(--hover-light);
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

html[class*='dark'] .menu-item:hover {
  background-color: var(--hover-dark);
}

.menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

/* 图标放大加旋转 */
.menu-item:hover .menu-item-icon {
  transform: scale(1.15) rotate(8deg);
}

/* 设置图标样式 */
.menu-item-icon svg {
  width: 18px;
  height: 18px;
  stroke: var(--theme-color);
  fill: none;
  transition: all 0.2s;
  stroke-width: 2;
}

/* 鼠标悬停变色逻辑，带有refresh-item类的除外 */
.menu-item:not(.refresh-item):hover .menu-item-icon svg {
  stroke: var(--vp-c-brand-1);
}

html[class*='dark'] .menu-item:not(.refresh-item):hover .menu-item-icon svg {
  stroke: var(--vp-c-brand-1);
}

.submenu-item:hover .submenu-item-icon svg {
  stroke: var(--vp-c-brand-1);
}

html[class*='dark'] .submenu-item:hover .submenu-item-icon svg {
  stroke: var(--vp-c-brand-1);
}

.menu-item-arrow {
  margin-left: auto;
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: transform 0.2s ease;
}

/* 子菜单 */
.submenu {
  position: absolute;
  top: 0;
  left: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.12);
  border: 1px solid #f3f0ff;
  min-width: 180px;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s ease;
  z-index: 1000;
  padding: 8px;
}

.has-submenu:hover>.submenu {
  visibility: visible;
  opacity: 1;
  transform: translateX(0);
}

html[class*='dark'] .submenu {
  background-color: var(--bg-dark);
  border: 1px solid var(--border-dark);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  border-radius: 8px;
  margin: 3px 0;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background-color: var(--hover-light);
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

html[class*='dark'] .submenu-item:hover {
  background-color: var(--hover-dark);
}

.submenu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.submenu-item-icon svg {
  width: 16px;
  height: 16px;
  stroke: var(--theme-color);
  fill: none;
  stroke-width: 2;
}


/* 刷新按钮特殊样式 */
.refresh-item {
  margin: 6px 8px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.2);
  color: white;
  transition: all 0.2s ease;
  border: none;
  border-radius: 8px;
}

.refresh-item:hover {
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4), 0 2px 5px rgba(236, 72, 153, 0.3);
  //transform: translateY(-2px) translateX(2px);
}

/*.refresh-item .menu-item-icon svg {
  stroke: white;
}*/

.refresh-item span {
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
