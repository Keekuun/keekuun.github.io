import { ref, onMounted, onUnmounted } from 'vue';

export function useFullscreen() {
    const isFullScreen = ref(false);

    const fullscreenApi = {
        request: document.documentElement.requestFullscreen ||
            document.documentElement.webkitRequestFullscreen ||
            document.documentElement.mozRequestFullScreen ||
            document.documentElement.msRequestFullscreen,

        exit: (document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen)?.bind(document), // 关键：绑定 document 上下文,

        element: () => document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement,

        changeEvent: () => {
            if (document.fullscreenElement !== undefined) return 'fullscreenchange';
            if (document.webkitFullscreenElement !== undefined) return 'webkitfullscreenchange';
            if (document.mozFullScreenElement !== undefined) return 'mozfullscreenchange';
            if (document.msFullscreenElement !== undefined) return 'MSFullscreenChange';
            return 'fullscreenchange';
        }
    };

    const checkFullscreen = () => !!fullscreenApi.element();
    const updateStatus = () => isFullScreen.value = checkFullscreen();

    const toggle = () => {
        if (checkFullscreen()) {
            fullscreenApi.exit?.();
        } else {
            const element = document.documentElement;
            fullscreenApi.request?.call(element);
        }
    };

    const handleFullscreenChange = () => {
        updateStatus();
    };

    const handleKeydown = (e) => {
        console.log("handleKeydown", e.key)
        if (e.key === 'F11' || e.keyCode === 122) {
            console.log("isFullScreen.value", isFullScreen.value)
            requestAnimationFrame(updateStatus);
            console.log("isFullScreen.value", isFullScreen.value)
        }
    };

    onMounted(() => {
        updateStatus();

        const changeEvent = fullscreenApi.changeEvent();
        document.addEventListener(changeEvent, handleFullscreenChange);
        window.addEventListener('keydown', handleKeydown);

        window._fullscreenEvent = { changeEvent, handleFullscreenChange, handleKeydown };
    });

    onUnmounted(() => {
        const { changeEvent, handleFullscreenChange, handleKeydown } = window._fullscreenEvent || {};
        if (changeEvent && handleFullscreenChange) {
            document.removeEventListener(changeEvent, handleFullscreenChange);
        }
        if (handleKeydown) {
            window.removeEventListener('keydown', handleKeydown);
        }
        delete window._fullscreenEvent;
    });

    return {
        isFullScreen,
        toggleFullscreen: toggle,
        updateFullscreenStatus: updateStatus
    };
}
