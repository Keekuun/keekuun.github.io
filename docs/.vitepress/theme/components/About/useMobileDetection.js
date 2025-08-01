
import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * 移动端检测组合函数
 * @param {number} breakpoint - 断点宽度，默认600px
 * @param {number} debounceDelay - 防抖延迟，默认100ms
 * @returns {Object} { isMobile }
 */
export function useMobileDetection(breakpoint = 600, debounceDelay = 100) {
  const isMobile = ref(false);
  let timeoutId = null;

  const checkMobile = () => {
    if (typeof window !== 'undefined') {
      isMobile.value = window.innerWidth <= breakpoint;
    }
  };

  // 防抖处理 resize 事件
  const debouncedCheck = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(checkMobile, debounceDelay);
  };

  onMounted(() => {
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', debouncedCheck, { passive: true });
    }
  });

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', debouncedCheck);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  });

  return {
    isMobile
  };
}

/**
 * 媒体查询组合函数
 * @param {string} query - 媒体查询字符串
 * @returns {Object} { matches }
 */
export function useMediaQuery(query) {
  const matches = ref(false);
  let mediaQuery = null;

  const updateMatches = (e) => {
    matches.value = e.matches;
  };

  onMounted(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      mediaQuery = window.matchMedia(query);
      matches.value = mediaQuery.matches;
      
      // 使用现代的 addEventListener 方法
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updateMatches);
      } else {
        // 兼容旧版本浏览器
        mediaQuery.addListener(updateMatches);
      }
    }
  });

  onBeforeUnmount(() => {
    if (mediaQuery) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMatches);
      } else {
        mediaQuery.removeListener(updateMatches);
      }
    }
  });

  return {
    matches
  };
}

