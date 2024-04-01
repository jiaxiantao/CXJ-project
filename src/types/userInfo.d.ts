declare interface UserInfo {
  avatar: string;
  createShopAuth: number;
  departmentId: string;
  externalAbbreviation: string;
  internalAbbreviation: string;
  name: string;
  orgId: string;
  orgName: string;
  resources: UserInfoResources[];
  roleCode: string;
  roleName: string;
  shopCode: string;
  shopId: string;
  shopName: string;
  superManager: number;
  token: string;
  tools: UserInfoTools[];
  userId: string;
}
interface UserInfoResources {
  addType: string;
  deleteType: string;
  modifyType: string;
  objCode: string;
  readType: string;
  settingType: string;
}
interface UserInfoTools {
  checked: number;
  code: string;
  id: string;
  name: string;
}
