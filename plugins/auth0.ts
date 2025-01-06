import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin(nuxtApp => {
  if (process.client) {
    const config = useRuntimeConfig()

    // const auth0 = createAuth0({
    //   domain: config.public.AUTH0_DOMAIN || 'sssss',
    //   clientId: config.public.AUTH0_CLIENT_ID || 'ccccccc',
    //   authorizationParams: {
    //     redirect_uri: window.location.origin,
    //     scope: 'openid profile email',
    //     response_type: 'code',
    //     prompt: 'login',
    //   },
    //   useRefreshTokens: true,
    //   useFormData: true,
    // })

    const auth0 = createAuth0({
      domain: config.public.AUTH0_DOMAIN,
      clientId: config.public.AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })

    nuxtApp.vueApp.use(auth0)

    // addRouteMiddleware('auth', () => {
    //   auth0.checkSession()
    //   if (!auth0.isAuthenticated.value) {
    //     auth0.loginWithRedirect({
    //       appState: {
    //         target: useRoute().path,
    //       },
    //     })
    //   }
    // })
  }
})
