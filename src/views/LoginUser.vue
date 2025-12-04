<template>
  <h1>Đăng nhập</h1>
  <input v-model="email" placeholder="Email" />
  <input v-model="password" type="password" placeholder="Mật khẩu" />
  <button @click="login">Đăng nhập</button>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const userStore = useUserStore();
const router = useRouter();

async function login() {
  await userStore.login(email.value, password.value);
  router.push("/");
}
</script>
