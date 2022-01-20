<script setup lang="ts">
import { toRefs } from "vue";

import { fill2 } from "@/utils";
import { days, times } from "@/properties";
import { scheduleService } from "@/services";

const props = defineProps({
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
});

const { year, semester } = toRefs(props);

async function findSchedule(day: string, timeKey: number) {
  const schedules = await scheduleService.getAllSchedules(
    year.value,
    semester.value
  );
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
        @click="findSchedule(day, timeKey + 1)"
      />
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

        &:hover {
          background: #ffa;
        }
      }
    }
  }

  li {
    height: 40px;
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