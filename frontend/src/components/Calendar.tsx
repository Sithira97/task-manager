import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import type { Task } from "../types";
import { getDaysInMonth, getFirstDayOfMonth, isSameDay } from "../lib/calender";
import { getStatusClasses, getStatusIcon } from "../lib/enums";
import TaskCard from "./TaskCard";
import TaskView from "./TaskView";

const Calendar: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [modalView, setModalView] = useState<{ open: boolean; taskId: number }>(
    {
      open: false,
      taskId: 0,
    },
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayOfMonth(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const cells: { date: Date; isCurrentMonth: boolean; key: string }[] = [];

  // Previous Month padding
  for (let i = firstDayIdx - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({
      date: new Date(prevYear, prevMonth, d),
      isCurrentMonth: false,
      key: `prev-${d}`,
    });
  }

  // Current Month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    cells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
      key: `curr-${d}`,
    });
  }

  // Next Month padding
  const remainingCells = 42 - cells.length;
  for (let d = 1; d <= remainingCells; d++) {
    cells.push({
      date: new Date(nextYear, nextMonth, d),
      isCurrentMonth: false,
      key: `next-${d}`,
    });
  }

  // Group into weeks
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < 42; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Get tasks due on a date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const tDate = new Date(task.due_date);
      return isSameDay(tDate, date);
    });
  };

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const today = new Date();
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <main className="flex flex-col 2xl:flex-row gap-2">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-primary">
                {monthName} {year}
              </h2>
              <p className="text-xs text-muted-foreground">
                {tasks.length} total tasks scheduled
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl border border-border hover:bg-muted text-foreground transition-all duration-200"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted text-foreground transition-all duration-200"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl border border-border hover:bg-muted text-foreground transition-all duration-200"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="table-fixed w-full border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/7">
                  Mon
                </th>
                <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/7">
                  Tue
                </th>
                <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/7">
                  Wed
                </th>
                <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/7">
                  Thu
                </th>
                <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/7">
                  Fri
                </th>
                <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/7">
                  Sat
                </th>
                <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/7">
                  Sun
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {weeks.map((week, weekIdx) => (
                <tr key={`week-${weekIdx}`} className="divide-x divide-border">
                  {week.map(({ date, isCurrentMonth, key }) => {
                    const dayTasks = getTasksForDate(date);
                    const isToday = isSameDay(date, today);
                    const isSelected =
                      selectedDate && isSameDay(date, selectedDate);

                    return (
                      <td
                        key={key}
                        onClick={() => {
                          setSelectedDate(date);
                        }}
                        className={`sm:h-28 h-16 p-2.5 vertical-align-top align-top relative transition-all duration-200 cursor-pointer hover:bg-muted/30 ${
                          !isCurrentMonth ? "bg-muted/10 opacity-50" : ""
                        } ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-bold flex items-center justify-center rounded-full transition-all duration-200 ${
                              isToday
                                ? "w-6 h-6 bg-primary text-primary-foreground shadow-md shadow-primary/30"
                                : isSelected
                                  ? "text-primary"
                                  : "text-foreground"
                            }`}
                          >
                            {date.getDate()}
                          </span>
                          {dayTasks.length > 0 && (
                            <span className="text-[10px] hidden md:block bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground font-semibold">
                              {dayTasks.length}{" "}
                              {dayTasks.length === 1 ? "task" : "tasks"}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[70px] w-full">
                          {dayTasks.slice(0, 2).map((task) => {
                            const StatusIcon = getStatusIcon(task.status);
                            return (
                              <div
                                key={task.id}
                                className={`${task.status == "done" ? "line-through" : ""} w-full text-[10px] px-1.5 py-0.5 rounded border font-medium truncate flex items-center gap-1 ${getStatusClasses(
                                  task.status,
                                )}`}
                              >
                                <span className="shrink-0">
                                  <StatusIcon size={12} />
                                </span>
                                <span className="truncate line-clamp-1 hidden sm:block">
                                  {task.title}
                                </span>
                              </div>
                            );
                          })}
                          {dayTasks.length > 2 && (
                            <div className="text-[9px] text-muted-foreground font-bold pl-1">
                              + {dayTasks.length - 2} more
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full 2xl:w-96 flex flex-col gap-4 h-full">
        {selectedDate && (
          <div className="2xl:h-full bg-card border border-border rounded-2xl shadow p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-black text-lg">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tasks for this day
                </p>
              </div>
            </div>

            <div className="2xl:flex-1 flex lg:grid 2xl:flex grid-cols-2 flex-col h-full gap-3 overflow-y-auto p-1">
              {selectedTasks.length === 0 ? (
                <div className="2xl:flex-1 flex items-center justify-center text-center py-8 text-muted-foreground text-sm flex-col items-center gap-2">
                  <CalendarIcon
                    size={32}
                    className="text-muted-foreground/30"
                  />
                  <span>No tasks scheduled for this day</span>
                </div>
              ) : (
                selectedTasks.map((task) => (
                  <div key={task.id}>
                    <TaskCard task={task} setModalView={setModalView} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <TaskView
        isOpen={modalView.open}
        onClose={() => setModalView({ open: false, taskId: 0 })}
        task={tasks.find((t) => t.id === modalView.taskId)}
      />
    </main>
  );
};

export default Calendar;
