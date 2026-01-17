"use client";

import { useState } from "react";
import { Plus, Check, Clock, AlertCircle, MessageCircle, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TaskStatus = "pending" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
}

const statusConfig = {
  pending: { label: "ממתין", color: "text-yellow-600 bg-yellow-50", icon: Clock },
  in_progress: { label: "בביצוע", color: "text-blue-600 bg-blue-50", icon: AlertCircle },
  completed: { label: "הושלם", color: "text-emerald-600 bg-emerald-50", icon: Check },
};

const initialTasks: Task[] = [];

export default function TasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const filteredTasks = filter === "all"
    ? tasks
    : tasks.filter((task) => task.status === filter);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          ...newTask,
          status: "pending",
        },
      ]);
      setNewTask({ title: "", description: "", dueDate: "", priority: "medium" });
      setIsAddingNew(false);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        username="user"
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        username="ew5933070@gmail.com"
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4 ml-2" />
            משימה חדשה
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-900">משימות למעקב</h1>
            <p className="text-slate-500 mt-1">
              נהל את המשימות הפיננסיות שלך
            </p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "in_progress", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === status
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {status === "all" ? "הכל" : statusConfig[status].label}
              <span className="mr-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                {taskCounts[status]}
              </span>
            </button>
          ))}
        </div>

        {/* Add New Task Form */}
        {isAddingNew && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>משימה חדשה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="כותרת המשימה"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="text-right"
              />
              <Input
                placeholder="תיאור (אופציונלי)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="text-right"
              />
              <div className="flex gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })
                  }
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-right"
                >
                  <option value="low">עדיפות נמוכה</option>
                  <option value="medium">עדיפות בינונית</option>
                  <option value="high">עדיפות גבוהה</option>
                </select>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1"
                >
                  ביטול
                </Button>
                <Button
                  onClick={handleAddTask}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  הוסף משימה
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <Card>
          <CardContent className="p-0">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>אין משימות להצגה</p>
                <p className="text-sm mt-1">לחץ על "משימה חדשה" כדי להוסיף</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredTasks.map((task) => {
                  const StatusIcon = statusConfig[task.status].icon;
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value as TaskStatus)
                        }
                        className={cn(
                          "px-3 py-1 rounded-lg text-sm",
                          statusConfig[task.status].color
                        )}
                      >
                        <option value="pending">ממתין</option>
                        <option value="in_progress">בביצוע</option>
                        <option value="completed">הושלם</option>
                      </select>
                      <div className="flex-1 text-right mr-4">
                        <h3 className="font-medium text-slate-900">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-slate-500">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-sm text-slate-400 mt-1 justify-end">
                            <span>{task.dueDate}</span>
                            <Calendar className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className={cn("p-2 rounded-full", statusConfig[task.status].color)}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center" aria-label="פתח צ'אט">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
