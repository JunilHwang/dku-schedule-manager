<script lang="ts" setup>
import { computed, Ref, ref } from "vue";
import { useRoute } from "vue-router";

import { ScheduleTable } from "@/components";

import { Lecture } from "@/services";
import { days } from "@/properties";
import { lectureToSchedule } from "@/utils";

const route = useRoute();

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
  </main>
</template>

<style>
main {
  height: 100%;
}
</style>
