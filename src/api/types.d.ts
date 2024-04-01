type SoucheResponse<T> = {
  success?: boolean;
  msg?: string;
  code?: number;
  traceId?: string;
  data?: T;
};

type SouchePageModel<T> = {
  currentIndex: number;
  pageSize: number;
  totalNumber: number;
  totalPage: number;
  nextIndex: number;
  preIndex: number;
  items?: T[];
};

type SouchePageResponse<T> = SoucheResponse<SouchePageModel<T>>;

type SouchePageRequest = {
  pageNo: number;
  pageSize: number;
};
