export interface TaskItem {
  task_id: string;
  task_name: string;
  task_detail: string;
  created_at: string;
  update_at: string;
  priority: "high" | "medium" | "low" ;
  status: "todo" | "in_progress" | "done" | "overdue";
  start_date: string;
  due_date: string;
  notification_status: boolean;
  user_id: string;
  notified: boolean;
  notification_sent_at: string;
  finished_date: string | null;
}
