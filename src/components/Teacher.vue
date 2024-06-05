<script setup>

// Props
import http from "@/http.js";
import router from "@/plugins/router.js";

const props = defineProps({
  teacher: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      email: '',
      subjects: ''
    })
  }
});

// Methods

const deleteTeacher = async () => {
  console.log(localStorage.getItem('authToken'));
  console.log(props.teacher.id);
  const headers = {
    'Authorization': localStorage.getItem('authToken')
  }
  const response = await http.delete(`/api/teachers/${props.teacher.id}`, {
    headers
  });
  router.go();
  console.log('Delete student:', props.teacher);
};
</script>

<template>
  <v-card class="teacher" outlined>
    <v-card-title>ID: {{ teacher.id }}</v-card-title>
    <v-card-subtitle>{{ teacher.name }}</v-card-subtitle>
    <v-card-text>Email: {{ teacher.email }}</v-card-text>
    <v-card-item>Subjects: {{teacher.subjects}}</v-card-item>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('edit', teacher)">Edit</v-btn>
      <v-btn color="error" @click="deleteTeacher">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.student {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  margin-right: 5px;
}
</style>