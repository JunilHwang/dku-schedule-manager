<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ScheduleTable, ScheduleController } from "./components";
</script>

<template>
  <main>
    <schedule-table />
    <schedule-controller />
  </main>
</template>

<style lang="scss" scoped>
main {
  height: calc(100% - 20px);
  margin: 10px;
  border: 1px solid #bbb;
}
</style>
