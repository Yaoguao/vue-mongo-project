<script setup>
import { ref, watch } from 'vue';
import http from "@/http.js";
import router from "@/plugins/router.js";

// Headers for authentication
const headers = {
  'Authorization': localStorage.getItem('authToken')
}

// Local state for inputs
const studentIdInput = ref('');
const gradeInput = ref('');

// Local state for the subject
const subject = ref({
  id: '',
  name: '',
  teacherId: '',
  gradesStudents: []
});

// Props
const props = defineProps({
  subjectId: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  }
});

// Watch for changes in the props.subject and parse it
watch(() => props.subject, (newSubject) => {
  subject.value = JSON.parse(newSubject);

  // Convert the gradesStudents object to an array of objects with grades as comma-separated strings
  if (subject.value.gradesStudents && typeof subject.value.gradesStudents === 'object') {
    subject.value.gradesStudents = Object.entries(subject.value.gradesStudents).map(([id, grades]) => ({
      id,
      grades: grades.join(',')
    }));
  } else {
    subject.value.gradesStudents = [];
  }
}, { immediate: true });

// Function to add a new student and grade
const addStudentAndGrade = () => {
  if (studentIdInput.value && gradeInput.value) {
    subject.value.gradesStudents.push({
      id: studentIdInput.value,
      grades: gradeInput.value
    });
    studentIdInput.value = '';
    gradeInput.value = '';
  }
}

// Function to remove a student by index
const removeStudent = (index) => {
  subject.value.gradesStudents.splice(index, 1);
}

// Function to update the subject
const updateSubject = async () => {
  try {
    // Convert the gradesStudents array back to an object for API submission
    const gradesStudentsObject = subject.value.gradesStudents.reduce((obj, student) => {
      obj[student.id] = student.grades.split(',').map(Number);
      return obj;
    }, {});

    console.log(subject.value)
    console.log(gradesStudentsObject)

    const response = await http.put(`/api/subjects/${subject.value.id}`, {
      name: subject.value.name,
      teacherId: subject.value.teacherId,
      gradesStudents: gradesStudentsObject
    }, { headers });

    if (response.status === 200) {
      await router.push({ name: 'Admin' });
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <v-app>
    <v-form ref="form" @submit.prevent="updateSubject">
      <v-container>
        <v-row>
          <v-text-field v-model="subject.name" label="Name" single-line clearable></v-text-field>
          <v-text-field v-model="subject.teacherId" label="Teacher ID" single-line clearable></v-text-field>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="studentIdInput" label="Student ID" single-line clearable></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="gradeInput" label="Grades (comma-separated)" single-line clearable></v-text-field>
          </v-col>
          <v-col class="d-flex align-center">
            <v-btn color="primary" @click="addStudentAndGrade">Add student and grades</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-for="(student, index) in subject.gradesStudents" :key="index">
              <span>{{ student.id }}:</span>
              <v-text-field v-model="student.grades" label="Grades (comma-separated)" single-line clearable></v-text-field>
              <v-btn small color="red" @click="removeStudent(index)">Remove student</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-btn color="primary" type="submit">Save</v-btn>
      </v-container>
    </v-form>
  </v-app>
</template>

<style scoped>
</style>

