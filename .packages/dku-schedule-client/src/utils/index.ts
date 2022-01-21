import { Lecture, Schedule } from "@/services";

export const fill2 = (n: number) => `0${n}`.substr(-2);

export const parseHnM = (current: number) => {
  const date = new Date(current);
  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

export const throttle = (fn: Function, time: number) => {
  let toggle = false;
  return (...args: any) => {
    if (toggle) return;
    toggle = true;
    fn(...args);
    setTimeout(() => {
      toggle = false;
    }, time);
  };
};

export const saveAtStorage = (key: string, data: Lecture[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getAtStorage = (key: string): Lecture[] => {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const lectureToSchedule = (lecture: Lecture): Schedule[] =>
  lecture.buldAndRoomCont.split("<p>").map((timeAndRoom) => {
    const dayIndex = ["월", "화", "수", "목", "금", "토"].findIndex((day) =>
      timeAndRoom.includes(day)
    );

    const reg = /^([가-힣])(\d+(~\d+)?)(.*)/;

    const range = [timeAndRoom.replace(reg, "$2")].map((v) => {
      const [start, end] = v.split("~").map(Number);
      if (end === undefined) return [start];
      return Array(end - start + 1)
        .fill(start)
        .map((v, k) => v + k);
    })[0] as number[];

    const room = timeAndRoom.replace(reg, "$4")?.replace(/\(|\)/g, "");

    return {
      lecture,
      dayIndex,
      range,
      room,
    };
  });
