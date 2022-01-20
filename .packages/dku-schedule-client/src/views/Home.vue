<script lang="ts" setup>
import { computed, ComputedRef, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { ScheduleTable, ScheduleController } from "../components";
import { days } from "../properties";

const route = useRoute();

const year: ComputedRef<number> = computed(() =>
  Number(route.query.year || 2022)
);

const semester: ComputedRef<number> = computed(() =>
  Number(route.query.semester || 1)
);

const searching = ref(true);
const searchOptions = reactive({
  days: [],
  times: [],
});
</script>

<template>
  <main>
    <schedule-table :year="year" :semester="semester" />
    <schedule-controller :year="year" :semester="semester" />

    <el-dialog v-model="searching" title="시간표 검색">
      <el-form>
        <el-form-item>
          <el-checkbox-group v-model="searchOptions.days">
            <el-checkbox-button v-for="day in days" :key="day" :label="day">
              {{ day }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<style>
main {
  height: calc(100% - 20px);
  margin: 10px;
  border: 1px solid #bbb;
}
</style>
