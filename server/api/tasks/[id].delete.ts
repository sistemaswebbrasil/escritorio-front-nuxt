export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.NUXT_PUBLIC_API_BASE_URL;
  const id = getRouterParam(event, "id");
  const token = getCookie(event, "token");

  try {
    const response = await fetch(`${baseURL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { status: "success" };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete task",
    });
  }
});
