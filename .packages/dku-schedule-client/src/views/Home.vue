<script lang="ts" setup>
import { computed, ComputedRef, reactive, Ref, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import { ScheduleController, ScheduleTable } from "@/components";

import { Lecture, Schedule, scheduleService } from "@/services";
import { days, times } from "@/properties";
import { getAtStorage, saveAtStorage, lectureToSchedule } from "@/utils";
import html2canvas from "html2canvas";

const route = useRoute();
const router = useRouter();

const year: ComputedRef<number> = computed(() =>
  Number(route.query.year || 2023)
);

const semester: ComputedRef<number> = computed(() =>
  Number(route.query.semester || 1)
);

const searching = ref(false);

const myLectures: Ref<Lecture[]> = ref(
  getAtStorage(`${year.value}-${semester.value}`)
);

const schedules = computed(() => {
  return myLectures.value
    .filter(({ buldAndRoomCont }) => Boolean(buldAndRoomCont))
    .filter(({ buldAndRoomCont }) =>
      days.filter((day) => buldAndRoomCont.includes(day))
    )
    .flatMap(lectureToSchedule);
});

interface SearchOptions {
  days: string[];
  times: number[];
  query: string;
  grades: number[];
  majors: string[];
  page: number;
  cursor: number;
  lectures: Lecture[];
  currentLectures: Lecture[];
}

const searchOptions = reactive<SearchOptions>({
  days: [],
  times: [],
  query: "",
  grades: [],
  majors: [],
  page: 0,
  cursor: 0,
  lectures: [],
  currentLectures: [],
});

const $main = ref(null);
const $schedule = ref(null);
const $table = ref(null);

const pageSize = 50;

const majors: ComputedRef<string[]> = computed(() => [
  ...new Set(searchOptions.lectures.map(({ tkcrsEcaOrgnm }) => tkcrsEcaOrgnm)),
]);

async function fetchLectures() {
  searchOptions.lectures = await scheduleService.getAllSchedules(
    year.value,
    semester.value
  );
  searchOptions.days = [];
  searchOptions.times = [];
  searchOptions.query = "";
  searchOptions.grades = [];
  searchOptions.majors = [];
  searchOptions.page = 0;
  searchOptions.cursor = 0;
  searchOptions.currentLectures = [];
  fetchNextData();
}

function save() {
  saveAtStorage(`${year.value}-${semester.value}`, myLectures.value);
}

function openSearch() {
  searching.value = true;
}

function handleSelectDayAndTime(day: string, timeKey: number) {
  searchOptions.days = [day];
  searchOptions.times = [timeKey];
  openSearch();
  requestAnimationFrame(handleSearchOptionChange);
}

function handleSelectSemester(value: string) {
  const [year, semester] = value.split("-");
  router.push({
    query: { year, semester },
  });
  myLectures.value = getAtStorage(`${year}-${semester}`);
  requestAnimationFrame(fetchLectures);
}

function handleSearchOptionChange() {
  searchOptions.currentLectures = [];
  searchOptions.page = 0;
  searchOptions.cursor = 0;
  requestAnimationFrame(fetchNextData);
}

function handleSelectLecture(lecture: Lecture) {
  const schedule = lectureToSchedule(lecture);
  const duplicated = schedules.value.find(({ range, dayIndex }) => {
    return schedule.find((v) => {
      return (
        v.dayIndex === dayIndex && v.range.find((time) => range.includes(time))
      );
    });
  });

  if (duplicated) {
    return ElMessage.error(
      `${duplicated.lecture.subjKnm} 수업과 강의 시간이 겹칩니다.`
    );
  }

  myLectures.value.push(lecture);
  searching.value = false;
  save();
}

function handleRemoveSchedule(schedule: Schedule) {
  const index = myLectures.value.indexOf(schedule.lecture);
  myLectures.value.splice(index, 1);
  save();
}

function fetchNextData() {
  const { grades, lectures, days, times, query, currentLectures, majors } =
    searchOptions;

  searchOptions.page += 1;
  const arr = [];
  let cursor = searchOptions.cursor;

  for (; cursor < lectures.length; cursor += 1) {
    if (arr.length >= pageSize) break;
    const lecture = lectures[cursor];
    const { grade, buldAndRoomCont, subjKnm, tkcrsEcaOrgnm } = lecture;

    if (query.length !== 0 && !subjKnm.includes(query)) {
      continue;
    }

    if (grades.length !== 0 && !grades.includes(grade)) {
      continue;
    }

    if (majors.length !== 0 && !majors.includes(tkcrsEcaOrgnm)) {
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
        (buldAndRoomCont || "")
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
  searchOptions.cursor = cursor;
  currentLectures.push(...arr);
}

function handleShare() {
  const init = JSON.stringify(myLectures.value);
  const $textarea = document.createElement("textarea");
  document.body.append($textarea);
  $textarea.value = `${location.origin}/dku-schedule-manager/shared/?init=${init}`;
  $textarea.select();
  document.execCommand("copy");
  $textarea.remove();
  ElMessage.success("시간표 주소를 복사했습니다.");
}

function handleDownload() {
  if ($main.value === null) return;
  const $clone = $main.value.cloneNode(true);
  const $cloneHeader = $clone.querySelector("header");
  $clone.querySelector(".controller").remove();

  $cloneHeader.style.cssText = "position: static; margin-bottom: -41px;";
  $clone.style.cssText =
    "width: 800px; position: absolute: left: -800px; top: 0;";
  $main.value.parentNode.appendChild($clone);

  html2canvas($clone, { height: $clone.scrollHeight }).then((canvas) => {
    $clone.remove();
    const $anchor = document.createElement("a");
    $anchor.href = canvas.toDataURL();
    $anchor.download = "시간표.png";
    $anchor.click();
    $main.value.style = "";
  });
}

fetchLectures();

watchEffect(() => {
  if (!$table.value) return;
  const { $el } = $table.value as any;
  $el
    .querySelector(".el-table__body-wrapper")
    .addEventListener("scroll", ({ target }: { target: HTMLElement }) => {
      const { scrollHeight, clientHeight, scrollTop } = target;
      if (scrollHeight - scrollTop - clientHeight > 500) return;
      fetchNextData();
    });
});
</script>

<template>
  <main ref="$main">
    <schedule-table
      ref="$schedule"
      :schedules="schedules"
      @select="handleSelectDayAndTime"
      @remove="handleRemoveSchedule"
    />

    <schedule-controller
      :year="year"
      :semester="semester"
      @select-semester="handleSelectSemester"
      @search="openSearch"
      @share="handleShare"
      @download="handleDownload"
    />

    <el-dialog v-model="searching" title="시간표 검색" width="900px">
      <el-form label-width="70px" @change="handleSearchOptionChange">
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
            @change="handleSearchOptionChange"
            multiple
          />
        </el-form-item>

        <el-form-item label="전공선택" size="small">
          <el-select-v2
            v-model="searchOptions.majors"
            :options="
              majors.map((v) => ({
                value: v,
                label: v.split('<p>').join(' '),
              }))
            "
            placeholder="전공을 선택해주세요"
            style="width: 400px"
            @change="handleSearchOptionChange"
            multiple
          />
        </el-form-item>

        <el-form-item label="수업명" size="small">
          <el-input v-model="searchOptions.query" />
        </el-form-item>
      </el-form>

      <el-table
        ref="$table"
        :data="searchOptions.currentLectures"
        :header-cell-style="{
          background: '#f5f5f5',
          fontSize: '11px',
        }"
        :cell-style="{ fontSize: '11px' }"
        height="300px"
        @row-click="handleSelectLecture"
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
  height: 100%;
}
</style>
