import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import login from "@/pages/login.vue";
import home from "@/pages/home.vue";
import EditStudentGrade from "@/pages/EditStudentGrade.vue";
import AdminPage from "@/pages/AdminPage.vue";
import AddStudent from "@/pages/admin_pages/AddStudent.vue";
import AddSubject from "@/pages/admin_pages/AddSubject.vue";
import AddTeacher from "@/pages/admin_pages/AddTeacher.vue";
import EditStudent from "@/pages/admin_pages/EditStudent.vue";
import EditTeacher from "@/pages/admin_pages/EditTeacher.vue";
import EditSubject from "@/pages/admin_pages/EditSubject.vue";

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: login,
    },
    {
        path: '/',
        name: 'HomePage',
        component: home,
        meta: { requiresAuth: true },
    },
    {
        path: '/edit-student/:studentId/:subjectId',
        name: 'EditStudentGrade',
        component: EditStudentGrade,
        props: true,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminPage,
    },
    {
        path: '/admin/add-student',
        name: 'AddStudent',
        component: AddStudent,
    },
    {
        path: '/admin/add-subject',
        name: 'AddSubject',
        component: AddSubject,
    },
    {
        path: '/admin/add-teacher',
        name: 'AddTeacher',
        component: AddTeacher,
    },
    {
        path: '/admin/edit-student/:studentId/:student',
        name: 'EditStudent',
        component: EditStudent,
        props: true,
    },
    {
        path: '/admin/edit-teacher/:teacherId/:teacher',
        name: 'EditTeacher',
        component: EditTeacher,
        props: true,
    },
    {
        path: '/admin/edit-subject/:subjectId/:subject',
        name: 'EditSubject',
        component: EditSubject,
        props: true,
    }

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('authToken')!== null;

    if (to.matched.some(record => record.meta.requiresAuth)) {

        if (!isAuthenticated) {

            next({ name: 'LoginPage' });
        } else {

            next();
        }
    } else {
        next();
    }
});

export default router;