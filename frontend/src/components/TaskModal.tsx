import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Task, User } from "../types";
import Button from "./Button";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import Select from "./Select";
import { cleanCapitalize } from "../utils/words";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { createTask } = useTasks();
  const { token } = useAuth();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [status, setStatus] = useState<Task["status"]>("open");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState<(string | number)[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen || !token) return;
      try {
        const res = await fetch("/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [isOpen, token]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setFormError(null);

    const success = await createTask({
      title,
      description,
      priority,
      status,
      due_date: dueDate,
      assignees: assignedTo as any,
    });

    if (success) {
      onClose();
    } else {
      setFormError("Failed to create task. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <dialog
      className="m-auto border-0 rounded-lg p-5 w-[calc(100%-10px)] md:w-[42rem] overflow-visible"
      ref={dialogRef}
      onClose={onClose}
      onCancel={(e) => e.preventDefault()}
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
        <div className="fade-in text-red-500 text-sm mb-4">{formError}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
          <label htmlFor="task-priority">Priority</label>
          <Select
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            value={priority}
            onChange={(val) => setPriority(val as Task["priority"])}
          />
        </div>

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

        <div className="flex flex-row gap-2 mb-2">
          <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
            <label htmlFor="task-status">Status</label>
            <Select
              options={[
                { value: "open", label: "Open" },
                { value: "in_progress", label: "In Progress" },
                { value: "done", label: "Done" },
              ]}
              value={status}
              onChange={(val) => setStatus(val as Task["status"])}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
            <label htmlFor="task-due">Due Date *</label>
            <input
              id="task-due"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-border border-1 bg-input border w-full rounded-md px-3 py-[9px]"
            />
          </div>

          <div className="flex flex-col gap-1 mb-2" style={{ flex: 1 }}>
            <label htmlFor="task-assignee">Assignees</label>
            <Select
              multiple
              options={users.map((u) => ({
                value: u.id!,
                label: cleanCapitalize(u.username),
              }))}
              value={assignedTo}
              onChange={(val) => setAssignedTo(val)}
              placeholder="Select assignees..."
            />
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
