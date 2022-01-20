<script setup lang="ts">
import { toRefs } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

import { fill2 } from "@/utils";
import { days, times } from "@/properties";
import { Lecture, Schedule } from "@/services";

const props = defineProps<{
  schedules: Schedule[];
}>();

const { schedules } = toRefs(props);
const emit = defineEmits(["select", "remove"]);

function getSchedule(day: number, time: number): Schedule | undefined {
  return schedules.value.find(
    ({ dayIndex, range }) => dayIndex === day && range.includes(time)
  );
}

function getLecture(day: number, time: number): Lecture[] {
  const selected = getSchedule(day, time);
  return [selected?.lecture].filter(Boolean) as Lecture[];
}

function removeSchedule(day: number, time: number) {
  const selected = getSchedule(day, time)!;
  ElMessageBox.confirm(
    `시간표에서 ${selected.lecture.subjKnm}를 삭제하시겠습니까?`,
    "삭제",
    {
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      type: "warning",
    }
  )
    .then(() => {
      emit("remove", selected);
      ElMessage.success("삭제되었습니다.");
    })
    .catch(() => ElMessage.info("취소되었습니다."));
}
</script>

<template>
  <header>
    <ul>
      <li>
        <span>교시</span>
      </li>
      <li v-for="day in days" :key="day">
        <span v-html="day" />
      </li>
    </ul>
  </header>
  <div class="wrap">
    <ul class="scheduleLabels">
      <li v-for="(time, timeKey) in times" :class="{ late: timeKey > 17 }">
        {{ fill2(timeKey + 1) }}교시<br />
        {{ time }}
      </li>
    </ul>
    <ul v-for="(day, key) in days" :key="day" class="instance">
      <li
        v-for="(time, timeKey) in times"
        :class="{ late: timeKey > 17 }"
        @click="emit('select', day, timeKey + 1)"
      >
        <div
          v-for="(lecture, lectureKey) in getLecture(key, timeKey + 1)"
          :key="lectureKey"
          @click.stop="removeSchedule(key, timeKey + 1)"
        >
          <p>
            <template v-if="lecture.cybLtrTyNm">
              {{ lecture.cybLtrTyNm }}
            </template>
            {{ lecture.subjKnm }}<br />
            [{{ lecture.wkLecrEmpnm }}]
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
header {
  border-bottom: 1px solid #bbb;

  ul {
    display: flex;
  }

  li {
    width: 10%;

    span {
      text-align: center;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #666;
    }

    + li {
      width: calc(90% / 6);

      span {
        border-left: 1px solid #bbb;
      }
    }
  }
}

.wrap {
  display: flex;
  overflow: auto;
  height: calc(100% - 41px);

  ul {
    width: 10%;

    + ul {
      width: calc(90% / 6);

      li {
        border-left: 1px solid #bbb;
      }
    }

    &:first-child {
      li {
        background: #f5f5f5;

        &.late {
          background: #ddd;
        }
      }
    }

    &.instance {
      li {
        cursor: pointer;
        font-size: 11px;

        > div {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        &:hover {
          background: #ffa;
        }
      }
    }
  }

  li {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    + li {
      border-top: 1px solid #bbb;
    }

    &.late {
      background: #eee;
    }
  }
}

.scheduleLabels {
  font-size: 12px;
  text-align: center;
  letter-spacing: -0.5px;
}
</style>
