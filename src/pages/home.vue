<script setup>
import { ref, onMounted } from 'vue';
import http from "@/http.js";
import StudentsItems from "@/components/StudentsGradesItems.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const headers = {
  'Authorization': localStorage.getItem('authToken')
}

const selectedSubjectName = ref(null);
const subject = ref(null);
const studentsData = ref([]);
const teachers = ref([]);
const selectedTeacher = ref(null);

const logout = async () => {
  try {
    await http.post('/api/logout', {
      token: localStorage.getItem('authToken')
    });

    localStorage.removeItem('authToken');
    localStorage.clear();

    router.push({ name: 'LoginPage' });
  } catch (error) {
    console.error(error);
  }
};

const getSubject = async () => {
  try {
    const response = await http.get('/api/subjects', {
      headers
    });

    const subjectsData = response.data;

    if (Array.isArray(subjectsData) && subjectsData.length > 0) {
      const processedSubjects = subjectsData.map(subject => ({
        id: subject.id,
        name: subject.name,
        teacherId: subject.teacherId,
      }));

      subject.value = processedSubjects;
      console.log(subject.value);
    } else {
      console.warn('No subjects data received.');
    }
  } catch (error) {
    console.log(error);
  }
};

const getTeachers = async () => {
  try {
    const response = await http.get('/api/teachers', {
      headers
    });

    const teachersData = response.data;

    if (Array.isArray(teachersData) && teachersData.length > 0) {
      const processedTeachers = teachersData.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
      }));

      teachers.value = processedTeachers;
      console.log(teachers.value);
    } else {
      console.warn('No teachers data received.');
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await getSubject();
  await getTeachers();
});

const onSubjectChange = (subjectName) => {
  studentsData.value = [];  // Clear students data when subject changes

  const selectedSubject = subject.value.find(s => s.name === subjectName);
  if (selectedSubject) {
    const teacher = teachers.value.find(t => t.id === selectedSubject.teacherId);
    selectedTeacher.value = teacher ? teacher : null;
  } else {
    selectedTeacher.value = null;
  }

  http.get(`/api/subjects/findStudents/${subjectName}`, {
    headers
  })
      .then(response => {
        const studentsResponseData = response.data;
        console.log(studentsResponseData);
        if (Array.isArray(studentsResponseData) && studentsResponseData.length > 0) {
          const processedStudentsData = studentsResponseData.map(studentGrades => ({
            id: studentGrades.student.id,
            name: studentGrades.student.name,
            email: studentGrades.student.email,
            grades: studentGrades.grades
          }));
          studentsData.value = processedStudentsData;
        } else {
          studentsData.value = [];  // Ensure studentsData is cleared if no students are found
        }
      })
      .catch(error => {
        console.error(error);
        studentsData.value = [];  // Ensure studentsData is cleared in case of an error
      });
};

const selectedSubjectId = () => {
  const subjectItem = subject.value.find(s => s.name === selectedSubjectName.value);
  return subjectItem ? subjectItem.id : null;
};

const admin = () => {
  router.push({ name: 'Admin' });
};
</script>

<template>
  <v-app>
    <v-container>
      <v-toolbar :elevation="8" title="Online Diary">
        <v-btn variant="plain" @click="getSubject">View Data</v-btn>
        <v-btn variant="plain" @click="admin">Admin page</v-btn>
        <v-btn variant="plain" @click="logout">Logout</v-btn>
      </v-toolbar>
    </v-container>
    <v-container>
      <v-select
          v-if="subject && subject.length > 0"
          :items="subject.map(s => s.name)"
          item-text="name"
          item-value="id"
          variant="outlined"
          v-model="selectedSubjectName"
          @update:modelValue="onSubjectChange"
      ></v-select>
      <div v-if="selectedTeacher">
        <p>Учитель: {{ selectedTeacher.name }}</p>
        <p>Email: {{ selectedTeacher.email }}</p>
      </div>
      <StudentsItems v-if="studentsData.length > 0 && selectedSubjectName" :studentGrades="studentsData" :subjectId="selectedSubjectId()" />
    </v-container>
  </v-app>
</template>

<style scoped>
.v-toolbar {
  padding-right: 5px;
}
</style>
