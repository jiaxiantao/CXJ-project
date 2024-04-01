export const formatAmount = (amount: string | number) => {
  // 将金额转换为字符串，并去除可能存在的非数字字符
  const amountString = String(amount).replace(/[^0-9.-]/g, "");

  // 检查是否有小数部分
  const hasDecimal = amountString.includes(".");

  // 拆分整数部分和小数部分
  let [integerPart, decimalPart] = amountString.split(".");

  // 格式化整数部分，每隔3位插入逗号
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 如果存在小数部分，则重新组合整数部分和小数部分
  if (hasDecimal) {
    return `${integerPart}.${decimalPart}`;
  } else {
    return integerPart;
  }
};

export const formatFloat = (num: string, integers?: number, accuracy?: number) => {
  integers = integers || 3;
  accuracy = accuracy || 2;
  // 默认为3位整数，2位小数
  if (!num) {
    return "";
  }
  num = String(num);
  num = num.replace("。", ".");
  num = num.replace(/[^0-9\.]/g, "");
  num = num.replace(/\.{2,}/, ".");

  if (accuracy === 0) {
    num = num.replace(".", "");
  }

  // 整数部分 小数部分
  let [integer, decimal] = num.split(".");
  // 不成超过 999.9999
  if (integer.length > integers) {
    integer = integer.substr(0, integers);
  }
  if (typeof decimal === "string" && decimal.length > accuracy) {
    decimal = decimal.substr(0, accuracy);
  }
  if (num.charAt(0) === ".") {
    return 0 + ".";
  }
  if (num.charAt(0) === "0" && num.charAt(1) && num.charAt(1) !== ".") {
    return num.slice(1);
  }
  return [integer, decimal].filter((i) => i !== undefined).join(".");
};
