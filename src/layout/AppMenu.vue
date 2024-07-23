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
                label: 'Workplan Core',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Organization',
                        icon: 'pi pi-map-marker',
                        to: '/app/master/organization',
                        // permission: 'manage_organization' // Add permission key
                        permission: 'manage_jadwal' // Add permission key
                    },
                    {
                        label: 'Function',
                        icon: 'pi pi-clock',
                        to: '/app/master/function',
                        // permission: 'manage_function' // Add permission key
                        permission: 'manage_jadwal' // Add permission key
                    },
                    {
                        label: 'Level Structure',
                        icon: 'pi pi-calendar',
                        to: '/app/master/levelStructure',
                        permission: 'manage_jadwal' // Add permission key
                    },
                    {
                        label: 'Structure (On Maintenance)',
                        icon: 'pi pi-calendar',
                        to: '/app/master/structure',
                        permission: 'manage_jadwal' // Add permission key
                    },
                    {
                        label: 'General',
                        icon: 'pi pi-user',
                        to: '/app/master/general',
                        permission: 'manage_user_management' // Add permission key
                    },
                    {
                        label: 'Holidays',
                        icon: 'pi pi-map-marker',
                        to: '/app/master/holidays',
                        permission: 'manage_user_management' // Add permission key
                    },
                    {
                        label: 'Employee Type',
                        icon: 'pi pi-user-edit',
                        to: '/app/master/employee-types',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Package Type',
                        icon: 'pi pi-bell',
                        to: '/app/master/package-types',
                        permission: 'manage_user_management' // Add permission key
                    },
                    {
                        label: 'Menu Mapping',
                        icon: 'pi pi-lock',
                        to: '/app/master/menu-mapping',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Gender',
                        icon: 'pi pi-lock',
                        to: '/app/master/gender',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Married Status',
                        icon: 'pi pi-lock',
                        to: '/app/master/married-status',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Religion',
                        icon: 'pi pi-lock',
                        to: '/app/master/religion',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Citizen',
                        icon: 'pi pi-lock',
                        to: '/app/master/citizen',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Company Registration',
                        icon: 'pi pi-lock',
                        to: '/app/permission',
                        permission: 'manage_role_management' // Add permission key
                    }
                ]
            },
            {
                label: 'Management',
                icon: 'pi pi-fw pi-bookmark',
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
                    },
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
                        label: 'Kirim Pesan',
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
            },
            {
                label: 'Task',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Jenis Aktifitas',
                        icon: 'pi pi-map-marker',
                        to: '/app/task/jenis-aktifitas',
                        permission: 'manage_tempat_kerja' // Add permission key
                    },
                    {
                        label: 'Kategori Produk',
                        icon: 'pi pi-clock',
                        to: '/app/master/shift',
                        permission: 'manage_shift' // Add permission key
                    },
                    {
                        label: 'Jenis Produk',
                        icon: 'pi pi-calendar',
                        to: '/app/master/schedule',
                        permission: 'manage_jadwal' // Add permission key
                    },
                    {
                        label: 'Jenis Usaha',
                        icon: 'pi pi-calendar',
                        to: '/app/master/todolist',
                        permission: 'todo_list' // Add permission key
                    },
                    {
                        label: 'Progress Status',
                        icon: 'pi pi-user',
                        to: '/app/master/user',
                        permission: 'manage_user_management' // Add permission key
                    },
                    {
                        label: 'Jenis Dokumen',
                        icon: 'pi pi-map-marker',
                        to: '/app/master/user/area',
                        permission: 'manage_user_management' // Add permission key
                    },
                    {
                        label: 'Mapping Jenis Akt - Kategpri Prd - Jns Prd - Dok',
                        icon: 'pi pi-user-edit',
                        to: '/app/role',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Tujuan Kunjungan',
                        icon: 'pi pi-bell',
                        to: '/app/master/notification',
                        permission: 'manage_user_management' // Add permission key
                    },
                    {
                        label: 'Hasil Kunjungan',
                        icon: 'pi pi-lock',
                        to: '/app/permission',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Alasan Tolak',
                        icon: 'pi pi-lock',
                        to: '/app/permission',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'Nama UDF',
                        icon: 'pi pi-lock',
                        to: '/app/permission',
                        permission: 'manage_role_management' // Add permission key
                    },
                    {
                        label: 'UDF DDL',
                        icon: 'pi pi-lock',
                        to: '/app/permission',
                        permission: 'manage_role_management' // Add permission key
                    }
                ]
            }
        ]
    },
    // {
    //     label: 'Management',
    //     items: [
    //         {
    //             label: 'Izin',
    //             icon: 'pi pi-exclamation-triangle',
    //             to: '/app/izin',
    //             badge: 'NEW',
    //             permission: 'manage_izin' // Add permission key
    //         },
    //         {
    //             label: 'Absensi',
    //             icon: 'pi pi-th-large',
    //             to: '/app/absensi',
    //             permission: 'manage_absensi' // Add permission key
    //         }
    //         // {
    //         //     label: 'Change Schedule Request (Maintenance)',
    //         //     icon: 'pi pi-cog',
    //         //     to: '/app/page/maintenance',
    //         //     permission: 'manage_page_settings' // Add permission key
    //         // }
    //         // {
    //         //     label: 'Lembur',
    //         //     icon: 'pi pi-bolt',
    //         //     url: 'https://www.primefaces.org/primeblocks-vue',
    //         //     target: '_blank',
    //         //     permission: 'manage_lembur' // Add permission key
    //         // }
    //     ]
    // },
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
    // {
    //     label: 'Payroll',
    //     items: [
    //         {
    //             label: 'List Payment',
    //             icon: 'pi pi-file',
    //             to: '/app/payment',
    //             permission: 'manage_payroll' // Add permission key
    //         },
    //         {
    //             label: 'Payroll',
    //             icon: 'pi pi-money-bill',
    //             to: '/app/payroll',
    //             permission: 'manage_payroll' // Add permission key
    //         },

    //         {
    //             label: 'Advance',
    //             icon: 'pi pi-calculator',
    //             to: '/app/advance',
    //             permission: 'manage_advance' // Add permission key
    //         }
    //     ]
    // },
    {
        label: 'Pages',
        icon: 'pi pi-briefcase',
        to: '/pages',
        items: []
    }
]);
const filterMenuItems = (item) => {
    if (item.items) {
        return {
            ...item,
            items: item.items.map((subItem) => filterMenuItems(subItem)).filter((subItem) => !subItem.permission || hasPermission(subItem.permission))
        };
    }
    return item;
};

const filteredModel = ref(model.value.map(filterMenuItems).filter((item) => item.items.length > 0 || !item.items));
</script>

<template v-focustrap :autofocus="false">
    <ul :autofocus="false" class="layout-menu">
        <template :autofocus="false" v-for="(item, i) in filteredModel" :key="i">
            <app-menu-item :autofocus="false" v-if="!item.separator && (item.items.length || !item.items)" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
