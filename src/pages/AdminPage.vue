<script setup>
import { ref, onMounted, watch } from 'vue';
import http from "@/http.js";
import Student from '@/components/Student.vue';
import Teacher from "@/components/Teacher.vue";
import Subject from '@/components/Subject.vue';
import router from "@/plugins/router.js";

const headers = {
  'Authorization': localStorage.getItem('authToken')
}

const model = ref(1);

const students = ref([]);
const filteredStudents = ref([]);

const teachers = ref([]);
const filteredTeachers = ref([]);

const subjects = ref([]);
const filteredSubjects = ref([]);

onMounted(async () => {
  await fetchStudents();
  await fetchTeachers();
  await fetchSubjects();
});

// Methods
const selectTab = (tab) => {
  model.value = tab;
  if (tab === 1) {
    fetchStudents();
  } else if (tab === 2) {
    fetchTeachers();
  } else if (tab === 3) {
    fetchSubjects();
  }
};

const fetchStudents = async () => {
  const response = await http.get('/api/students', { headers });
  students.value = response.data;
  filteredStudents.value = students.value; // Initialize filteredStudents
};

const fetchTeachers = async () => {
  const response = await http.get('/api/teachers', { headers });
  teachers.value = response.data;
  filteredTeachers.value = teachers.value; // Initialize filteredTeachers
};

const fetchSubjects = async () => {
  const response = await http.get('/api/subjects', { headers });
  subjects.value = response.data;
  filteredSubjects.value = subjects.value; // Initialize filteredSubjects
};

const searchName = ref('');
const searchTeacherName = ref('');
const searchSubjectName = ref('');

watch(searchName, () => {
  searchStudents();
});

watch(searchTeacherName, () => {
  searchTeachers();
});

watch(searchSubjectName, () => {
  searchSubjects();
});

const searchStudents = () => {
  if (searchName.value) {
    filteredStudents.value = students.value.filter(student =>
        student.name.toLowerCase().includes(searchName.value.toLowerCase())
    );
  } else {
    filteredStudents.value = students.value;
  }
};

const searchTeachers = () => {
  if (searchTeacherName.value) {
    filteredTeachers.value = teachers.value.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTeacherName.value.toLowerCase())
    );
  } else {
    filteredTeachers.value = teachers.value;
  }
};

const searchSubjects = () => {
  if (searchSubjectName.value) {
    filteredSubjects.value = subjects.value.filter(subject =>
        subject.name.toLowerCase().includes(searchSubjectName.value.toLowerCase())
    );
  } else {
    filteredSubjects.value = subjects.value;
  }
};

const home = () => {
  router.push({ name: 'HomePage' });
}

const createStudent = () => {
  router.push({ name: 'AddStudent' });
}
const createTeacher = () => {
  router.push({ name: 'AddTeacher' });
}
const createSubject = () => {
  router.push({ name: 'AddSubject' });
}
const editStudent = (student) => {
  router.push({
    name: 'EditStudent',
    params: {
      studentId: student.id,
      student: JSON.stringify(student)
    }
  });
};

const editTeacher = (teacher) => {
  router.push({
    name: 'EditTeacher',
    params: {
      teacherId: teacher.id,
      teacher: JSON.stringify(teacher)
    }
  });
}

const editSubject = (subject) => {
  router.push({
    name: 'EditSubject',
    params: {
      subjectId: subject.id,
      subject: JSON.stringify(subject)
    }
  });
}
</script>

<template>
  <v-app>
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>ADMIN</v-toolbar-title>
        <v-btn @click="home()">home</v-btn>
        <v-spacer></v-spacer>

        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>

        <template v-slot:extension>
          <v-tabs
              v-model="model"
              align-tabs="center"
          >
            <v-tab
                v-for="i in 3"
                :key="i"
                :text="`Com ${i}`"
                :value="i"
                @click="selectTab(i)"
            ></v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-window v-model="model">
        <v-tabs-window-item
            v-for="i in 3"
            :key="i"
            :value="i"
        >
          <v-card>
            <v-card-text>
              <v-container v-if="i === 1">
                <v-text-field v-model="searchName" label="Имя студента" prepend-icon="mdi-magnify"></v-text-field>
                <v-btn @click="createStudent()">Add student</v-btn>
                <v-container>
                  <p>Найдено студентов: {{ filteredStudents.length }}</p>
                </v-container>
                <v-container v-if="filteredStudents.length === 0">
                  <p>No students found</p>
                </v-container>
                <Student
                    v-for="student in filteredStudents"
                    :key="student.id"
                    :student="student"
                    @edit="editStudent(student)"
                />
              </v-container>
              <v-container v-if="i === 2">
                <v-text-field v-model="searchTeacherName" label="Имя учителя" prepend-icon="mdi-magnify"></v-text-field>
                <v-btn @click="createTeacher()">Add teacher</v-btn>
                <v-container>
                  <p>Найдено учителей: {{ filteredTeachers.length }}</p>
                </v-container>
                <v-container v-if="filteredTeachers.length === 0">
                  <p>No teachers found</p>
                </v-container>
                <Teacher
                    v-for="teacher in filteredTeachers"
                    :key="teacher.id"
                    :teacher="teacher"
                    @edit="editTeacher(teacher)"
                />
              </v-container>
              <v-container v-if="i === 3">
                <v-text-field v-model="searchSubjectName" label="Название предмета" prepend-icon="mdi-magnify"></v-text-field>
                <v-btn @click="createSubject()">Add subject</v-btn>
                <v-container>
                  <p>Найдено предметов: {{ filteredSubjects.length }}</p>
                </v-container>
                <v-container v-if="filteredSubjects.length === 0">
                  <p>No subjects found</p>
                </v-container>
                <Subject
                    v-for="subject in filteredSubjects"
                    :key="subject.id"
                    :subject="subject"
                    @edit="editSubject(subject)"
                />
              </v-container>
              <div v-else>
                {{ `Item ${i} content` }}
              </div>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-app>
</template>

<style scoped>

</style>