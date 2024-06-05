<script setup>

// Props
import http from "@/http.js";
import router from "@/plugins/router.js";

const props = defineProps({
  subject: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      teacherId: '',
      gradesStudents: []
    })
  }
});

// Methods
const deleteSubject = async () => {
  const headers = {
    'Authorization': localStorage.getItem('authToken')
  }
  const response = await http.delete(`/api/subjects/${props.subject.id}`, {
    headers
  });
  router.go();
  console.log('Delete student:', props.subject);
};
</script>

<template>
  <v-card class="student" outlined>
    <v-card-title>ID: {{ subject.id }}</v-card-title>
    <v-card-subtitle>{{ subject.name }}</v-card-subtitle>
    <v-card-text>teacher id: {{ subject.teacherId }}</v-card-text>
    <v-card-item>Grades students: {{ subject.gradesStudents}}</v-card-item>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('edit', subject)">Edit</v-btn>
      <v-btn color="error" @click="deleteSubject">Delete</v-btn>
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