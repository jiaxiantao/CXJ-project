import BatchRequestZipper from "@/utils/cache-promise";
import * as Vue from "vue";
import { type Ref } from "vue";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_START = 1;
export interface PaginationResult<T, E = any> {
  res?: T[];
  hasMore: boolean;
  extra?: E;
}

export type LoadFn<T> = (page: number, pageSize: number, extra?: any) => Promise<PaginationResult<T>>;

export interface Pagination<T, E> {
  refreshing: Ref<boolean>;
  loading: Ref<boolean>;
  hasMore: Ref<boolean>;
  error: Ref<boolean>;
  data: Ref<T[]>;
  extra: Ref<E | undefined>;
  load: (extra?: any) => Promise<T[]>;
  refresh: (extra?: any) => Promise<T[]>;
  clear: () => void;
}

class PaginationImpl<T, E> implements Pagination<T, E> {
  private currentLoadedPage: Ref<number>;
  refreshing: Ref<boolean>;
  loading: Ref<boolean>;
  hasMore: Ref<boolean>;
  error: Ref<boolean>;
  data: Ref<T[]>;
  extra: Ref<E | undefined>;

  private userInitPage: number = DEFAULT_PAGE_START;
  private userPageSize: number = DEFAULT_PAGE_SIZE;
  private invokeZipper = new BatchRequestZipper<T[]>("ZIP");
  private userLoadFn: LoadFn<T>;

  constructor(loadFn: LoadFn<T>, initPage: number, pageSize: number) {
    this.currentLoadedPage = Vue.ref(initPage - 1);
    this.refreshing = Vue.ref(false);
    this.loading = Vue.ref(false);
    this.error = Vue.ref(false);
    this.hasMore = Vue.ref(true);
    this.extra = Vue.ref<E>();
    this.data = Vue.ref<T[]>([]) as Ref<T[]>;
    this.userInitPage = initPage;
    this.userPageSize = pageSize;
    this.userLoadFn = loadFn;
  }

  private async _load(extra?: any) {
    this.loading.value = true;
    const targetPage = this.refreshing.value ? this.userInitPage : this.currentLoadedPage.value + 1;
    try {
      const res = await this.userLoadFn!(targetPage, this.userPageSize, extra);
      if (targetPage === this.currentLoadedPage.value) {
        return this.data.value;
      }
      if (this.refreshing.value) {
        this.data.value = res.res || [];
      } else {
        this.data.value = this.data.value.concat(res.res || []);
      }
      this.extra.value = res.extra;
      this.hasMore.value = res.hasMore;
      this.currentLoadedPage.value = targetPage;
      this.error.value = false;
    } catch (e) {
      console.log(e);
      this.error.value = true;
    }
    return this.data.value;
  }

  async load(extra?: any) {
    // 避免重复请求
    return this.invokeZipper
      .do((cb) => {
        this._load(extra)
          .then((res) => cb(null, res))
          .catch((e) => cb(e));
      })
      .finally(() => {
        this.loading.value = false;
        this.refreshing.value = false;
      });
  }

  refresh(extra?: any) {
    this.refreshing.value = true;
    this.currentLoadedPage.value = this.userInitPage - 1;
    return this.load(extra);
  }

  clear() {
    this.data.value = [];
    this.hasMore.value = true;
    this.refreshing.value = false;
    this.loading.value = false;
    this.error.value = false;
    this.currentLoadedPage.value = this.userInitPage - 1;
    this.invokeZipper.reset();
  }
}

export default function <T = any, E = any>(
  loadFn: LoadFn<T>,
  initPage = DEFAULT_PAGE_START,
  pageSize = DEFAULT_PAGE_SIZE
): Pagination<T, E> {
  return new PaginationImpl(loadFn, initPage, pageSize);
}

export function pageResultConvert<T = any>(res: SouchePageModel<T>) {
  return {
    hasMore: res.currentIndex < res.totalPage,
    res: res.items,
  };
}
