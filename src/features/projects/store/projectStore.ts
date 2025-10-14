import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ProjectStore {
  selectedProjectId: string | null;
  setSelectedProject: (projectId: string | null) => void;
  clearSelectedProject: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    persist(
      (set) => ({
        selectedProjectId: null,

        setSelectedProject: (projectId) =>
          set({ selectedProjectId: projectId }),
        clearSelectedProject: () => set({ selectedProjectId: null }),
      }),
      {
        name: "project-storage",
      }
    ),
    { name: "ProjectStore" }
  )
);
