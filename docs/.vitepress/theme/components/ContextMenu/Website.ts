export const Website = {
  webInfo: {
    websiteName: "Jeek's Blog",
  },
  menuInfo: [
    {
      text: "首页",
      svg: `
            <svg viewBox="0 0 24 24" width="24" height="24" :stroke="themeColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>`,
      path: "/",
    },
    {
      text: "首页",
      svg: "",
      path: "/",
      subMenuInfo: [
        {
          text: "树洞",
          svg: "",
        },
        {
          text: "留言板",
          svg: "",
        },
      ],
    },
  ],
};
