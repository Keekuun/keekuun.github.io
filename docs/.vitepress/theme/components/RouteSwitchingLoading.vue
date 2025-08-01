<!-- 路由切换动画组件（融合版） -->
<template>
  <div class="vp-layout">
    <!-- 过渡遮罩层 -->
    <div v-show="isTransitioning" class="transition-mask">
      <div class="loader">
        <div class="spinner"></div>
        <p>拼命加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vitepress';

// 路由相关
const router = useRouter();
// 过渡状态管理
const isTransitioning = ref(false);
// 计算路由时间
let transitionStart = 0;

// 保存 VitePress 内部默认的路由钩子
const originalBeforeRouteChange = router.onBeforeRouteChange;
const originalAfterRouteChange = router.onAfterRouteChange;

// 路由开始切换时
function handleRouteStart() {
  transitionStart = Date.now();
  isTransitioning.value = true;
}

// 路由完成切换时
function handleRouteComplete() {
  const elapsed = Date.now() - transitionStart;
  // 确保动画至少显示 350ms
  const delay = Math.max(0, 350 - elapsed);
  console.log(`路由切换耗时：${elapsed}ms，延迟关闭：${delay}ms`);

  setTimeout(() => {
    isTransitioning.value = false;
  }, delay);
}

// 监听路由变化
router.onBeforeRouteChange = (to) => {
  // 调用 VitePress 内部默认逻辑
  if (originalBeforeRouteChange) {
    originalBeforeRouteChange(to);
  }
  handleRouteStart()
}

router.onAfterRouteChange = (to) => {
  // 调用 VitePress 内部默认逻辑
  if (originalAfterRouteChange) {
    originalAfterRouteChange(to);
  }
  handleRouteComplete()
}

/* 首次加载遮罩 */
onBeforeMount(() => {
  handleRouteStart();
});

onMounted(() => {
  handleRouteComplete();
})
</script>

<style>
/* 过渡遮罩层样式 */
.transition-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 水平居中内容 */
  justify-content: center;
  /* 垂直居中内容 */
  height: 100%;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 10px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
