import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/api/tasks";
import toast from "react-hot-toast";

export function useTasks() {
  const queryClient = useQueryClient();

  /* -----------------------------
     GET TASKS
  ----------------------------- */
  const {
    data: tasks = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getTasks,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });

  /* -----------------------------
     CREATE TASK
  ----------------------------- */
  const createTaskMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      status?: string;
      dueDate?: string | null;
      reminderTime?: string | null;
    }) => taskApi.createTask(data),

    onSuccess: () => {
      toast.success("Task created");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /* -----------------------------
     UPDATE TASK
  ----------------------------- */
  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        description?: string;
        status?: string;
        dueDate?: string | null;
        reminderTime?: string | null;
      };
    }) => taskApi.updateTask(id, data),

    onSuccess: () => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /* -----------------------------
     DELETE TASK
  ----------------------------- */
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),

    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /* -----------------------------
     RETURN API
  ----------------------------- */
  return {
    tasks,
    isLoading,
    isFetching,
    refetch,

    createTask: (data: any) => createTaskMutation.mutateAsync(data),
    updateTask: (id: string, data: any) =>
      updateTaskMutation.mutateAsync({ id, data }),
    deleteTask: (id: string) => deleteTaskMutation.mutateAsync(id),
  };
}
