<template>
  <div id="app">
    <UserNavbar v-if="!$route.path.startsWith('/admin')" />
    <AdminNavbar v-else />
    <main class="container-fluid px-0">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/userStore";
import { useAdminStore } from "./stores/adminStore";
import UserNavbar from "./components/UserNavbar.vue";
import AdminNavbar from "./components/AdminNavbar.vue";

const route = useRoute();
const userStore = useUserStore();
const adminStore = useAdminStore();

watch(
  () => route.path,
  (newPath, oldPath) => {
    const wasAdminRoute = oldPath.startsWith("/admin");
    const isAdminRoute = newPath.startsWith("/admin");
    if (wasAdminRoute && !isAdminRoute) {
    } else if (!wasAdminRoute && isAdminRoute) {
    }
    userStore.initialize();
    adminStore.initialize();
  }
);

onMounted(() => {
  userStore.initialize();
  adminStore.initialize();
  setTimeout(() => {}, 100);
});
</script>

<style>
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

.container-fluid {
  min-height: calc(100vh - 76px);
}
</style>
