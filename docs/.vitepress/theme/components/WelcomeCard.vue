<!-- 欢迎卡片组件 -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { TkMessage } from "vitepress-theme-teek";

// ------------------ 天气 Hook ------------------
function useWeather() {
  const weatherData = ref({
    city: '',
    temperature: '',
    type: '',
    date: '',
    week: ''
  });
  const error = ref(false);
  const loading = ref(false);

  const getWeatherInfo = async () => {
    loading.value = true;
    error.value = false;
    try {
      const response = await fetch('https://api.vvhan.com/api/weather');
      const data = await response.json();
      console.log(data,"天气数据");
      
      if (data.success) {
        weatherData.value = {
          city: data.city,
          temperature: `${data.data.low}-${data.data.high}`,
          type: data.data.type,
          date: data.data.date,
          week: data.data.week
        };
      } else {
        error.value = true;
        TkMessage.error('获取天气信息失败，请检查网络或者关闭代理');
      }
    } catch (err) {
      error.value = true;
      TkMessage.error('获取天气信息失败，请检查网络或者关闭代理');
    } finally {
      loading.value = false;
    }
  };

  return { weatherData, error, loading, getWeatherInfo };
}

// ------------------ FPS Hook ------------------
function useFPS(enabled = true) {
  const fps = ref(0);
  let frameCount = 0;
  let lastTime = 0;
  let animationFrameId: number | null = null;

  const updateFPS = (time: number) => {
    if (!enabled) return;

    if (lastTime === 0) {
      lastTime = time;
      animationFrameId = requestAnimationFrame(updateFPS);
      return;
    }

    const delta = time - lastTime;
    frameCount += 1;

    if (delta > 1000) {
      fps.value = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastTime = time;
    }

    animationFrameId = requestAnimationFrame(updateFPS);
  };

  const startFPS = () => {
    if (enabled && typeof requestAnimationFrame !== 'undefined') {
      lastTime = 0;
      frameCount = 0;
      animationFrameId = requestAnimationFrame(updateFPS);
    }
  };

  const stopFPS = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  onBeforeUnmount(() => {
    // 组件销毁前停止 FPS 监控
    stopFPS();
  });

  return { fps, startFPS, stopFPS };
}

// ------------------ 使用 Hook ------------------
const { weatherData, error, getWeatherInfo } = useWeather();

const showFPS = ref(true);
const { fps, startFPS, stopFPS } = useFPS(showFPS.value);

// ------------------ 初始化 ------------------
const init = async () => {
  await getWeatherInfo();
};

onMounted(async () => {
  // 在组件挂载后启动 FPS 监控
  startFPS();
  await init();
});
</script>

<template>
  <div class="info-card animate__animated animate__fadeIn welcome-card mobile-card" shadow="hover">
    <div class="welcome-content">
      <div v-if="showFPS" class="fps-display">FPS: {{ fps }}</div>

      <template v-if="!error">
        <h2 v-if="weatherData.city" class="greeting">
          欢迎来自
          <span class="highlight">{{ weatherData.city }}</span>
          的小伙伴！🎉🎉🎉
        </h2>

        <div class="info-container">
          <div class="info-item">
            <i class="el-icon-sunny"></i>
            <span v-if="weatherData.city">
              今日温度：
              <span class="highlight">{{ weatherData.temperature }}</span>
            </span>
          </div>
          <div class="info-item">
            <i class="el-icon-cloudy"></i>
            <span v-if="weatherData.city">
              天气：
              <span class="highlight">{{ weatherData.type }}</span>
            </span>
          </div>
          <div class="info-item">
            <i class="el-icon-date"></i>
            <span v-if="weatherData.city">
              日期：
              <span class="highlight">{{ weatherData.date }}</span>
            </span>
          </div>
          <div class="info-item">
            <i class="el-icon-calendar"></i>
            <span v-if="weatherData.city">
              星期：
              <span class="highlight">{{ weatherData.week }}</span>
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-card {
  text-align: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  transform: translateY(0);

  &.night-mode {
    background: var(--night-bg);
    color: var(--night-text);
    box-shadow: 0 4px 6px var(--night-shadow);

    &:hover {
      box-shadow: 0 10px 20px var(--night-shadow);
    }

    .highlight {
      color: var(--vp-c-brand-1);
    }
  }

  .welcome-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .greeting {
    font-size: 1.5rem;
    margin: 0;
    font-weight: bold;
  }

  .highlight {
    color: var(--vp-c-brand-1);
  }

  .info-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      font-size: 1.2rem;
    }
  }

  .fps-display {
    font-size: 0.9rem;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .config-panel .el-checkbox {
      width: 40%;
    }
  }
}

.diary-container {
  max-width: 70vw;
  margin: 0 auto;
}
</style>
