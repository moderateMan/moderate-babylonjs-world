import { BTN_PERMISSIONS } from "@/permissions/actionConfig";

const { ADD, EDIT, DELETE, IMPORT, EXPORT } = BTN_PERMISSIONS;
export const ActionsPermissionConfig = {
  index: [ADD.id, EDIT.id, DELETE.id, IMPORT.id, EXPORT.id],
  user: [ADD.id, EDIT.id, DELETE.id, IMPORT.id, EXPORT.id],
  role: [ADD.id, EDIT.id, DELETE.id, IMPORT.id, EXPORT.id],
};

export default {
  data: [
    {
      name: "index",
      meta: {
        title: "首页",
        icon: "system",
        noCache: false,
        link: null,
      },
    },
    {
      name: "sys",
      meta: {
        title: "系统管理",
        icon: "system",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "user",
          meta: {
            title: "管理",
            icon: "user",
            noCache: false,
            link: null,
          },
        },
        {
          name: "role",
          meta: {
            title: "角色管理",
            icon: "role",
            noCache: false,
            link: null,
          },
        },
      ],
    },
  ],
};
