<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { ShiftService } from '@/service/shift/ShiftService';
import { PlaceService } from '@/service/place/PlaceService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const toast = useToast();
const shifts = ref([]);
const deleteShiftDialog = ref(false);
const shift = ref({});
const selectedShifts = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);

const form = reactive({
    id: null,
    name: '',
    clock_in: null,
    clock_out: null,
    id_place: null
});
const dropdownItems = ref([]);
const shiftService = new ShiftService();
const placeService = new PlaceService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await shiftService.getShift();
        shifts.value = data.data;
        toast.add({ severity: 'success', summary: 'Success Get Data', detail: data.message, life: 3000 });
        const dataPlace = await placeService.getPlace();
        dropdownItems.value = dataPlace.data.map((place) => ({
            label: place.name,
            value: place.id
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeleteShift = (editShift) => {
    shift.value = editShift;
    deleteShiftDialog.value = true;
};

const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    form.id = null;
    form.name = '';
    form.clock_in = null;
    form.clock_out = null;
    form.id_place = null;
    addModal.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = (shift) => {
    // Get the current date
    const currentDate = new Date();

    // Extract current year, month, and day
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    isEditing.value = true;
    form.id = shift.id;
    form.name = shift.name;
    form.clock_in = new Date(`${currentYear}-${currentMonth}-${currentDay}T${shift.clock_in}`);
    form.clock_out = new Date(`${currentYear}-${currentMonth}-${currentDay}T${shift.clock_out}`);

    form.id_place = shift.id_place;
    addModal.value = true;
};

const handleSubmit = async () => {
    try {
        const payload = {
            name: form.name,
            clock_in: formatTime(form.clock_in),
            clock_out: formatTime(form.clock_out),
            id_place: form.id_place.value
        };

        if (isEditing.value) {
            payload.id = form.id;
            await shiftService.updateShift(payload); // Assume updateShift is defined in your shiftService
            toast.add({ severity: 'success', summary: 'Success', detail: 'Shift updated successfully', life: 3000 });
        } else {
            await shiftService.createShift(payload); // Assume createShift is defined in your shiftService
            toast.add({ severity: 'success', summary: 'Success', detail: 'Shift added successfully', life: 3000 });
        }
        addModal.value = false;
        // Clear form after submission
        form.id = null;
        form.name = '';
        form.clock_in = null;
        form.clock_out = null;
        form.id_place = null;
        const data = await shiftService.getShift();
        shifts.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const deleteShift = async () => {
    loading.value = true;
    try {
        await shiftService.deleteShift(shift.value.id);
        shifts.value = shifts.value.filter((val) => val.id !== shift.value.id);
        deleteShiftDialog.value = false;
        shift.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Shift Deleted', life: 3000 });
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
                    :value="shifts"
                    v-model:selection="selectedShifts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} shifts"
                >
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Tempat</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="clock_in" header="Jam Masuk" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Jam Masuk</span>
                            {{ slotProps.data.clock_in }}
                        </template>
                    </Column>
                    <Column field="clock_out" header="Jam Keluar" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Jam Keluar</span>
                            {{ slotProps.data.clock_out }}
                        </template>
                    </Column>
                    <Column field="placename" header="Tempat" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tempat</span>
                            {{ slotProps.data.place.name }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="openEditModal(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteShift(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteShiftDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="shift"
                            >Are you sure you want to delete <b>{{ shift.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteShiftDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteShift" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" modal :header="isEditing ? 'Edit Shift' : 'Add Shift'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <form @submit.prevent="handleSubmit">
                        <div class="formgrid grid p-fluid">
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="formname">Nama Shift</label>
                                    <InputText id="formname" v-model="form.name" />
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="clock_in">Jam Masuk</label>
                                    <Calendar id="clock_in" v-model="form.clock_in" timeOnly />
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="clock_out">Jam Keluar</label>
                                    <Calendar id="clock_out" v-model="form.clock_out" timeOnly />
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="field">
                                    <label for="id_place">Tempat Kerja</label>
                                    <Dropdown id="id_place" v-model="form.id_place" :options="dropdownItems" optionLabel="label" placeholder="Select One"></Dropdown>
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
