<script setup>
import {ref, watch} from 'vue';
import http from "@/http.js";
import router from "@/plugins/router.js";

const headers = {
  'Authorization': localStorage.getItem('authToken')
}

// Props
const props = defineProps({
  studentId: {
    type: String,
    required: true
  },
  student: {
    type: String,
    required: true
  }
});

const student = ref({
  id: '',
  name: '',
  email: ''
});

watch(() => props.student, (newStudent) => {
  student.value = JSON.parse(newStudent);
  console.log(student.value.id);
}, { immediate: true });

let valid = ref(false);
let rules = {
  required: value => !!value || 'Обязательное поле.',
  email: value => /.+@.+\..+/.test(value) || 'Недействительный e-mail.'
};

const updateStudent = async () => {
  const responce = await http.put(`/api/students/${student.value.id}`, {
    name: student.value.name,
    email: student.value.email
  },{
    headers
      });
  if (responce.status === 200) {
    router.push({name: 'Admin'});
  }
};
</script>

<template>
  <v-app>
    <v-form ref="form" @submit.prevent="updateStudent">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                label="Имя"
                v-model="student.name"

            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
                label="Email"
                v-model="student.email"

            ></v-text-field>
          </v-col>
        </v-row>

        <v-btn color="success" type="submit">
          Save
        </v-btn>
      </v-container>
    </v-form>
  </v-app>
</template>

<style scoped>

</style>