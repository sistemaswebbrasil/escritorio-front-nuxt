import type { Task } from "~/types/task";

export const useTaskApi = () => {
  const config = useRuntimeConfig();

  const getAllTasks = async (): Promise<Task[]> => {
    const response = await $api(`/api/tasks`);
    return response;
  };

  const getTaskById = async (id: number): Promise<Task> => {
    const response = await fetch(`/api/tasks/${id}`);
    return response.json();
  };

  const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return response.json();
  };

  const updateTask = async (id: number, task: Task): Promise<Task> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return response.json();
  };

  const deleteTask = async (id: number): Promise<void> => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  };

  return {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
  };
};
