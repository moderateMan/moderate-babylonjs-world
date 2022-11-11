import { Hello, User, Index, RoleMgr } from "@/pages";
import type {
  RouteKeyT,
  RouteRecordRawCustom,
} from "@/permissions/routerConfig";

const config: {
  [key: string]: Partial<RouteRecordRawCustom>;
} = {
  index: {
    meta: {
      title: "首页",
    },
    component: Index,
  },
  sys: {
    meta: {
      title: "首页",
    },
    title: "分类1",
  },
  user: {
    meta: {
      title: "用户管理",
    },
    component: User,
  },
  role: {
    meta: {
      title: "角色管理",
    },
    component: RoleMgr,
  },
};

export default config;
