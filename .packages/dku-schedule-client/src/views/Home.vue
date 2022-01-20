<script lang="ts" setup>
import { computed, ComputedRef, reactive, Ref, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import { Lecture, scheduleService } from "@/services";
import { ScheduleController, ScheduleTable } from "@/components";
import { days, times } from "@/properties";

const route = useRoute();

const year: ComputedRef<number> = computed(() =>
  Number(route.query.year || 2022)
);

const semester: ComputedRef<number> = computed(() =>
  Number(route.query.semester || 1)
);

const searching = ref(true);

interface SearchOptions {
  days: string[];
  times: number[];
  query: string;
  grades: number[];
  majors: string[];
  page: 1;
  lectures: Lecture[];
}

const searchOptions = reactive<SearchOptions>({
  days: [],
  times: [],
  query: "",
  grades: [],
  majors: [],
  page: 1,
  lectures: [],
});

const $table = ref(null);
const $main = ref(null);

const pageSize = 50;
const currentLectures: ComputedRef<Lecture[]> = computed(() => {
  const { page, grades, lectures, days, times, query } = searchOptions;
  const goal = page * pageSize;
  const arr = [];

  for (const lecture of lectures) {
    if (arr.length >= goal) break;
    const { grade, buldAndRoomCont, subjKnm } = lecture;

    if (query.length !== 0 && !subjKnm.includes(query)) {
      continue;
    }

    if (grades.length !== 0 && !grades.includes(grade)) {
      continue;
    }

    if (
      days.length !== 0 &&
      buldAndRoomCont &&
      days.filter((day) => buldAndRoomCont.includes(day)).length === 0
    ) {
      continue;
    }

    if (
      times.length !== 0 &&
      times.filter((timeKey) =>
        buldAndRoomCont
          .split("<p>")
          .map((v) => v.replace(/^([가-힣])(\d+(~\d+)?)(.*)/, "$2"))
          .map((v) => {
            const [start, end] = v.split("~").map(Number);
            if (end === undefined) return [start];
            return Array(end - start + 1)
              .fill(start)
              .map((v, k) => v + k);
          })
          .flatMap((v) => v)
          .includes(timeKey)
      ).length === 0
    ) {
      continue;
    }

    arr.push(lecture);
  }
  return arr;
});
const majors: ComputedRef<string[]> = computed(() => [
  ...new Set(searchOptions.lectures.map(({ tkcrsEcaOrgnm }) => tkcrsEcaOrgnm)),
]);

scheduleService.getAllSchedules(year.value, semester.value).then((value) => {
  searchOptions.lectures = value;
});

watchEffect(() => {
  if (!$table.value) return;
  const { $el } = $table.value as any;
  $el
    .querySelector(".el-table__body-wrapper")
    .addEventListener("scroll", ({ target }: { target: HTMLElement }) => {
      const { scrollHeight, clientHeight, scrollTop } = target;
      if (scrollHeight - scrollTop - clientHeight > 500) return;
      searchOptions.page += 1;
    });
});
</script>

<template>
  <main ref="$main">
    <schedule-table :year="year" :semester="semester" />
    <schedule-controller :year="year" :semester="semester" />

    <el-dialog v-model="searching" title="시간표 검색" width="900px">
      <el-form label-width="70px">
        <el-form-item label="학년선택" size="small">
          <el-checkbox-group v-model="searchOptions.grades">
            <el-checkbox-button
              v-for="grade in [1, 2, 3, 4, 5, 6]"
              :key="grade"
              :label="grade"
            >
              {{ grade }} 학년
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="요일선택" size="small">
          <el-checkbox-group v-model="searchOptions.days">
            <el-checkbox-button v-for="day in days" :key="day" :label="day">
              {{ day }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="시간선택" size="small">
          <el-select-v2
            v-model="searchOptions.times"
            :options="times.map((v, k) => ({ value: k + 1, label: v }))"
            placeholder="시간을 선택해주세요"
            style="width: 400px"
            multiple
          />
        </el-form-item>

        <el-form-item label="전공선택" size="small">
          <el-select-v2
            v-model="searchOptions.majors"
            :options="
              majors.map((v, k) => ({
                value: v,
                label: v.split('<p>').join(' '),
              }))
            "
            placeholder="전공을 선택해주세요"
            style="width: 400px"
            multiple
          />
        </el-form-item>

        <el-form-item label="수업명" size="small">
          <el-input v-model="searchOptions.query" />
        </el-form-item>
      </el-form>

      <el-table
        ref="$table"
        :data="currentLectures"
        :header-cell-style="{
          background: '#f5f5f5',
          fontSize: '11px',
        }"
        :cell-style="{ fontSize: '11px' }"
        height="300px"
        border
      >
        <el-table-column
          label="학년"
          property="grade"
          align="center"
          width="50px"
        />

        <el-table-column label="구분" width="110px">
          <template #default="{ row }">
            {{ row.cybLtrTyNm }} {{ row.curiCparNm }}
          </template>
        </el-table-column>

        <el-table-column label="교과목" property="subjId" width="80px" />

        <el-table-column label="교과목명" property="subjKnm" width="150px" />

        <el-table-column property="crd" width="60px" align="center">
          <template #header>
            <div style="line-height: 1">학점<br />(설계)</div>
          </template>
        </el-table-column>

        <el-table-column
          label="교강사"
          property="wkLecrEmpnm"
          width="80px"
          align="center"
        />

        <el-table-column label="요일/시간/강의실" width="130px">
          <template #default="{ row }">
            <div style="line-height: 1" v-html="row.buldAndRoomCont" />
          </template>
        </el-table-column>

        <el-table-column label="비고">
          <template #default="{ row }">
            <div style="line-height: 1.2">
              <p
                v-html="
                  [
                    row.cybCoronaTyNm,
                    row.cybCoronaTyNm2,
                    row.cybCoronaTyNm3,
                    row.cybCoronaTyNm4,
                  ]
                    .filter(Boolean)
                    .map((v, k) => `[${k + 1}]${v.substr(0, 2)}`)
                    .join(',')
                "
              />
              <p v-html="row.tkcrsEcaOrgnm.split('<p>').join(' ')" />
            </div>
          </template>
        </el-table-column>
      </el-table>
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
