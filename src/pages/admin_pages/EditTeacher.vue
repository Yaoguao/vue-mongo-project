<script setup>
import {ref, toRaw, watch} from 'vue';
import http from "@/http.js";
import router from "@/plugins/router.js";

const headers = {
  'Authorization': localStorage.getItem('authToken')
}
const subjectInput = ref('');

const teacher = ref({
  id: '',
  name: '',
  email: '',
  subjects: ['']
});

// Props
const props = defineProps({
  teacherId: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  }
});


watch(() => props.teacher, (newTeacher) => {
  teacher.value = JSON.parse(newTeacher);
  teacher.value.subjects = teacher.value.subjects || [];
  console.log(teacher.value.id);
}, {immediate: true});

const addSubject = () => {
  if (subjectInput.value) {
    teacher.value.subjects.push(subjectInput.value);
    subjectInput.value = '';
  }
}
const removeSubject = (index) => {
  teacher.value.subjects.splice(index, 1);
}


const updateTeacher =  async () => {
  try {

    const response = await http.put(`/api/teachers/${teacher.value.id}`,{
      name: teacher.value.name,
      email: teacher.value.email,
      subjectsId: toRaw(teacher.value.subjects)
    }, {
      headers
    });
    console.log(response.data)
    if (response.status === 200) {
      router.push({name: 'Admin'})
    }

  } catch (error) {
    console.log(error)
  }
  console.log(teacher.value.name)
  console.log(toRaw(teacher.value.subjects));
}

</script>

<template>
  <v-app>
    <v-form ref="form" @submit.prevent="updateTeacher">
      <v-container>
        <v-row>
          <v-text-field v-model="teacher.name" label="Name" single-line clearable></v-text-field>
          <v-text-field v-model="teacher.email" label="Email" single-line clearable></v-text-field>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="subjectInput" label="Subject" single-line clearable
                          @keyup.enter="addSubject"></v-text-field>
          </v-col>
          <v-col class="d-flex align-center">
            <v-btn color="primary" @click="addSubject">Add subject</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-for="(subject, index) in teacher.subjects" :key="index">
              {{ subject }}
              <v-btn small color="red" @click="removeSubject(index)">Remove</v-btn>
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
