<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { ScheduleService } from '@/service/schedule/ScheduleService';
import { PlaceService } from '@/service/place/PlaceService';
import { ShiftService } from '@/service/shift/ShiftService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const toast = useToast();
const schedules = ref([]);
const deleteScheduleDialog = ref(false);
const schedule = ref({});
const selectedSchedules = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);

const form = reactive({
    id: null,
    tanggal_dari: null,
    tanggal_sampai: null,
    id_shift: null,
    id_user: null,
    id_place: null
});
const dropdownItemsUser = ref([]);
const dropdownItemsPlace = ref([]);
const dropdownItemsShift = ref([]);
const scheduleService = new ScheduleService();
const placeService = new PlaceService();
const shiftService = new ShiftService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await scheduleService.getSchedule();
        schedules.value = data.data;
        toast.add({ severity: 'success', summary: 'Success Get Data', detail: data.message, life: 3000 });
        const dataPlace = await placeService.getPlace();
        dropdownItemsPlace.value = dataPlace.data.map((place) => ({
            label: place.name,
            value: place.id
        }));

        const dataShift = await shiftService.getShift();
        dropdownItemsShift.value = dataShift.data.map((shift) => ({
            label: shift.name,
            value: shift.id
        }));

        const dataUser = await scheduleService.getUsers();
        dropdownItemsUser.value = dataUser.data.map((user) => ({
            label: user.name,
            value: user.id
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeleteSchedule = (editSchedule) => {
    schedule.value = editSchedule;
    deleteScheduleDialog.value = true;
};

// const formatTime = (date) => {
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
//     return `${hours}:${minutes}:${seconds}`;
// };

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    form.id = null;
    form.tanggal_dari = null;
    form.tanggal_sampai = null;
    form.id_shift = null;
    form.id_user = null;
    form.id_place = null;
    addModal.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = (schedule) => {
    isEditing.value = true;

    // Get the current date
    const currentDateDari = new Date(schedule.tanggal_dari);

    // Extract current year, month, and day
    const currentYearDari = currentDateDari.getFullYear();
    const currentMonthDari = String(currentDateDari.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const currentDayDari = String(currentDateDari.getDate()).padStart(2, '0');

    // Get the current date
    const currentDateSampai = new Date(schedule.tanggal_sampai);

    // Extract current year, month, and day
    const currentYearSampai = currentDateSampai.getFullYear();
    const currentMonthSampai = String(currentDateSampai.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const currentDaySampai = String(currentDateSampai.getDate()).padStart(2, '0');

    form.id = schedule.id;
    form.tanggal_dari = new Date(`${currentYearDari}-${currentMonthDari}-${currentDayDari}`);
    form.tanggal_sampai = new Date(`${currentYearSampai}-${currentMonthSampai}-${currentDaySampai}`);
    form.id_shift = schedule.id_shift;
    form.id_user = schedule.id_user;
    form.id_place = schedule.id_place;
    addModal.value = true;
};

const handleSubmit = async () => {
    console.log(new Intl.DateTimeFormat('en-CA').format(new Date(form.tanggal_dari)));
    try {
        const payload = {
            tanggal_dari: new Intl.DateTimeFormat('en-CA').format(new Date(form.tanggal_dari)),
            tanggal_sampai: new Intl.DateTimeFormat('en-CA').format(new Date(form.tanggal_sampai)),
            id_shift: form.id_shift.value,
            id_user: form.id_user.value,
            id_place: form.id_place.value
        };

        if (isEditing.value) {
            payload.id = form.id;
            await scheduleService.updateSchedule(payload); // Assume updateSchedule is defined in your scheduleService
            toast.add({ severity: 'success', summary: 'Success', detail: 'Schedule updated successfully', life: 3000 });
        } else {
            await scheduleService.createSchedule(payload); // Assume createSchedule is defined in your scheduleService
            toast.add({ severity: 'success', summary: 'Success', detail: 'Schedule added successfully', life: 3000 });
        }
        addModal.value = false;
        // Clear form after submission
        form.id = null;
        form.tanggal_dari = null;
        form.tanggal_sampai = null;
        form.id_shift = null;
        form.id_user = null;
        form.id_place = null;
        const data = await scheduleService.getSchedule();
        schedules.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const deleteSchedule = async () => {
    loading.value = true;
    try {
        await scheduleService.deleteSchedule(schedule.value.id);
        schedules.value = schedules.value.filter((val) => val.id !== schedule.value.id);
        deleteScheduleDialog.value = false;
        schedule.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Schedule Deleted', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openAddModal" />
                        </div>
                    </template>
                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="schedules"
                    v-model:selection="selectedSchedules"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} schedules"
                >
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Staff</span>
                            {{ slotProps.data.user.name }}
                        </template>
                    </Column>
                    <Column field="shift" header="Shift" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Shift</span>
                            {{ slotProps.data.shift.name }}
                        </template>
                    </Column>
                    <Column field="place" header="Tempat Kerja" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tempat Kerja</span>
                            {{ slotProps.data.place.name }}
                        </template>
                    </Column>
                    <Column field="tanggal" header="Tanggal" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tanggal</span>
                            {{ slotProps.data.tanggal }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="openEditModal(slotProps.data)" /> -->
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteSchedule(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteScheduleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="schedule"
                            >Are you sure you want to delete <b>{{ schedule.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteScheduleDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSchedule" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" modal :header="isEditing ? 'Edit Schedule' : 'Add Schedule'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <form @submit.prevent="handleSubmit">
                        <div class="formgrid grid p-fluid">
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="id_user">Pilih Staff</label>
                                    <Dropdown id="id_user" v-model="form.id_user" :options="dropdownItemsUser" optionLabel="label" placeholder="Select One"></Dropdown>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="id_place">Tempat Kerja</label>
                                    <Dropdown id="id_place" v-model="form.id_place" :options="dropdownItemsPlace" optionLabel="label" placeholder="Select One"></Dropdown>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="id_shift">Shift</label>
                                    <Dropdown id="id_shift" v-model="form.id_shift" :options="dropdownItemsShift" optionLabel="label" placeholder="Select One"></Dropdown>
                                </div>
                            </div>
                            <div class="col-12 md:col-3">
                                <div class="field">
                                    <label for="tanggal_dari">Tanggal Mulai</label>
                                    <Calendar id="tanggal_dari" v-model="form.tanggal_dari" />
                                </div>
                            </div>
                            <div class="col-12 md:col-3">
                                <div class="field">
                                    <label for="tanggal_sampai">Tanggal Selesai</label>
                                    <Calendar id="tanggal_sampai" v-model="form.tanggal_sampai" />
                                </div>
                            </div>
                            <div class="col-12 md:col-12">
                                <div class="field">
                                    <Button label="Submit" type="submit" />
                                </div>
                            </div>
                        </div>
                    </form>
                </Dialog>

                <div v-if="loading" class="loading-spinner">
                    <ProgressSpinner />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loading-spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
