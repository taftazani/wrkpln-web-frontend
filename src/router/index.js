import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, hasPermission } from '@/service/authService';

import PublicLayout from '@/layout/PublicLayout.vue';
import PrivateLayout from '@/layout/PrivateLayout.vue';

// import HomePage from '@/views/HomePage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: PublicLayout,
            children: [{ path: '/', component: () => import('@/views/pages/auth/Login.vue') }],
            meta: { requiresGuest: true } // Only accessible by guests (not logged in)
        },
        {
            path: '/app',
            component: PrivateLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { permission: 'view_dashboard' }
                },
                {
                    path: 'master/place',
                    component: () => import('@/views/MasterPlace/View.vue'),
                    meta: { permission: 'manage_tempat_kerja' }
                },
                {
                    path: 'master/place/add',
                    component: () => import('@/views/MasterPlace/Add.vue'),
                    meta: { permission: 'manage_tempat_kerja' }
                },
                {
                    path: 'master/shift',
                    component: () => import('@/views/MasterShift/View.vue'),
                    meta: { permission: 'manage_shift' }
                },
                {
                    path: 'master/schedule',
                    component: () => import('@/views/MasterSchedule/View.vue'),
                    meta: { permission: 'manage_jadwal' }
                },
                {
                    path: 'master/todolist',
                    component: () => import('@/views/MasterToDoList/View.vue'),
                    meta: { permission: 'todo_list' }
                },
                {
                    path: 'izin',
                    component: () => import('@/views/Izin/View.vue'),
                    meta: { permission: 'manage_izin' }
                },
                {
                    path: 'absensi',
                    component: () => import('@/views/Absen/View.vue'),
                    meta: { permission: 'manage_absensi' }
                },
                {
                    path: 'advance',
                    component: () => import('@/views/Advance/View.vue'),
                    meta: { permission: 'manage_advance' }
                },
                {
                    path: 'payroll',
                    component: () => import('@/views/Payroll/View.vue'),
                    meta: { permission: 'manage_payroll' }
                },
                {
                    path: 'payment',
                    component: () => import('@/views/Payroll/ViewPayment.vue'),
                    meta: { permission: 'manage_payroll' }
                },
                {
                    path: 'kpi',
                    component: () => import('@/views/Kpi/View.vue'),
                    meta: { permission: 'manage_kpi' }
                },
                {
                    path: 'report',
                    component: () => import('@/views/Report/View.vue'),
                    meta: { permission: 'view_report' }
                },
                {
                    path: 'master/user',
                    component: () => import('@/views/User/View.vue'),
                    meta: { permission: 'manage_user_management' }
                },
                {
                    path: 'role',
                    component: () => import('@/views/User/ViewRole.vue')
                },
                {
                    path: 'master/user/area',
                    component: () => import('@/views/User/ViewArea.vue')
                },
                {
                    path: 'master/notification',
                    component: () => import('@/views/MasterNotification/View.vue')
                },
                {
                    path: 'permission',
                    component: () => import('@/views/User/ViewPermission.vue')
                },
                {
                    path: 'page/maintenance',
                    component: () => import('@/views/Maintenance.vue')
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isAuthenticatedUser = isAuthenticated();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isAuthenticatedUser) {
            next({ path: '/' });
        } else {
            const requiredPermission = to.meta.permission;
            if (requiredPermission && !hasPermission(requiredPermission)) {
                next({ path: '/app/dashboard' }); // Redirect to a safe page if permission is not granted
            } else {
                next();
            }
        }
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
        if (isAuthenticatedUser) {
            next({ path: '/app/dashboard' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
