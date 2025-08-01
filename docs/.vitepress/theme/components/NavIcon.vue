<!-- 导航栏图标 -->
<script setup lang="ts">
import type { DefaultTheme } from "vitepress/theme";
import type { TkIconProps } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { TkIcon, isClient } from "vitepress-theme-teek";
import { VPLink } from "vitepress/theme";

defineProps<DefaultTheme.NavItemWithLink & { iconProps?: TkIconProps; subMenu?: boolean }>();

const { page } = useData();

const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;

const isActive = (currentPath: string, matchPath?: string, asRegex: boolean = false) => {
  if (matchPath === undefined) return false;

  currentPath = normalize(`/${currentPath}`);

  if (asRegex) return new RegExp(matchPath).test(currentPath);
  if (normalize(matchPath) !== currentPath) return false;

  const hashMatch = matchPath.match(HASH_RE);

  if (hashMatch) return (isClient ? location.hash : "") === hashMatch[0];

  return true;
};

const normalize = (path: string) => {
  return decodeURI(path).replace(HASH_OR_QUERY_RE, "").replace(INDEX_OR_EXT_RE, "$1");
};
</script>

<template>
  <div :class="{ Icon: iconProps?.icon }">
    <VPLink
      :class="{
        VPNavBarMenuLink: !subMenu,
        SubMenu: subMenu,
        active: isActive(page.relativePath, activeMatch || link, !!activeMatch),
      }"
      :href="link"
      :target="target"
      :rel="rel"
      :no-icon="noIcon"
      tabindex="0"
    >
      <TkIcon v-if="iconProps?.icon" v-bind="iconProps" />
      <span v-html="text"></span>
    </VPLink>
  </div>
</template>

<style scoped>
.VPNavBarMenuLink {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.VPNavBarMenuLink.active {
  color: var(--vp-c-brand-1);
}

.VPNavBarMenuLink:hover {
  color: var(--vp-c-brand-1);
}

.tk-icon {
  margin-right: 7px;
}

.SubMenu {
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  transition:
    background-color 0.25s,
    color 0.25s;
}

.SubMenu:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}
</style>