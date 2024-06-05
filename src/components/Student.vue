<script setup>

// Props
import http from "@/http.js";
import router from "@/plugins/router.js";

const props = defineProps({
  student: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      email: ''
    })
  }
});

// Methods
// const editStudent = (student) => {
//   router.push({ name: 'EditStudent', params: { studentId: student.id, student: student } });
// };

const deleteStudent = async () => {
  const headers = {
    'Authorization': localStorage.getItem('authToken')
  }
  const response = await http.delete(`/api/students/${props.student.id}`, {
    headers
  });
  router.go();
  console.log('Delete student:', props.student);
};
</script>

<template>
  <v-card class="student" outlined>
    <v-card-title>ID: {{ student.id }}</v-card-title>
    <v-card-subtitle>{{ student.name }}</v-card-subtitle>
    <v-card-text>Email: {{ student.email }}</v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('edit', student)">Edit</v-btn>
      <v-btn color="error" @click="deleteStudent">Delete</v-btn>
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