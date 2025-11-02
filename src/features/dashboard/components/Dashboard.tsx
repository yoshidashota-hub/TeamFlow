"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import type { TaskWithRelations } from "@/features/tasks/types";
import type { ProjectWithTaskStats } from "@/features/projects";

interface DashboardProps {
  tasks: TaskWithRelations[];
  projects: ProjectWithTaskStats[];
}

// タスクステータスラベルのマッピング
const STATUS_LABELS: Record<string, string> = {
  未着手: "未着手",
  進行中: "進行中",
  レビュー: "レビュー",
  完了: "完了",
};

// 優先度ラベルのマッピング
const PRIORITY_LABELS: Record<string, string> = {
  低: "低",
  中: "中",
  高: "高",
  緊急: "緊急",
};

export function Dashboard({ tasks, projects }: DashboardProps) {
  // 統計計算
  const completedTasks = tasks.filter((t) => t.status === "完了").length;
  const inProgressTasks = tasks.filter((t) => t.status === "進行中").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "完了"
  ).length;
  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const totalCompletedHours = tasks.reduce((sum, t) => {
    if (t.status === "完了" && t.estimatedHours) {
      return sum + t.estimatedHours;
    }
    return sum;
  }, 0);

  // ステータス分布データ
  const statusData = [
    { name: "未着手", value: tasks.filter((t) => t.status === "未着手").length, color: "#94A3B8" },
    { name: "進行中", value: inProgressTasks, color: "#3B82F6" },
    { name: "レビュー", value: tasks.filter((t) => t.status === "レビュー").length, color: "#F59E0B" },
    { name: "完了", value: completedTasks, color: "#10B981" },
  ];

  // プロジェクト別進捗データ
  const projectData = projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const completed = projectTasks.filter((t) => t.status === "完了").length;
    return {
      name: project.name,
      完了: completed,
      総タスク数: projectTasks.length,
      進捗率: projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0,
    };
  });

  // ユーザー別生産性データ
  const userProductivityData = (() => {
    const userMap = new Map<string, { name: string; completed: number; inProgress: number; total: number }>();

    tasks.forEach((task) => {
      const userId = task.assigneeId;
      const userName = task.assignee.name || "未割当";

      if (!userMap.has(userId)) {
        userMap.set(userId, { name: userName, completed: 0, inProgress: 0, total: 0 });
      }

      const userData = userMap.get(userId)!;
      userData.total += 1;

      if (task.status === "完了") {
        userData.completed += 1;
      } else if (task.status === "進行中") {
        userData.inProgress += 1;
      }
    });

    return Array.from(userMap.values()).map(({ name, completed, inProgress, total }) => ({
      name,
      完了: completed,
      進行中: inProgress,
      総タスク数: total,
    }));
  })();

  // バーンダウンチャートデータ（簡易版）
  const burndownData = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (9 - i));
    const tasksAtDate = Math.max(tasks.length - i * 1.2, completedTasks);
    return {
      date: date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }),
      理想: Math.max(tasks.length - (i * tasks.length) / 9, 0),
      実績: tasksAtDate,
    };
  });

  // 優先度分布データ
  const priorityData = [
    { name: "低", value: tasks.filter((t) => t.priority === "低").length, color: "#94A3B8" },
    { name: "中", value: tasks.filter((t) => t.priority === "中").length, color: "#3B82F6" },
    { name: "高", value: tasks.filter((t) => t.priority === "高").length, color: "#F97316" },
    { name: "緊急", value: tasks.filter((t) => t.priority === "緊急").length, color: "#EF4444" },
  ];

  return (
    <div className="space-y-8">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-800/30 bg-gradient-to-br from-emerald-950/50 to-emerald-900/20 transition-all hover:border-emerald-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-emerald-300">完了タスク</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-emerald-100">{completedTasks}</div>
            <p className="mt-1 text-xs text-emerald-400/70">
              全{tasks.length}タスク中
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-800/30 bg-gradient-to-br from-indigo-950/50 to-indigo-900/20 transition-all hover:border-indigo-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-indigo-300">進行中</CardTitle>
            <Clock className="h-5 w-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-indigo-100">{inProgressTasks}</div>
            <p className="mt-1 text-xs text-indigo-400/70">アクティブなタスク</p>
          </CardContent>
        </Card>

        <Card className="border-red-800/30 bg-gradient-to-br from-red-950/50 to-red-900/20 transition-all hover:border-red-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-red-300">期限超過</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-100">{overdueTasks}</div>
            <p className="mt-1 text-xs text-red-400/70">要対応タスク</p>
          </CardContent>
        </Card>

        <Card className="border-purple-800/30 bg-gradient-to-br from-purple-950/50 to-purple-900/20 transition-all hover:border-purple-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-purple-300">工数進捗</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-purple-100">
              {totalEstimatedHours > 0 ? Math.round((totalCompletedHours / totalEstimatedHours) * 100) : 0}%
            </div>
            <p className="mt-1 text-xs text-purple-400/70">
              {totalCompletedHours}h / {totalEstimatedHours}h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* チャート */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              プロジェクト別進捗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="完了" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="総タスク数" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              タスクステータス分布
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              バーンダウンチャート
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="理想" stroke="#a1a1aa" strokeDasharray="5 5" strokeWidth={2} />
                <Line type="monotone" dataKey="実績" stroke="#6366f1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              メンバー別生産性
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userProductivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="完了" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="進行中" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            優先度分布
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
