export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.NUXT_PUBLIC_API_BASE_URL
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const response = await fetch(`${baseURL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update task',
    })
  }
})
