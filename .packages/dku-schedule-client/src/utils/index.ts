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