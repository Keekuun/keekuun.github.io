// 返回顶部挂件
<template>
    <div class="back_to_top" ref="toTop" :style="{
        top: top + 'px',
    }" @click="topTop"></div>
</template>
<script setup lang="ts" name="BackToTop">
import { useRoute } from "vitepress";
import { nextTick, onUnmounted, ref, watch } from "vue";
import { TkMessage } from "vitepress-theme-teek";
import { onMounted } from "vue";

const route = useRoute();
const toTop = ref();
const top = ref<number>(-900);
const offsetHeight = ref<number>(0);

const topTop = () => {
    top.value = -900;
    window.scrollTo({
        top: 0,
        behavior: "smooth",
        // @ts-ignore Safari兼容
        ...(typeof CSS !== "undefined" && CSS.supports("scroll-behavior", "smooth")
            ? {}
            : { left: 0 }),
    });
    TkMessage.success({
        message: "已达到顶部🎉",
        duration: 3000,
    });
};

let animationFrame: number | null = null;

const backToTop = () => {
    if (!animationFrame) {
        animationFrame = requestAnimationFrame(() => {
            const { documentElement } = document;
            // 批量读取
            const measurements = {
                offsetHeight: documentElement.offsetHeight,
                scrollTop: documentElement.scrollTop,
            };
            // 批量更新
            if (measurements.scrollTop < 100) {
                top.value = -900;
            } else {
                top.value =
                    (900 - (measurements.scrollTop / measurements.offsetHeight) * 900) *
                    -1;
            }
            animationFrame = null;
        });
    }
};

onUnmounted(() => {
    window.removeEventListener("scroll", backToTop);
});

onMounted(() => {
    // 初始化DOM相关操作
    offsetHeight.value = document.documentElement.offsetHeight;

    // 路由变化时更新高度
    watch(
        () => route.path,
        () => {
            nextTick(() => {
                offsetHeight.value = document.querySelector("html")!.offsetHeight;
            });
        },
        { immediate: true }
    );

    // 添加滚动事件监听
    window.addEventListener("scroll", backToTop);
});
</script>
<style lang="scss" scoped>
@keyframes float {
    0% {
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);
    }

    50% {
        -webkit-transform: translateY(-10px);
        -ms-transform: translateY(-10px);
        transform: translateY(-10px);
    }

    100% {
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);
    }
}

.back_to_top {
    cursor: pointer;
    position: fixed;
    right: 40px;
    top: -900px;
    z-index: 1000;
    width: 70px;
    height: 900px;
    background: url("/backToTop/scroll.gif");
    transition: all 0.5s ease-in-out;
    opacity: 1;

    // 新增移动端隐藏
    @media (max-width: 768px) {
        background: none;
        pointer-events: none;
        width: 0;
        height: 0;
    }

    &:hover {
        animation: float 2s linear infinite;
    }
}
</style>