type Callback = (arg: any) => any;

class TaskPool {
  index = 100;
  silenceFlag = false;

  pool: {
    [id: string]: {
      func: Callback;
      once: boolean;
    };
  } = {};

  execute(id: string, ...args: any) {
    if (!id) {
      throw new Error(`id can not be null`);
    }
    const task = this.pool[id];
    if (task) {
      if (task.once) {
        this.remove(id);
      }
      return task.func.apply(null, args);
    }
    if (!this.silenceFlag) {
      throw new Error(`找不到任务：${id}`);
    }
  }

  executeSilence(id: string, ...args: any) {
    const preFlag = this.silenceFlag;
    try {
      this.silenceFlag = true;
      return this.execute(id, ...args);
    } catch (e: any) {
      // console.log(`silence error:${e?.message}`);
    } finally {
      this.silenceFlag = preFlag;
    }
  }

  store(callback: Callback, once = false) {
    const id = `${this.index++}`;
    return this.storeById(id, callback, once);
  }

  /**
   * 不可以为数字
   */
  storeById(id: string, callback: Callback, once = false) {
    this.pool[id] = { func: callback, once };
    return id;
  }

  remove(id: string) {
    const task = this.pool[id];
    delete this.pool[id];
    return task;
  }
}

const defaultPoll = new TaskPool();

export function createPool() {
  return new TaskPool();
}

export function getDefaultPool() {
  return defaultPoll;
}
