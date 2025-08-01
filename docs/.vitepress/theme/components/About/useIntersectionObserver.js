
import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * 通用的 IntersectionObserver 组合函数
 * @param {number} threshold - 交叉阈值
 * @param {boolean} once - 是否只触发一次
 * @returns {Object} { isVisible, targetRef }
 */
export function useIntersectionObserver(threshold = 0.2, once = false) {
  const isVisible = ref(false);
  const targetRef = ref(null);
  let observer = null;

  const observe = () => {
    if (!('IntersectionObserver' in window)) {
      // 不支持 IntersectionObserver 的浏览器，直接显示元素
      isVisible.value = true;
      return;
    }

    if (!targetRef.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible.value = entry.isIntersecting;

        // 如果设置为只触发一次且已经可见，则停止观察
        if (once && entry.isIntersecting) {
          cleanup();
        }
      },
      { threshold }
    );

    observer.observe(targetRef.value);
  };

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    // 使用 nextTick 确保 DOM 已渲染
    if (targetRef.value) {
      observe();
    }
  });

  onBeforeUnmount(cleanup);

  return {
    isVisible,
    targetRef,
    cleanup
  };
}

/**
 * 多元素 IntersectionObserver 组合函数
 * @param {number} threshold - 交叉阈值
 * @param {boolean} once - 是否只触发一次
 * @returns {Object} 观察器管理对象
 */
export function useMultipleIntersectionObserver(threshold = 0.2, once = false) {
  const elementsRefs = ref([]);
  const elementsVisible = ref([]);
  let observer = null;

  const setElementRef = (index) => {
    return (el) => {
      elementsRefs.value[index] = el;
    };
  };

  const setupObserver = () => {
    cleanup();

    console.log("setupObserver elementsRefs", elementsRefs)
    const count = elementsRefs.value.length
    console.log("count", count)

    if (!('IntersectionObserver' in window)) {
      elementsVisible.value = new Array(count).fill(true);
      return;
    }

    elementsVisible.value = new Array(count).fill(false);

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const idx = elementsRefs.value.findIndex(el => el === entry.target);
        if (idx !== -1) {
          // 无论进入还是离开视口都更新状态
          elementsVisible.value[idx] = entry.isIntersecting;

          if (once && entry.isIntersecting) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold });

    elementsRefs.value.forEach((el) => {
      if (el) observer.observe(el);
    });
  };

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onBeforeUnmount(cleanup);

  return {
    elementsVisible,
    setElementRef,
    setupObserver,
    cleanup
  };
}

