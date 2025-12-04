import { defineStore } from "pinia";
import authService from "../services/authService";

export const useAdminStore = defineStore("adminStore", {
  state: () => ({
    admin: JSON.parse(localStorage.getItem("adminData") || "null"),
    token: localStorage.getItem("adminToken") || "",
    lastActivity: localStorage.getItem("adminLastActivity") || Date.now(),
    _initialized: false
  }),

  getters: {
    isLoggedIn: (state) => {
      return !!(state.token && state.admin);
    },
  },

  actions: {
    async login(MSNV, password) {
      try {
        const res = await authService.loginAdmin(MSNV, password);

        console.log('🔐 Admin login response:', res);

        localStorage.setItem("adminToken", res.token);
        localStorage.setItem("adminData", JSON.stringify(res.admin));
        localStorage.setItem("adminLastActivity", Date.now().toString());

        this.token = res.token;
        this.admin = res.admin;
        this.lastActivity = Date.now();
        this._initialized = true;

        console.log('✅ Admin login successful - State updated');

        return res;
      } catch (error) {
        console.error('❌ Admin login error:', error);
        throw error;
      }
    },

    logout() {
      console.log('🔄 Admin logout initiated');

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      localStorage.removeItem("adminLastActivity");

      this.admin = null;
      this.token = "";
      this.lastActivity = 0;
      this._initialized = false;

      console.log('✅ Admin logout successful');
    },

    initialize() {
      try {
        if (this._initialized) return;

        const token = localStorage.getItem("adminToken");
        const adminData = localStorage.getItem("adminData");

        console.log('🔄 Admin store initialization:');
        console.log('   Admin token in localStorage:', !!token);
        console.log('   Admin data in localStorage:', !!adminData);

        if (token && adminData) {
          this.token = token;
          this.admin = JSON.parse(adminData);
          this.lastActivity = parseInt(localStorage.getItem("adminLastActivity") || Date.now().toString());
          this._initialized = true;

          console.log('✅ Admin store initialized from localStorage');
        } else {
          console.log('❌ No admin data found in localStorage');
          this.admin = null;
          this.token = "";
          this.lastActivity = 0;
          this._initialized = true;
        }
      } catch (error) {
        console.error('❌ Admin store initialization error:', error);
        this._initialized = true;
      }
    },

    updateActivity() {
      const now = Date.now();
      localStorage.setItem("adminLastActivity", now.toString());
      this.lastActivity = now;
      console.log('🔄 Admin activity updated');
    }
  }
});