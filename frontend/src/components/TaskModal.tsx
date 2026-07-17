import React, { useEffect, useState } from "react";
import type { Task, User } from "../types";
import { Button } from "@/components/ui/button";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { cleanCapitalize } from "../lib/words";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field, FieldLabel } from "./ui/field";
import { DatePickerInput } from "./ui/date-picker";
import { formatDate } from "date-fns";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  task?: Task;
}

const statusValues = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityValues = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  isEdit = false,
  task,
}) => {
  const { createTask, updateTaskOptimistic } = useTasks();
  const { token } = useAuth();
  const anchor = useComboboxAnchor();

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
    if (isEdit && task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(formatDate(task.due_date, "yyyy-MM-dd"));

      setAssignedTo(task.assignees.map((user: any) => user.id || user.user_id));
    } else {
      // Clear fields for creation mode
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("open");
      setDueDate("");
      setAssignedTo([]);
    }
    setFormError(null);
  }, [task, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title || !description || !dueDate) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    const taskPayload = {
      title,
      description,
      priority,
      status,
      due_date: formatDate(dueDate, "yyyy-MM-dd"),
      assignees: assignedTo as any,
    };

    let success = false;
    if (isEdit) {
      success = await updateTaskOptimistic(task.id, taskPayload);
    } else {
      success = await createTask(taskPayload);
    }
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setFormError("Failed to create task. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[42rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle id="modal-title">Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task in your workspace.
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="fade-in text-red-500 text-sm mb-4">{formError}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="task-title">Title *</FieldLabel>
            <Input
              id="task-title"
              className="text-sm"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Implement login authentication"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="task-desc">Description *</FieldLabel>
            <Textarea
              className="text-sm"
              id="task-desc"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write Express JWT verification and token storage."
            />
          </Field>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="task-status">Status</FieldLabel>
              <Select
                items={statusValues}
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statusValues.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
              <Select
                items={priorityValues}
                value={priority}
                onValueChange={setPriority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priorityValues.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field className="col-span-2 md:col-span-1">
              <FieldLabel htmlFor="task-due">Due Date *</FieldLabel>
              <DatePickerInput
                id="task-due"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="task-assignee">Assignees</FieldLabel>
            <Combobox
              multiple
              autoHighlight
              items={users}
              value={assignedTo}
              onValueChange={setAssignedTo}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((value: number) => (
                        <ComboboxChip key={value + Math.random()}>
                          {cleanCapitalize(
                            users.find((user) => user.id === value)?.username,
                          )}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder="Select assignees" />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: User) => (
                    <ComboboxItem key={item.id + Math.random()} value={item.id}>
                      {cleanCapitalize(item.username)}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
