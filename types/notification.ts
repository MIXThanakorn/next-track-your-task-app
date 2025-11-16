export interface TaskNotification {
  task_id: number;
  task_name: string;
  status: "todo" | "in_progress" | "overdue";
  priority: "low" | "medium" | "high";
  due_date: string;
  notification_status: boolean;
}

export interface Notification {
  task_id: number;
  task_name: string;
  status: "todo" | "in_progress" | "overdue";
  priority: "low" | "medium" | "high";
  due_date: string;
  notified: boolean;
  notification_sent_at: string;
}