<script setup>
import { ref } from 'vue';
import { hasPermission } from '@/service/authService';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                to: '/app/dashboard',
                permission: 'view_dashboard' // Add permission key
            }
        ]
    },
    {
        label: 'Master Menu',
        items: [
            {
                label: 'Tempat Kerja',
                icon: 'pi pi-map-marker',
                to: '/app/master/place',
                permission: 'manage_tempat_kerja' // Add permission key
            },
            {
                label: 'Shift',
                icon: 'pi pi-clock',
                to: '/app/master/shift',
                permission: 'manage_shift' // Add permission key
            },
            {
                label: 'Jadwal',
                icon: 'pi pi-calendar',
                to: '/app/master/schedule',
                permission: 'manage_jadwal' // Add permission key
            },
            {
                label: 'Todo List',
                icon: 'pi pi-calendar',
                to: '/app/master/todolist',
                permission: 'todo_list' // Add permission key
            }
        ]
    },
    {
        label: 'Management',
        items: [
            {
                label: 'Izin',
                icon: 'pi pi-exclamation-triangle',
                to: '/app/izin',
                badge: 'NEW',
                permission: 'manage_izin' // Add permission key
            },
            {
                label: 'Absensi',
                icon: 'pi pi-th-large',
                to: '/app/absensi',
                permission: 'manage_absensi' // Add permission key
            },
            {
                label: 'Change Schedule Request (Maintenance)',
                icon: 'pi pi-cog',
                to: '/app/page/maintenance',
                permission: 'manage_page_settings' // Add permission key
            }
            // {
            //     label: 'Lembur',
            //     icon: 'pi pi-bolt',
            //     url: 'https://www.primefaces.org/primeblocks-vue',
            //     target: '_blank',
            //     permission: 'manage_lembur' // Add permission key
            // }
        ]
    },
    {
        label: 'Report',
        items: [
            {
                label: 'KPI',
                icon: 'pi pi-chart-bar',
                to: '/app/kpi',
                permission: 'manage_kpi' // Add permission key
            },
            {
                label: 'Analytics Report',
                icon: 'pi pi-desktop',
                to: '/app/report',
                permission: 'view_report' // Add permission key
            }
        ]
    },
    {
        label: 'Payroll',
        items: [
            {
                label: 'List Payment',
                icon: 'pi pi-file',
                to: '/app/payment',
                permission: 'manage_payroll' // Add permission key
            },
            {
                label: 'Payroll',
                icon: 'pi pi-money-bill',
                to: '/app/payroll',
                permission: 'manage_payroll' // Add permission key
            },

            {
                label: 'Advance',
                icon: 'pi pi-calculator',
                to: '/app/advance',
                permission: 'manage_advance' // Add permission key
            }
        ]
    },
    {
        label: 'Pages',
        icon: 'pi pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'User Management',
                icon: 'pi pi-user',
                to: '/app/master/user',
                permission: 'manage_user_management' // Add permission key
            },
            {
                label: 'User Area Management',
                icon: 'pi pi-map-marker',
                to: '/app/master/user/area',
                permission: 'manage_user_management' // Add permission key
            },
            {
                label: 'Role Management',
                icon: 'pi pi-user-edit',
                to: '/app/role',
                permission: 'manage_role_management' // Add permission key
            },
            {
                label: 'Notification',
                icon: 'pi pi-bell',
                to: '/app/master/notification',
                permission: 'manage_user_management' // Add permission key
            },
            {
                label: 'Permission Management',
                icon: 'pi pi-lock',
                to: '/app/permission',
                permission: 'manage_role_management' // Add permission key
            }
        ]
    }
]);
const filterMenuItems = (item) => {
    return {
        ...item,
        items: item.items.filter((subItem) => hasPermission(subItem.permission))
    };
};
</script>

<template v-focustrap :autofocus="false">
    <ul :autofocus="false" class="layout-menu">
        <template :autofocus="false" v-for="(item, i) in model" :key="i">
            <app-menu-item :autofocus="false" v-if="!item.separator && item.items.some((subItem) => hasPermission(subItem.permission))" :item="filterMenuItems(item)" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
