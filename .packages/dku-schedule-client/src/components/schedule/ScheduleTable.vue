<script setup lang="ts">
import {toRefs} from "vue";
import {ElMessage} from "element-plus";

import {fill2} from "@/utils";
import {days, times} from "@/properties";
import {Lecture, Schedule} from "@/services";

const props = defineProps<{
  schedules: Schedule[];
}>();

const {schedules} = toRefs(props);
const emit = defineEmits(["select", "remove"]);

function getSchedule(day: number, time: number): Schedule | undefined {
  return schedules.value.find(
    ({dayIndex, range}) => dayIndex === day && range[0] === time
  );
}

function getColor(lecture: Lecture): string {
  const lectures = [ ...new Set(schedules.value.map(({ lecture }) => lecture)) ]
  return colors[lectures.indexOf(lecture) % colors.length];
}

function handleRemove({ target }: { target: HTMLElement }) {
  const [ $confirm ] =  Array.from(target.children) as HTMLElement[];
  if (!$confirm) return;
  $confirm.click();
}

function removeSchedule(day: number, time: number) {
  const selected = getSchedule(day, time)!;
  emit("remove", selected);
  ElMessage.success("삭제되었습니다.");
}

const colors = [
  '#fdd',
  '#ffd',
  '#dff',
  '#ddf',
  '#fdf',
  '#dfd',
]
</script>

<template>
  <header>
    <ul>
      <li>
        <span>교시</span>
      </li>
      <li v-for="day in days" :key="day">
        <span v-html="day"/>
      </li>
    </ul>
  </header>
  <div class="wrap">
    <ul class="scheduleLabels">
      <li v-for="(time, timeKey) in times" :class="{ late: timeKey > 17 }">
        {{ fill2(timeKey + 1) }}교시<br/>
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
          class="inner"
          v-for="({ lecture, range, room }, lectureKey) in [ getSchedule(key, timeKey + 1) ].filter(Boolean)"
          :key="lectureKey"
          @click.stop="handleRemove"
          :style="{
            height: `${range.length * 100 + range.length}%`,
            backgroundColor: getColor(lecture),
          }"
        >
          <el-popconfirm title="강의를 삭제하시겠습니까?" @confirm="removeSchedule(key, timeKey + 1)">
            <template #reference>
              <p>
                <strong>{{ lecture.subjKnm }}{{ lecture.cybLtrTyNm || '' }}</strong><br/>
                <strong>{{ lecture.wkLecrEmpnm }}</strong> {{ room }}
              </p>
            </template>
          </el-popconfirm>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 40px;
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
  margin-top: 41px;

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
        display: block;
        cursor: pointer;
        font-size: 13px;

        .inner {
          position: relative;
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;
          padding: 10px;
          background: #fff;
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
