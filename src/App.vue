<script setup lang="ts">
import { RouterView } from 'vue-router'</script>

<template>
  <div class="app-impl">
    <router-view class="root-router-view"/>
  </div>
</template>

<style scoped lang="scss">
.app-impl {
  .root-router-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
