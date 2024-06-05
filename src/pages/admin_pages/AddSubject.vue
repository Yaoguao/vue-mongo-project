<script setup>
import { ref, reactive } from 'vue';
import http from "@/http.js";
import router from "@/plugins/router.js";

const name = ref('');
const teacherId = ref('');
const gradesStudents = ref([]);
const editingStudent = reactive({ id: '', grades: [] });

const headers = {
  'Authorization': localStorage.getItem('authToken')
}

const addSubject = async () => {
  try {
    const gradesStudentsObject = gradesStudents.value.reduce((obj, student) => {
      obj[student.id] = student.grades.split(',').map(Number);
      return obj;
    }, {});

    const response = await http.post('/api/subjects', {
      name: name.value,
      teacherId: teacherId.value,
      gradesStudents: gradesStudentsObject
    }, {
      headers
    });
    console.log(gradesStudentsObject)
    if (response.status === 200) {
      console.log('Subject created:', response.data);
      await router.push({name: 'Admin'})
    }
  } catch (error) {
    console.error(error)
  }
};

const addStudent = () => {
  gradesStudents.value.push({ id: '', grades: [] });
};

const saveAllStudents = () => {
  gradesStudents.value.forEach((student, index) => {
    gradesStudents.value[index].id = student.id;
    gradesStudents.value[index].grades = student.grades;
  });
};

const removeStudent = (index) => {
  gradesStudents.value.splice(index, 1);
};
</script>

<template>
  <v-app>
    <v-container>
      <v-text-field v-model="name" label="Name" single-line clearable></v-text-field>
      <v-text-field v-model="teacherId" label="Teacher ID" single-line clearable></v-text-field>
    </v-container>
    <v-container v-for="(student, index) in gradesStudents" :key="index">
      <v-text-field v-model="student.id" label="Student ID" single-line clearable></v-text-field>
      <v-text-field v-model="student.grades" label="Grades" single-line clearable></v-text-field>
      <v-btn color="error" @click="removeStudent(index)">Remove Student</v-btn>
    </v-container>
    <v-container>
      <v-btn color="primary" @click="addStudent">+</v-btn>
      <v-btn color="primary" @click="saveAllStudents">Save All</v-btn>
    </v-container>
    <v-btn color="primary" @click="addSubject()">Create subject</v-btn>
  </v-app>
</template>

<style scoped>

</style>