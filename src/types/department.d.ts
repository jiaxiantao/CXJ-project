declare interface Department {
  id: string;
  name: string;
  number: number;
  userNumber: number;
  type: "shop" | "department";
  orgId: string;
  departments: Department[];
}

declare interface DepartmentExtend {
  id: string;
  name: string;
  number: number;
  userNumber: number;
  type: "shop" | "department";
  orgId: string;
  hasNext: boolean;
}

declare interface DepartmentUser {
  id: string;
  initial: string;
  name: string;
  roleCode: string;
  roleName: string;
  shopCode: string;
  type?: "user";
  depName?: string;
}

declare interface Structure {
  hasCheck: boolean;
  id: string;
  name: string;
  orgId: string;
  type: string;
}
