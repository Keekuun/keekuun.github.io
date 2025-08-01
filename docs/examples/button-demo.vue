<script setup lang="ts" name="Demo1"></script>

<template>
  <button class="tk-button">primary</button>
</template>

<style lang="scss" scoped>
.tk-button {
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 4px;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: #ffffff;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: 500;
  -webkit-user-select: none;
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: var(--tk-theme-color);
  border: 1px solid #dcdfe6;
  border-color: var(--tk-theme-color);

  &:hover {
    background-color: #5171d7;
  }
}
</style>
