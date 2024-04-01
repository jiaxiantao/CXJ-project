# Vue3 TS[X] 模版

## IDE 推荐配置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### 为了能够使 ts 支持.vue 文件 ，请按照下面的 steps 配置 vscode

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## feature

- 集成[tailwindcss](https://tailwindcss.com/)
- 支持 rem 适配，设计稿尺寸 750px
- 支持 jsx、tsx；详情：[Vite JSX support](https://cn.vitejs.dev/guide/features.html#jsx)
- 跨端网络请求库 [nethub](https://github.com/Murphy-Tong/nethub)
- 代码格式化，代码提交检测

## 使用方式

fork
