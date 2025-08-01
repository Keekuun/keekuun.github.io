<template>
    <div class="about-hero" :class="{ visible: isVisible }">
        <div class="about-info">
            <div class="about-title">
                <span>{{ profile.title }}</span>
                <span class="about-name">{{ profile.name }}</span>
            </div>
            <div class="about-desc">{{ profile.desc }}</div>
            <div class="about-btns">
                <a v-for="btn in profile.buttons" :key="btn.text" :href="btn.link" :class="['about-btn', btn.type]">
                    {{ btn.text }}
                </a>
            </div>
            <div class="SocialLinks">
                <a v-for="item in validSocialLinks" :key="item.name" :href="item.link" class="social-link"
                    target="_blank" rel="noopener noreferrer" :title="item.name">
                    <TkIcon :icon="item.icon.svg" icon-type="svg" size="22px" />
                </a>
            </div>
        </div>
        <div class="about-avatar-wrap">
            <img :src="profile.avatar" alt="avatar" class="about-avatar" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { TkIcon } from "vitepress-theme-teek";
import { SocialLinks } from '../../../ConfigHyde/SocialLinks';
import { profile } from './AboutData';

defineProps({
    isVisible: {
        type: Boolean,
        default: false
    }
});

// 只保留有 icon.svg 的项
const validSocialLinks = computed(() =>
    SocialLinks.filter(i => i.icon && i.icon.svg)
);
</script>

<style scoped>
.about-hero {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 380px;
    margin: 0 auto;
    max-width: 1000px;
    width: 100%;
    padding: 0 2rem;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.about-hero.visible {
    opacity: 1;
    transform: scale(1);
}

.about-info {
    flex: 1;
    min-width: 260px;
    margin: 0;
    /* 取消左侧margin */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.about-title {
    font-size: 2.8rem;
    font-weight: bold;
    margin-bottom: 1.2rem;
}

.about-name {
    background-color: var(--vp-c-brand-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-left: 0.5rem;
}

.about-desc {
    font-size: 1.1rem;
    margin-bottom: 2rem;
}

.about-btns {
    display: flex;
    gap: 1.2rem;
}

.about-btn {
    padding: 0.7rem 2.2rem;
    border-radius: 2rem;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    transition: box-shadow 0.2s, background 0.2s, transform 0.18s;
    box-shadow: 0 2px 8px rgba(59, 108, 255, 0.08);
    border: 2px solid var(--vp-c-brand-1);
    display: inline-block;
}

.about-btn.primary {
    background: var(--vp-c-brand-1);
    color: #fff;
}

.about-btn.default {
    color: var(--vp-c-brand-1);
}

.about-btn.default:hover {
    color: var(--vp-c-brand-1);
    box-shadow: 0 6px 24px rgba(59, 108, 255, 0.18);
    transform: translateY(-3px) scale(1.04);
    border-color: #539dfd;
}

.about-btn.primary:hover {
    background: var(--vp-c-brand-1);
    color: #fff;
    box-shadow: 0 8px 32px rgba(59, 108, 255, 0.22);
    transform: translateY(-3px) scale(1.04);
    border-color: var(--vp-c-brand-1);
}

.about-avatar-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 0;
    /* 取消margin */
}

.about-avatar {
    /* 头像 */
    width: 240px;
    height: 240px;
    border-radius: 50%;
    box-shadow: 0 0 60px 0 var(--vp-c-brand-1);
    border: 4px solid #fff;
    object-fit: cover;
    background: #fff;
    /* 添加过渡效果 */
    transition: transform 1.2s ease-out;
}

/* 当鼠标悬停时触发旋转 */
.about-avatar-wrap:hover .about-avatar {
    transform: rotate(360deg);
}

.about-socials {
    display: flex;
    gap: 1.1rem;
    margin-top: 1.2rem;
}

.SocialLinks {
    display: flex;
    align-items: center;
    margin-top: 1.2rem;
}

.social-link {
    display: inline-flex;
    align-items: center;
    margin: 0 0.5rem;
    transition: transform 0.18s;
}

.social-link:hover {
    transform: scale(1.18) translateY(-2px);
}

@media (max-width: 960px) {
    .about-hero {
        flex-direction: column;
        align-items: center;
        padding: 0 0.5rem;
        min-height: unset;
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .about-hero.visible {
        opacity: 1;
        transform: scale(1);
    }

    .about-avatar {
        margin-top: 40px;
        width: 256px;
        height: 256px;
        margin-bottom: 1.2rem;
    }

    .about-info {
        margin: 10px;
        padding: 0 0.5rem;
        align-items: center;
        text-align: center;
    }

    .about-title {
        font-size: 2rem;
    }

    .about-desc {
        font-size: 1rem;
        margin-bottom: 1.2rem;
    }

    .about-btns {
        flex-direction: row;
        gap: 0.8rem;
        width: auto;
        align-items: center;
        justify-content: center;
    }

    .about-btn {
        width: auto;
        text-align: center;
        padding: 0.7rem 1.5rem;
    }

    .about-avatar-wrap {
        margin-left: 0;
        justify-content: center;
        width: 100%;
    }

    .about-socials {
        justify-content: center;
        margin-top: 1rem;
        gap: 0.7rem;
    }
}
</style>
