export const $api = $fetch.create({
  // Request interceptor
  async onRequest({ options }) {
    // Set baseUrl for all API calls
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl as string;
    options.baseURL = apiBaseUrl || "/api";

    const accessToken = useCookie("token").value;
    if (accessToken) {
      options.headers = new Headers(options.headers);
      options.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  },
});
