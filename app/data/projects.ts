export const projects = [
  {
    slug: "bachelorproject",
    theme: {
      gradient: "from-slate-400 to-white",
      badge: "bg-blue-100 text-blue-800"
    }
  },
  {
    slug: "webdesign",
    theme: {
      gradient: "from-purple-50 to-white",
      badge: "bg-purple-100 text-purple-800"
    }
  }
];

export type ProjectRegistry = typeof projects[0];
