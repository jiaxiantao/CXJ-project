import { modifyProtocol } from "@/utils/utils";
import { createSoucheInstance } from "./client";

const ins = createSoucheInstance({ baseURL: modifyProtocol(import.meta.env.VITE_APP_HOST_BORDER) });

export function undoFlowInstance(data: any) {
  return ins.execute<SouchePageModel<any>>({
    path: "/flowInstance/undo.json",
    method: "POST",
    data,
  });
}
