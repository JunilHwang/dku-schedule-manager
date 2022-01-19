<script setup lang="ts">
import { scheduleService } from "../../services";

const 초 = 1000;
const 분 = 60 * 초;

const fill2 = (n: number) => `0${n}`.substr(-2);

const parseHnM = (current: number) => {
  const date = new Date(current);
  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

const days = ["월", "화", "수", "목", "금", "토"];
const times = [

  ...Array(18)
    .fill(0)
    .map((v, k) => v + (k * 30 * 분))
    .map(v => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + (k * 55 * 분))
    .map(v => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),

];

async function findSchedule (
  day: string,
  timeKey: number,
) {
  const schedules = await scheduleService.getAllSchedules(2021, 2);
  // console.log([ ...new Set(schedules.map(({ buldAndRoomCont }) => buldAndRoomCont)) ]);

  const selected = schedules.filter(({ buldAndRoomCont }) => {
    if (!buldAndRoomCont) return false;
    return buldAndRoomCont
              .split("<p>")
              .filter(v => v.includes(day))
              .map(v => v.replace(/^([가-힣])(\d+(~\d+)?)(.*)/, "$2"))
              .map(v => {
                const [start, end] = v.split("~").map(Number);
                if (end === undefined) return [ start ];
                return Array(end - start + 1).fill(start).map((v, k) => v + k);
              })
              .flatMap(v => v)
              .includes(timeKey)
  })

  console.log({ day, timeKey, selected })
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
      <li
        v-for="(time, timeKey) in times"
        :class="{ late: timeKey > 17 }"
      >
        {{ fill2(timeKey + 1) }}교시<br />
        {{ time }}
      </li>
    </ul>
    <ul
      v-for="(day, key) in days"
      :key="day"
      class="instance"
    >
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
          background: #FFA;
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