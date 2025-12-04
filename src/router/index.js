import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import SachList from "../views/SachList.vue";
import SachDetail from "../views/SachDetail.vue";
import LoginUser from "../views/LoginUser.vue";
import RegisterUser from "../views/RegisterUser.vue";
import UserBorrowList from "../views/UserBorrowList.vue";
import UserProfile from "../views/UserProfile.vue";

import AdminLogin from "../views/admin/AdminLogin.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminPending from "../views/admin/AdminPending.vue";
import AdminApproved from "../views/admin/AdminApproved.vue";
import AdminManageSach from "../views/admin/AdminManageSach.vue";
import AdminBorrowAll from "../views/admin/AdminBorrowAll.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/sach", component: SachList },
  { path: "/sach/:id", component: SachDetail },
  { path: "/login", component: LoginUser },
  { path: "/register", component: RegisterUser },
  { path: "/my-borrow", component: UserBorrowList },
  { path: "/profile", component: UserProfile },

  { path: "/admin/login", component: AdminLogin },
  { path: "/admin/dashboard", component: AdminDashboard },
  { path: "/admin/pending", component: AdminPending },
  { path: "/admin/approved", component: AdminApproved },
  { path: "/admin/manage-sach", component: AdminManageSach },
  { path: "/admin/borrow-all", component: AdminBorrowAll },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;