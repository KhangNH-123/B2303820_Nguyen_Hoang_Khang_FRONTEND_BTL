import { defineStore } from "pinia";
import authService from "../services/authService";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("userData") || "null"),
    token: localStorage.getItem("userToken") || "",
    lastActivity: localStorage.getItem("userLastActivity") || Date.now(),
  }),

  getters: {
    isLoggedIn: (state) => {
      const userToken = localStorage.getItem("userToken");
      const userData = localStorage.getItem("userData");

      console.log('👤 UserStore isLoggedIn check:');
      console.log('   User token in localStorage:', userToken ? 'EXISTS' : 'MISSING');
      console.log('   Admin token in localStorage:', localStorage.getItem('adminToken') ? 'EXISTS' : 'MISSING');

      return !!(userToken && userData);
    },
  },

  actions: {
    async login(email, password) {
      try {
        const res = await authService.loginUser(email, password);

        localStorage.setItem("userToken", res.token);
        localStorage.setItem("userData", JSON.stringify(res.user));
        localStorage.setItem("userLastActivity", Date.now().toString());

        this.token = res.token;
        this.user = res.user;
        this.lastActivity = Date.now();

        console.log('✅ User login successful - Data saved to user storage');

        return res;
      } catch (error) {
        console.error('❌ User login error:', error);
        throw error;
      }
    },

    async register(data) {
      try {
        const res = await authService.registerUser(data);

        localStorage.setItem("userToken", res.token);
        localStorage.setItem("userData", JSON.stringify(res.user));
        localStorage.setItem("userLastActivity", Date.now().toString());

        this.token = res.token;
        this.user = res.user;
        this.lastActivity = Date.now();

        console.log('✅ User register successful - Data saved to user storage');

        return res;
      } catch (error) {
        console.error('❌ User register error:', error);
        throw error;
      }
    },

    logout() {
      console.log('🔄 User logout initiated');

      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userLastActivity");

      this.user = null;
      this.token = "";
      this.lastActivity = 0;

      console.log('✅ User logout successful - Only user data cleared');
    },

    updateActivity() {
      const now = Date.now();
      localStorage.setItem("userLastActivity", now.toString());
      this.lastActivity = now;
    },

    initialize() {
      try {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");

        console.log('🔄 User store initialization:');
        console.log('   User token in localStorage:', token ? 'EXISTS' : 'MISSING');
        console.log('   User data in localStorage:', userData ? 'EXISTS' : 'MISSING');

        if (token && userData) {
          this.token = token;
          this.user = JSON.parse(userData);
          this.lastActivity = parseInt(localStorage.getItem("userLastActivity") || Date.now().toString());

          console.log('✅ User store initialized from localStorage');
        } else {
          console.log('❌ No user data found in localStorage during initialization');
          this.user = null;
          this.token = "";
          this.lastActivity = 0;
        }
      } catch (error) {
        console.error('❌ User store initialization error:', error);
      }
    }
  }
});