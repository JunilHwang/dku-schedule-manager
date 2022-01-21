<script lang="ts" setup>
import { computed, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Edit } from "@element-plus/icons-vue";

import { ScheduleTable } from "@/components";

import { Lecture } from "@/services";
import { days } from "@/properties";
import { lectureToSchedule } from "@/utils";

const route = useRoute();
const router = useRouter();

const myLectures: Ref<Lecture[]> = ref(
  JSON.parse((route.query.init || "null") as string)
);

const schedules = computed(() => {
  return myLectures.value
    .filter(({ buldAndRoomCont }) => Boolean(buldAndRoomCont))
    .filter(({ buldAndRoomCont }) =>
      days.filter((day) => buldAndRoomCont.includes(day))
    )
    .flatMap(lectureToSchedule);
});
</script>

<template>
  <main ref="$main">
    <schedule-table :schedules="schedules" shared />
    <div class="controller">
      <el-button
        type="success"
        @click="router.push('/')"
        :icon="Edit"
        round
        plain
      >
        시간표 만들기
      </el-button>
    </div>
  </main>
</template>

<style>
main {
  height: 100%;
}

.controller {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 30px;
  display: flex;
  justify-content: center;
}
</style>
