/// <reference types="vite/client" />
module "@jarvis/tower-h5";

type Callback<P = void, R = void, P2 = void> = {
  (data: P, p2: P2): R;
};

type CB<P = void, R = void> = Callback<P, R>;

/**
 * (err,res)=>void
 */
type CBE<T = void> = Callback<Error | undefined, void, T>;

namespace JSX {
  interface IntrinsicAttributes {
    onClick?: CB;
    class?: string;
  }
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, any>, Record<string, any>, any>;
  export default component;
}

declare const __APP_BUILD_TIME__: string;
