import { defineNuxtRouteMiddleware } from '#app'
import { useAuth0 } from '@auth0/auth0-vue'
const config = useRuntimeConfig()

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const { isAuthenticated, isLoading, loginWithRedirect,logout } = useAuth0()

    // Aguarde até que o estado de carregamento termine
    while (isLoading.value) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('isAuthenticated', isAuthenticated.value)

    if (!isAuthenticated.value) {
      console.log('não autenticado')
       await logout({
        logoutParams: {
          returnTo: config.public.AUTH0_REDIRECT_LOCAL_URI,
        },
      })
    }
  }
})
