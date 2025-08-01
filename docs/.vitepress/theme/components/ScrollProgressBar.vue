<template>
    <div ref="progressBar" class="progress-bar" :style="{ width: progress + '%' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const progressBar = ref(null);
const progress = ref(0);

let ticking = false;

const handleScroll = () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const { documentElement, body } = document;
            // 批量读取
            const measurements = {
                scrollHeight: documentElement.scrollHeight,
                clientHeight: documentElement.clientHeight,
                scrollTop: documentElement.scrollTop || body.scrollTop,
            };
            const totalHeight = measurements.scrollHeight - measurements.clientHeight;
            // 批量更新
            progress.value = (measurements.scrollTop / totalHeight) * 100;
            ticking = false;
        });
        ticking = true;
    }
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(107deg,
            rgb(255, 182, 133) -30.6%,
            rgb(255, 111, 29) -1.11%,
            rgb(252, 181, 232) 39.14%,
            rgb(135, 148, 255) 73.35%,
            rgb(60, 112, 255) 97.07%,
            rgb(60, 112, 255) 118.97%);
    z-index: 9999;
}
</style>