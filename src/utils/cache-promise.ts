/**
 * CACHE : 缓存数据
 * ZIP : 不缓存数据，只节流
 */
export type MODE = "CACHE" | "ZIP";

export interface ITask<T> {
  (dataCallback: (err: Error | null | undefined, data?: T) => void): void | Promise<T>;
}

export default class BatchRequestZipper<T = any> {
  private promise?: Promise<T>;
  public cacheData?: T;
  private mode: MODE = "CACHE";
  private taskFactory?: ITask<T>;

  /**
   *
   * @param mode default CAHCE data
   */
  constructor(taskFactory?: ITask<T>);
  constructor(mode?: MODE);
  constructor(p?: ITask<T> | MODE) {
    if (typeof p === "string") {
      this.mode = p;
    } else if (typeof p === "function") {
      this.taskFactory = p;
    }
  }

  reset() {
    this.cacheData = undefined;
    this.promise = undefined;
  }

  private onTaskOver() {
    if (this.mode === "CACHE") {
      this.promise = undefined;
    } else if (this.mode === "ZIP") {
      this.reset();
    }
  }

  do<E extends T>(taskFactory?: ITask<E>) {
    if (this.cacheData) {
      return Promise.resolve(this.cacheData) as Promise<E>;
    }
    if (this.promise) {
      return this.promise as Promise<E>;
    }
    const task = taskFactory || this.taskFactory;
    this.promise = new Promise<T>((r, j) => {
      try {
        const ret = task!((err: Error | undefined | null, data?: T) => {
          if (err) {
            j(err);
            return;
          }
          r(data!);
        });
        if (ret instanceof Promise) {
          ret.then(r).catch(j);
        }
      } catch (e) {
        j(e);
      }
    })
      .then((data) => {
        this.cacheData = data;
        return data;
      })
      .finally(() => {
        this.onTaskOver();
      });
    return this.promise as Promise<E>;
  }
}
