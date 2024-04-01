import dayjs from "@/utils/dayjs";
import { onBeforeMount, onUnmounted, reactive } from "vue";

function fix(num: number, length: number) {
  return ("" + num).length < length ? (new Array(length + 1).join("0") + num).slice(-length) : "" + num;
}

export function useCountdown(__targetTime: Date | number | string | null) {
  console.log("执行了countdown");
  const time = reactive<{ day: number | string; hour: number | string; minute: number | string; second: number | string }>({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });

  let targetTime = dayjs(__targetTime); // 目标时间

  function setTargetTime(__targetTime: Date | number | string) {
    targetTime = dayjs(__targetTime);
  }

  function doInvoke() {
    if (!targetTime || !targetTime.isValid()) return;
    const currentTime = dayjs(); // 当前时间

    const diffDays = targetTime.diff(currentTime, "day");
    const diffHours = targetTime.diff(currentTime, "hour");
    const diffMinutes = targetTime.diff(currentTime, "minute");
    const diffSeconds = targetTime.diff(currentTime, "second");

    const days = Math.floor(diffDays);
    const hours = Math.floor(diffHours % 24);
    const minutes = Math.floor(diffMinutes % 60);
    const seconds = Math.floor(diffSeconds % 60);

    // console.log('倒计时days', days);
    // console.log('倒计时hours', hours);
    // console.log('倒计时minutes', minutes);
    // console.log('倒计时seconds', seconds);

    time.day = Number(days) > 0 ? fix(days, 2) : days;
    time.hour = Number(hours) > 0 ? fix(hours, 2) : hours;
    time.minute = Number(minutes) > 0 ? fix(minutes, 2) : minutes;
    time.second = Number(seconds) > 0 ? fix(seconds, 2) : seconds;
  }

  // @ts-ignore
  let interval: NodeJS.Timer;

  onBeforeMount(() => {
    interval = setInterval(() => {
      doInvoke();
    }, 1000);
  });

  // @ts-ignore
  onUnmounted(() => clearInterval(interval));

  return { time, setTargetTime };
}
