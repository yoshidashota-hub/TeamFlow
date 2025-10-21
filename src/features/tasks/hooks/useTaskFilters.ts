import { useTaskStore } from "../store/taskStore";

export function useTaskFilters() {
  const filters = useTaskStore((state) => state.filters);
  const showDetailedFilters = useTaskStore((state) => state.showDetailedFilters);

  const setSearch = useTaskStore((state) => state.setSearch);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
  const setProjectFilter = useTaskStore((state) => state.setProjectFilter);
  const setAssigneeFilter = useTaskStore((state) => state.setAssigneeFilter);
  const setTagFilter = useTaskStore((state) => state.setTagFilter);
  const resetFilters = useTaskStore((state) => state.resetFilters);
  const toggleDetailedFilters = useTaskStore(
    (state) => state.toggleDetailedFilters
  );

  return {
    filters,
    showDetailedFilters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setProjectFilter,
    setAssigneeFilter,
    setTagFilter,
    resetFilters,
    toggleDetailedFilters,
  };
}
