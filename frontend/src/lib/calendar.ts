export const getDaysInMonth = (y: number, m: number) =>
  new Date(y, m + 1, 0).getDate();

export const getFirstDayOfMonth = (y: number, m: number) => {
  const day = new Date(y, m, 1).getDay();
  // Monday first mapping: Mon = 0 ... Sun = 6
  return day === 0 ? 6 : day - 1;
};

export const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

export const parseTaskDate = (dateStr: string) => {
  if (!dateStr) return new Date(0);
  const normalized = dateStr.includes("T")
    ? dateStr
    : dateStr.replace(" ", "T");
  return new Date(normalized);
};
