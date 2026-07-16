import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Task } from "../types";
import Button from "./Button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [status, setStatus] = useState<Task["status"]>("open");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState<[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize fields on open or change of edit target
  useEffect(() => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("open");
    setDueDate("");
    setAssignedTo([]);
    setFormError(null);
    setSubmitting(false);
  }, [isOpen]);

  // Handle native HTML5 dialog element opening/closing via standard API
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Click outside backdrop fallback close listener for browsers without closedby="any" support (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        onClose();
      }
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  return (
    <dialog
      className="m-auto border-0 rounded-lg p-5 w-[calc(100%-10px)] md:w-[42rem]"
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-foreground">
          Create New Task
        </h2>
        <button
          onClick={onClose}
          className="text-text hover:text-red-500 transition-colors"
          title="Close Modal"
        >
          <X size={20} />
        </button>
      </div>

      {formError && (
        <div className="fade-in text-red-500 text-sm">{formError}</div>
      )}

      <form className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Implement login authentication"
            className="border-border border-1 bg-input border w-full rounded-md px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="task-desc">Description *</label>
          <textarea
            id="task-desc"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write Express JWT verification and token storage."
            className="border-border border-1 bg-input border w-full rounded-md px-3 py-2"
          />
        </div>

        <div className="flex flex-row gap-1 mb-2">
          <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task["priority"])}
              className="border-border border-1 bg-input border w-full rounded-md px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className="border-border border-1 bg-input border w-full rounded-md px-3 py-2"
            >
              <option value="to_do">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="testing">Testing</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex gap-1 mb-2">
          <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
            <label htmlFor="task-due">Due Date *</label>
            <input
              id="task-due"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-border border-1 bg-input border w-full rounded-md px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
            <label htmlFor="task-assignee">Assignee</label>
            <select
              multiple
              id="task-assignee"
              value={assignedTo}
              onChange={(e) => {
                console.log(e);
              }}
              className="border-border border-1 bg-input border w-full rounded-md px-3 py-2"
            >
              <option value={-1}>Unassigned</option>
              <option value={1}>Jane</option>
              <option value={2}>John</option>
              <option value={3}>Doe</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? "Saving..." : "Save Task"}
          </Button>
        </div>
      </form>
    </dialog>
  );
};

export default TaskModal;
