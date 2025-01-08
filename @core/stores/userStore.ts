import type { User } from "@/types/user";
import { useAuth0 } from "@auth0/auth0-vue";
import { defineStore } from "pinia";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  }),

  getters: {
    getUserData: (state) => state.user,
    getAuthStatus: (state) => state.isAuthenticated,
    getLoadingStatus: (state) => state.isLoading,
  },

  actions: {
    async initializeUserFromAuth0() {
      const { user, isAuthenticated, isLoading } = useAuth0();

      this.isLoading = isLoading.value;
      this.isAuthenticated = isAuthenticated.value;

      if (user.value) {
        this.user = {
          nickname: user.value.nickname || "",
          name: user.value.name || "",
          picture: user.value.picture || "",
          updated_at: user.value.updated_at || "",
          email: user.value.email || "",
          email_verified: user.value.email_verified || false,
          sub: user.value.sub || "",
        };
      }
    },

    clearUserData() {
      this.user = null;
      this.isAuthenticated = false;
    },

    setLoadingStatus(status: boolean) {
      this.isLoading = status;
    },

    initializeUserFromCookie() {
      const userData = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userData="))
        ?.split("=")[1];

      if (userData) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userData));
          console.log(parsedUser);
          this.user = parsedUser;
          console.log(this.user);
          this.isAuthenticated = true;
        } catch (error) {
          console.error("Failed to parse user data from cookie:", error);
          this.clearUserData();
        }
      } else {
        this.clearUserData();
      }
    },
  },
});
