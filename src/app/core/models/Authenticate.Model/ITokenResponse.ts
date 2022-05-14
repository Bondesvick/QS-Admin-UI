export interface ITokenResponse {
  head: any;
  body: Body;
}

export interface Body {
  detail: Detail;
  modules: Array<Modules>;
}
export interface Detail {
  branch: string;
  branchId: string;
  email: string;
  name: string;
  phone: string;
  roleId: string;
  username: string;
}

export interface Modules {
  name: string;
  description: string;
  operations: string;
  modulePages: Array<ModulePages>;
}
export interface ModulePages {
  name: string;
  role: string;
  url: string;
  link: string;
}
