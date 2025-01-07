export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.NUXT_PUBLIC_API_BASE_URL

  try {
    const response = await fetch(`${baseURL}/api/tasks`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tasks',
    })
  }
})
