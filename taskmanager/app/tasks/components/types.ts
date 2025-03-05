// app/tasks/components/types.ts
export enum TaskStatus {
  Pending = "pending",
  Completed = "completed",
  InProgress = "in_progress"
}

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus; // Use enum here
  dueDate: Date;
};