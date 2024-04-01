// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import qs from "qs";

/**
 * 获取URL参数
 * @param url
 */
export const getSearchParams = (url: string): Record<string, any> => {
  try {
    const searchString = getSearchParamString(url);
    return qs.parse(searchString);
  } catch (e) {
    return {};
  }
};

/**
 * 获取URL参数字符串
 * @param url
 */
export const getSearchParamString = (url: string) => {
  const hashIndex = url.indexOf("#");
  const searchIndex = url.indexOf("?");
  if (searchIndex === -1) return "";
  // 如果有hash，且hash在search之后，截取search到hash之间的字符串
  if (hashIndex > -1 && searchIndex < hashIndex) {
    return url.substring(searchIndex + 1, hashIndex);
  }
  return url.substring(searchIndex + 1);
};

/**
 * 获取URL hash参数
 * @param url
 */
export const getHashParamString = (url: string) => {
  const hashIndex = url.indexOf("#");
  const searchIndex = url.indexOf("?");
  if (hashIndex === -1) return "";
  // 如果有search，且search在hash之后，截取hash到search之间的字符串
  if (searchIndex > -1 && hashIndex < searchIndex) {
    return url.substring(hashIndex, searchIndex);
  }
  return url.substring(hashIndex);
};

/**
 * 获取URL基础路径
 * @param url
 */
export const getBaseUrl = (url: string) => {
  const searchIndex = url.indexOf("?");
  const hashIndex = url.indexOf("#");
  if (searchIndex === -1 && hashIndex === -1) return url;
  if (searchIndex === -1) return url.substring(0, hashIndex);
  if (hashIndex === -1) return url.substring(0, searchIndex);
  return url.substring(0, Math.min(searchIndex, hashIndex));
};

export const appendURLSearchParam = (url: string, query?: Record<string, any>) => {
  const searchParams = getSearchParams(url);
  const searchStr = qs.stringify({ ...searchParams, ...query });
  if (searchStr) {
    return `${getBaseUrl(url)}${getHashParamString(url)}?${searchStr}`;
  } else {
    return `${getBaseUrl(url)}${getHashParamString(url)}`;
  }
};
