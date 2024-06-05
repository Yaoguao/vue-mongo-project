<script setup>
import { ref } from 'vue';
import http from "@/http.js";
import router from "@/plugins/router.js";

const name = ref('');
const email = ref('');
const subjects = ref(['']);

const headers = {
  'Authorization': localStorage.getItem('authToken')
}
const createTeacher = async () => {
  try {
    const response = await http.post('/api/teachers', {
      name: name.value,
      email: email.value,
      subjects: subjects.value
    }, {
      headers
    });
    if (response.status === 200) {
      console.log('User created:', response.data);
      await router.push({name: 'Admin'})
    }
  } catch (error) {
    console.error(error)
  }
};
</script>

<template>
  <v-app>
    <v-container>
      <v-text-field v-model="name" label="Name" single-line clearable></v-text-field>
      <v-text-field v-model="email" label="Email" single-line clearable></v-text-field>
      <v-textarea v-model="subjects" label="Subjects" single-line clearable></v-textarea>
      <v-btn color="primary" @click="createTeacher">Create</v-btn>
    </v-container>
  </v-app>
</template>
<style scoped>

</style>