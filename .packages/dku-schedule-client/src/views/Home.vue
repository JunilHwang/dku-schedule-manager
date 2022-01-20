<script lang="ts" setup>
import { ScheduleTable, ScheduleController } from "../components";
</script>

<template>
  <main>
    <schedule-table />
    <schedule-controller />
  </main>
</template>

<style>
main {
  height: calc(100% - 20px);
  margin: 10px;
  border: 1px solid #bbb;
}
</style>