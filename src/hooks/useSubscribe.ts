import { getCurrentInstance, onUnmounted, ref } from "vue";

export type Observer = (...args: any) => void;

export type Subscriber = {
  ubsubscribe: (event: string, observer: Observer) => void;
  subscribe: (event: string, observer: Observer) => () => void;
  notify: (event: string, ...args: any) => void;
};

const MAP = new Map<object, Subscriber>();

function getObsever() {
  let curIns = getCurrentInstance();
  if (!curIns) {
    return;
  }
  while (true) {
    const subscribe = MAP.get(curIns);
    if (subscribe) {
      return subscribe;
    }
    curIns = curIns?.parent;
    if (!curIns) {
      return;
    }
  }
}
export function useSubscribe(event: string, observer: Observer) {
  const obs = getObsever();
  if (!obs) {
    return;
  }

  const dissub = obs?.subscribe(event, observer);
  onUnmounted(function () {
    dissub();
  });
  return dissub;
}

export function useNotfier() {
  const subscribe = getObsever();
  return (event: string, ...args: any) => subscribe?.notify(event, ...args);
}

export function useObserver() {
  const observers: { [key: string]: Observer[] } = {};
  const ins = getCurrentInstance();
  onUnmounted(function () {
    MAP.delete(ins!);
    Object.keys(observers).forEach((key) => {
      delete observers[key];
    });
  });
  const subscribe = function (event: string, observer: Observer) {
    if (!observers[event]) {
      observers[event] = [];
    }
    observers[event].push(observer);
    return function () {
      const subscribes = observers[event];
      if (!subscribes) {
        return;
      }
      observers[event] = subscribes.filter((i: any) => i !== observer);
    };
  };
  const ubsubscribe = function (event: string, observer: Observer) {
    if (!observers[event]) {
      return;
    }
    const index = observers[event].indexOf(observer);
    if (index >= 0) {
      observers[event].splice(index, 1);
    }
  };
  const notify = function (event: string, ...args: any) {
    const subscribers = observers[event];
    if (!subscribers?.length) {
      return;
    }
    subscribers.forEach((sub) => {
      sub(...args);
    });
  };
  MAP.set(ins!, { subscribe, notify, ubsubscribe });
}
