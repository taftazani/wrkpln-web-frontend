<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, reactive, computed, onBeforeMount } from 'vue';
import { UserService } from '@/service/user/UserService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const users = ref([]);
const loading = ref(false);
const user = ref({});
const dt = ref(null);
const userFilter = ref('');
const monthFilter = ref(null);
const yearFilter = ref(null);

const dropdownItems = ref([]);
const userService = new UserService();

onBeforeMount(async () => {
    try {
        const data = await userService.getUser();
        users.value = data.data;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
        const dataRole = await userService.getRole();
        dropdownItems.value = dataRole.data.map((role) => ({
            label: role.name,
            value: role.id
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
});

onMounted(async () => {
    userStatus, filteredUsers, getTagSeverity;
});

// Custom directive for focus
const vFocus = {
    mounted(el) {
        el.focus();
    }
};

const formatDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

const clearFilters = () => {
    userFilter.value = '';
    monthFilter.value = null;
    yearFilter.value = null;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const userStatus = computed(() => {
    return users.value.map((user) => {
        const salaries = user.salaries;
        const partiallyTransferredDates = salaries.filter((salary) => salary.status == 1).map((salary) => salary.updated_at);

        const completelyTransferredDates = salaries.filter((salary) => salary.status == 1).map((salary) => salary.updated_at);

        const hasStatus1 = salaries.some((salary) => salary.status == 1);
        const allStatus1 = salaries.every((salary) => salary.status == 1);

        let salaryStatus = 'Not Yet Transferred';
        if (allStatus1) {
            salaryStatus = 'Completely Transferred';
        } else if (hasStatus1) {
            salaryStatus = 'Partially Transferred';
        }

        return {
            ...user,
            salaryStatus,
            partiallyTransferredDates,
            completelyTransferredDates
        };
    });
});

const filteredUsers = computed(() => {
    return userStatus.value.filter((user) => {
        const matchesUser = user.name.toLowerCase().includes(userFilter.value.toLowerCase());

        const matchesMonth = monthFilter.value
            ? user.partiallyTransferredDates.some((date) => new Date(date).getMonth() == new Date(monthFilter.value).getMonth()) || user.completelyTransferredDates.some((date) => new Date(date).getMonth() == new Date(monthFilter.value).getMonth())
            : true;

        const matchesYear = yearFilter.value
            ? user.partiallyTransferredDates.some((date) => new Date(date).getFullYear() == new Date(yearFilter.value).getFullYear()) ||
              user.completelyTransferredDates.some((date) => new Date(date).getFullYear() == new Date(yearFilter.value).getFullYear())
            : true;

        return matchesUser && matchesMonth && matchesYear;
    });
});

const getTagSeverity = (status) => {
    switch (status) {
        case 'Completely Transferred':
            return 'success';
        case 'Partially Transferred':
            return 'warning';
        case 'Not Yet Transferred':
            return 'danger';
        default:
            return null;
    }
};
</script>

<template v-focustrap :autofocus="false">
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template :autofocus="false" v-slot:start>
                        <div class="my-2">
                            <InputText :autofocus="true" class="mr-2" v-model="userFilter" placeholder="Filter by User" />
                            <Calendar :autofocus="false" class="mr-2" v-model="monthFilter" placeholder="Filter by Month" view="month" dateFormat="MM yy" />
                            <Calendar :autofocus="false" class="mr-2" v-model="yearFilter" placeholder="Filter by Year" view="year" dateFormat="yy" />
                            <Button :autofocus="false" label="Clear Filters" icon="pi pi-filter-slash" @click="clearFilters" />
                        </div>
                    </template>
                    <template :autofocus="false" v-slot:end>
                        <Button :autofocus="false" label="Export" icon="pi pi-upload" severity="help" @click="exportCSV" />
                    </template>
                </Toolbar>
                <DataTable :autofocus="false" ref="dt" tableStyle="min-width: 50rem" :value="filteredUsers" dataKey="id">
                    <Column field="name" header="Nama User">
                        <template :autofocus="false" #body="slotProps">
                            <span class="p-column-title">Nama User</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="salaryStatus" header="Status gajian">
                        <template :autofocus="false" #body="slotProps">
                            <span class="p-column-title">Status gajian</span>
                            <Tag v-focus :value="slotProps.data.salaryStatus" :severity="getTagSeverity(slotProps.data.salaryStatus)" />
                            <ul v-if="slotProps.data.salaryStatus == 'Partially Transferred'">
                                <li v-for="date in slotProps.data.partiallyTransferredDates" :key="date">Partially Transferred on: {{ formatDate(date) }}</li>
                            </ul>
                            <ul v-if="slotProps.data.salaryStatus == 'Completely Transferred'">
                                <li v-for="date in slotProps.data.completelyTransferredDates" :key="date">Completely Transferred on: {{ formatDate(date) }}</li>
                            </ul>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
