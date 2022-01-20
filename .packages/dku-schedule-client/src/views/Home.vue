<script lang="ts" setup>
import { ScheduleTable, ScheduleController } from "../components";
import { computed, ComputedRef } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const year: ComputedRef<number> = computed(() =>
  Number(route.query.year || 2022)
);

const semester: ComputedRef<number> = computed(() =>
  Number(route.query.semester || 1)
);
</script>

<template>
  <main>
    <schedule-table :year="year" :semester="semester" />
    <schedule-controller :year="year" :semester="semester" />
  </main>
</template>

<style>
main {
  height: calc(100% - 20px);
  margin: 10px;
  border: 1px solid #bbb;
}
</style>
