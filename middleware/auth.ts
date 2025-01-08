import { defineNuxtRouteMiddleware } from "#app";
import { useUserStore } from "@/@core/stores/userStore";
import type { User } from "@/types/user";
import { useAuth0 } from "@auth0/auth0-vue";
const config = useRuntimeConfig();
const userStore = useUserStore();

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const {
      isAuthenticated,
      isLoading,
      loginWithRedirect,
      logout,
      getAccessTokenSilently,
      idTokenClaims,
      user,
    } = useAuth0();

    // Aguarde até que o estado de carregamento termine
    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (isAuthenticated.value) {
      console.log("isAuthenticated", isAuthenticated.value);
      console.log("isLoading", isLoading.value);
      console.log("getAccessTokenSilently", getAccessTokenSilently);
      console.log("idTokenClaims", idTokenClaims);
      console.log("idTokenClaims", idTokenClaims.value?.__raw);
      if (user.value) {
        useCookie<Partial<User>>("userData").value = user.value;
      }
      useCookie<string>("token").value = idTokenClaims.value?.__raw || "";

      userStore.initializeUserFromAuth0();
    } else if (!isAuthenticated.value) {
      const accessToken = useCookie("token");
      if (accessToken.value) {
        userStore.initializeUserFromCookie();
      } else if (!accessToken.value) {
        await logout({
          logoutParams: {
            returnTo: config.public.AUTH0_REDIRECT_LOCAL_URI,
          },
        });
      }
    }
  }
});
