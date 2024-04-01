import { onUnmounted } from "vue";

export default function (mills: number, cb: CB) {
  const tr = setTimeout(() => {
    cb();
  }, mills);
  onUnmounted(function () {
    clearTimeout(tr);
  });
}
