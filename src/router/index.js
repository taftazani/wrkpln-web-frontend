import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, hasPermission, isOtpVerified } from '@/service/authService';
import Register from '@/views/pages/auth/Register.vue';
import Step1 from '@/views/pages/auth/steps/Step1.vue';
import Step2 from '@/views/pages/auth/steps/Step2.vue';
import Step3 from '@/views/pages/auth/steps/Step3.vue';
import Step4 from '@/views/pages/auth/steps/Step4.vue';

import PublicLayout from '@/layout/PublicLayout.vue';
import PrivateLayout from '@/layout/PrivateLayout.vue';

// import HomePage from '@/views/HomePage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: PublicLayout,
            children: [
                { path: '', component: () => import('@/views/pages/auth/Login.vue') },
                { path: 'register-company', component: () => import('@/views/pages/auth/Register.vue') }
            ],
            meta: { requiresGuest: true } // Only accessible by guests (not logged in)
        },
        {
            path: '/otp',
            component: PublicLayout,
            children: [{ path: '', component: () => import('@/views/pages/auth/Otp.vue') }],
            meta: { requiresAuth: true } // Only accessible after login but before OTP verification
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
    const isOtpVerifiedUser = isOtpVerified();

    // Check if the route requires authentication
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isAuthenticatedUser) {
            // If not authenticated, redirect to the login page
            return next({ path: '/' });
        } else if (!isOtpVerifiedUser && to.path !== '/otp') {
            // If authenticated but OTP not verified, redirect to the OTP page
            return next({ path: '/otp' });
        } else {
            const requiredPermission = to.meta.permission;
            if (requiredPermission && !hasPermission(requiredPermission)) {
                // If permission is required but not granted, redirect to a safe page
                return next({ path: '/app/dashboard' });
            } else {
                // If authenticated and permission is granted, proceed to the route
                return next();
            }
        }
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
        if (isAuthenticatedUser) {
            // If the user is authenticated, redirect to the dashboard
            return next({ path: '/app/dashboard' });
        } else {
            // If not authenticated, proceed to the guest route
            return next();
        }
    } else {
        // If no authentication or guest requirements, proceed to the route
        return next();
    }
});

export default router;
