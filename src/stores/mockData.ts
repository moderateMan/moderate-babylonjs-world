
const RouteCongfig = [
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
          icon: "user",
          noCache: false,
          link: null,
        },
      }
    ],
  },
];

export default [
  {
    id: 1,
    name: "index",
    actions: [
      {
        id: "1",
        name: "add",
      },
    ],
  },
  {
    id: 2,
    name: "user",
    actions: [
      {
        id: "1",
        name: "add",
      },
    ],
  },
  {
    id: 3,
    name: "role",
    actions: [
      {
        id: "1",
        name: "add",
      },
    ],
  },
];
