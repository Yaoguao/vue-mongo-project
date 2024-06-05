<script setup>
import { ref } from 'vue';
import http from "@/http.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const error = ref(false);

const login = async () => {
  try {
    const response = await http.post('/api/login', {
      username: username.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 201) {
      const token = response.data
      console.log(token)
      localStorage.setItem('authToken', token);

      router.push({ name: 'HomePage' })

    } else if (response.status === 401) {
      error: true;
    }
    console.log(response)
  } catch (error) {
    console.error(error)
  }
};

const generateToken = () => {
  return btoa(Math.random().toString(36).substring(2, 15));
};
</script>

<template>
  <v-app>
    <v-container>Login</v-container>
    <v-container>
      <v-text-field v-model="username" label="Username" single-line clearable></v-text-field>
      <v-text-field v-model="password" label="Password" single-line clearable type="password"></v-text-field>
    </v-container>
    <v-text-field className="error" v-if="error">Error authorization. You entered the wrong username or password</v-text-field>
    <v-btn variant="plain" @click="login">Login</v-btn>
  </v-app>
</template>

<style scoped>
.error {
  color: red;
}
/* Your styles here */
</style>



