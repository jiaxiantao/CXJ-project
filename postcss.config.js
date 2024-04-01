module.exports = {
  plugins: [
    require("tailwindcss")(),
    require("autoprefixer")(),
    require("postcss-pxtorem")({
      rootValue: 16, // 1rem = 16px , 750 设计稿 对应的 root 字体大小 为 32px
      propList: ["*"], //是一个存储哪些将被转换的属性列表，这里设置为['*']全部，假设需要仅对边框进行设置，可以写['*', '!border*']
      unitPrecision: 3, //保留rem小数点多少位
      selectorBlackList: [], //则是一个对css选择器进行过滤的数组，比如你设置为['el-']，那所有el-类名里面有关px的样式将不被转换，这里也支持正则写法。
      replace: true,
      mediaQuery: false, //媒体查询( @media screen 之类的)中不生效
      minPixelValue: 3, //px小于3的不会被转换
    }),
  ],
};
