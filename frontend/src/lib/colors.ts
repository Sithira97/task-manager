const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700",
  "from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700",
  "from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700",
  "from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700",
  "from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700",
  "from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700",
];

export const getGradientClass = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

export const statusChartConfig = {
  open: {
    label: "Open",
    color: "#f59e0b",
  },
  in_progress: {
    label: "In Progress",
    color: "#3b82f6",
  },
  done: {
    label: "Done",
    color: "#10b981",
  },
};
