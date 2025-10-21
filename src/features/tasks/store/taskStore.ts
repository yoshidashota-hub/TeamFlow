import { create } from "zustand";

interface TaskFilters {
  search: string;
  status: string[];
  priority: string[];
  projectIds: string[];
  assigneeIds: string[];
  tags: string[];
}

interface TaskStore {
  // フィルター状態
  filters: TaskFilters;

  // 詳細フィルター表示状態
  showDetailedFilters: boolean;

  // モーダル状態
  isCreateModalOpen: boolean;
  editingTaskId: string | null;

  // アクション
  setSearch: (search: string) => void;
  setStatusFilter: (status: string[]) => void;
  setPriorityFilter: (priority: string[]) => void;
  setProjectFilter: (projectIds: string[]) => void;
  setAssigneeFilter: (assigneeIds: string[]) => void;
  setTagFilter: (tags: string[]) => void;
  resetFilters: () => void;

  toggleDetailedFilters: () => void;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (taskId: string) => void;
  closeEditModal: () => void;
}

const initialFilters: TaskFilters = {
  search: "",
  status: [],
  priority: [],
  projectIds: [],
  assigneeIds: [],
  tags: [],
};

export const useTaskStore = create<TaskStore>((set) => ({
  filters: initialFilters,
  showDetailedFilters: false,
  isCreateModalOpen: false,
  editingTaskId: null,

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),

  setStatusFilter: (status) =>
    set((state) => ({
      filters: { ...state.filters, status },
    })),

  setPriorityFilter: (priority) =>
    set((state) => ({
      filters: { ...state.filters, priority },
    })),

  setProjectFilter: (projectIds) =>
    set((state) => ({
      filters: { ...state.filters, projectIds },
    })),

  setAssigneeFilter: (assigneeIds) =>
    set((state) => ({
      filters: { ...state.filters, assigneeIds },
    })),

  setTagFilter: (tags) =>
    set((state) => ({
      filters: { ...state.filters, tags },
    })),

  resetFilters: () =>
    set({
      filters: initialFilters,
    }),

  toggleDetailedFilters: () =>
    set((state) => ({
      showDetailedFilters: !state.showDetailedFilters,
    })),

  openCreateModal: () =>
    set({
      isCreateModalOpen: true,
      editingTaskId: null,
    }),

  closeCreateModal: () =>
    set({
      isCreateModalOpen: false,
    }),

  openEditModal: (taskId) =>
    set({
      isCreateModalOpen: true,
      editingTaskId: taskId,
    }),

  closeEditModal: () =>
    set({
      isCreateModalOpen: false,
      editingTaskId: null,
    }),
}));
