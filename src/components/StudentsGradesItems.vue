<template>
  <v-card class="students-list">
    <v-list two-line>
      <v-list-item v-for="(student, index) in studentGrades" :key="index">
          <v-list-item-title><strong>{{ student.name }}</strong></v-list-item-title>
          <v-list-item-subtitle>Email: {{ student.email }}</v-list-item-subtitle>
        <v-list-item-action>
          <v-chip small color="primary" v-for="(grade, gradeIndex) in student.grades" :key="'grade-' + gradeIndex">
            {{ grade }}
          </v-chip>
        </v-list-item-action>
        <v-btn @click="editStudent(student.id)">Change</v-btn>
        <v-btn @click="svg(student.id, subjectId)">SVG</v-btn>
        <v-chip v-if="averageGrades[student.id] !== undefined">
          SVG: {{ averageGrades[student.id] }}
        </v-chip>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { ref } from 'vue';
import http from "@/http.js";

export default {
  props: {
    studentGrades: {
      type: Array,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    }
  },
  setup() {
    const averageGrades = ref({});

    const svg = async (studentId, subjectId) => {
      const headers = {
        'Authorization': localStorage.getItem('authToken')
      }
      const response = await http.get(`/api/aggregate/svg?subjectId=${subjectId}&studentId=${studentId}`, {
        headers
      })
      console.log(response.data);
      averageGrades.value[studentId] = response.data;
    }

    return { averageGrades, svg };
  },
  methods: {
    editStudent(studentId) {
      console.log(studentId + " " + this.subjectId );
      this.$router.push({ name: 'EditStudentGrade', params: { studentId: studentId, subjectId: this.subjectId } });
    }
  }
};
</script>

<style scoped>

.students-list {
  max-width: 800px;
  margin: auto;
}
</style>