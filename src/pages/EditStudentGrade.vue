<template>
    <v-container>
      <v-form ref="form">
        <v-text-field
            :value="student.name"
            readonly
        ></v-text-field>

        <v-text-field
            :value="student.email"
            readonly
        ></v-text-field>

        <v-textarea
            v-model="studentGrades"
            required
        ></v-textarea>

        <v-btn color="success" class="mr-4" @click="commitChanges">
          Commit
        </v-btn>

        <v-btn color="error" @click="cancelChanges">
          Cancel
        </v-btn>
      </v-form>
    </v-container>
</template>

<script>
import http from "@/http.js";
import router from "@/plugins/router.js";

export default {
  props: {
    studentId: {
      type: String,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      valid: true,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      editedStudent: {},
      student: null,
      studentGrades: null,
    };
  },
  async created() {
    const studentId = this.studentId;
    const subjectId = this.subjectId;
    console.log(studentId);
    console.log(subjectId);
    try {
      const headers = {
        'Authorization': localStorage.getItem('authToken')
      }
      const response = await http.get(`/api/students/${this.studentId}`, {
        headers
      });


      const studentData = response.data;

      if (studentData !== null) {
        this.student = {
          id: studentData.id,
          name: studentData.name,
          email: studentData.email
        }
        console.log(this.student);
      } else {
        console.warn('No student data received.');
      }

      const subjectResponse = await http.get(`/api/subjects/${this.subjectId}`, {
        headers
      });
      console.log(subjectResponse)
      const gradesData = subjectResponse.data;

      if (gradesData !== null && gradesData.gradesStudents !== undefined) {
        const studentGrades = gradesData.gradesStudents[this.studentId];
        if (studentGrades) {
          this.studentGrades = studentGrades;
          console.log(this.studentGrades);
        }
      } else {
        console.warn('No grades data received.');
      }

    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async commitChanges() {
      if (await this.$refs.form.validate()) {
        const headers = {
          'Authorization': localStorage.getItem('authToken')
        }
        const gradesArray = this.studentGrades.split(',').map(Number);
        console.log(this.subjectId + " " + " " + this.studentId)
        const dataToSend = {
          subjectId: this.subjectId,
          studentId: this.studentId,
          grades: gradesArray
        }
        console.log(dataToSend);

        await http.post(`/api/subjects/addGradesStudent`, dataToSend, {
          headers
        })
            .then(response => {
              console.log('Changes saved:', response.data);
              this.$router.push({name: 'HomePage'});
            })
            .catch(error => {
              console.error('Error updating grades:', error);
            });
      }
    },
    cancelChanges() {
      router.push({name: 'HomePage'});
    },
  },
};
</script>
