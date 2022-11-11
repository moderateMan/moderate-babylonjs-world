import type { RouteItemDataT } from "@/router/index";
import { reactive, ref, type Component } from "vue";
import { defineStore } from "pinia";
import mockData from "./mockPermissions";

export interface PermissionItemT {
  name: string;

  meta: {
    title?: string;
    icon?: string;
    noCache?: boolean;
    link?: null;
  };
  children?: PermissionItemT[];
}

export const useGlobalStore = defineStore("global", () => {
  const token = ref<string>("");
  const menuData = ref<RouteItemDataT[]>([]);
  const permissions = ref<string[] | null>();
  const pageCacheArr = ref<{
    [key: string]: {
      name: string;
      path: string | undefined;
      title: string | undefined;
    };
  } | null>({});

  function setToken(value: string) {
    token.value = value;
  }

  function setMenuData(data: RouteItemDataT[]) {
    menuData.value = data;
  }

  function setPermissions(data: string[] | null) {
    permissions.value = data;
  }

  function getPermissionsData() {
    return new Promise<typeof mockData.data>((resolve) => {
      setTimeout(() => {
        resolve(mockData.data);
      }, 1000);
    });
  }
  // 获得所有的权限
  function getAllPermissionsData() {
    return new Promise<typeof mockData.data>((resolve) => {
      setTimeout(() => {
        resolve(mockData.data);
      }, 1000);
    });
  }
  function setPageCachearr(
    data: {
      [key: string]: {
        name: string;
        path: string | undefined;
        title: string | undefined;
      };
    } | null
  ) {
    pageCacheArr.value = data;
  }

  return {
    menuData,
    pageCacheArr,
    setPageCachearr,
    getPermissionsData,
    setMenuData,
    getAllPermissionsData,
    setPermissions,
    permissions,
    token,
    setToken,
  };
});
