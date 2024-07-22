<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { AbsenService } from '@/service/absen/AbsenService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const toast = useToast();
const absens = ref([]);
const deleteAbsenDialog = ref(false);
const absen = ref({});
const selectedAbsens = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const absenService = new AbsenService();
const bUrl = 'https://workplan-web.test';

const formatDate = (date) => {
    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    return `${currentYear}-${currentMonth}-${currentDay}`;
};
const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const formAbsen = reactive({
    id: null,
    name: null,
    id_user: null,
    id_place: null,
    clock_in: null,
    clock_out: null,
    total_hour: '',
    tanggal: null,
    terlambat: null,
    izin: null,
    lembur: null,
    keterangan: null,
    keterangan_keluar: null,
    pict: null,
    pict_keluar: null,
    attachment: []
});
const formAbsenAttachment = ref([]);
// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    formAbsen.id_user = null;
    formAbsen.id_place = null;
    formAbsen.clock_in = null;
    formAbsen.clock_out = null;
    formAbsen.total_hour = '';
    formAbsen.tanggal = null;
    formAbsen.tanggal_keluar = null;
    formAbsen.terlambat = null;
    formAbsen.izin = null;
    formAbsen.lembur = null;
    formAbsen.keterangan = null;
    formAbsen.keterangan_keluar = null;
    formAbsen.pict = null;
    formAbsen.pict_keluar = null;
    formAbsen.attachment = [];

    addModal.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = (absen) => {
    isEditing.value = true;
    formAbsen.id = absen.id;
    formAbsen.name = absen.user.name;
    formAbsen.id_user = absen.id_user;
    formAbsen.id_place = absen.id_place;
    formAbsen.clock_in = absen.clock_in;
    formAbsen.clock_out = absen.clock_out;
    formAbsen.total_hour = absen.total_hour;
    formAbsen.tanggal = absen.tanggal;
    formAbsen.tanggal_keluar = absen.tanggal_keluar;
    formAbsen.terlambat = absen.terlambat;
    formAbsen.izin = absen.izin;
    formAbsen.lembur = absen.lembur;
    formAbsen.keterangan = absen.keterangan;
    formAbsen.keterangan_keluar = absen.keterangan_keluar;
    formAbsen.pict = absen.pict;
    formAbsen.pict_keluar = absen.pict_keluar;
    formAbsen.attachment = absen.absen_attachment;

    addModal.value = true;
};

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await absenService.getAbsen();
        absens.value = data.data;
        // console.log(data.data[0].absen_attachment[0]);
        toast.add({ severity: 'success', summary: 'Success Get Data', detail: data.message, life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeleteAbsen = (editAbsen) => {
    absen.value = editAbsen;
    deleteAbsenDialog.value = true;
};

const deleteAbsen = async () => {
    loading.value = true;
    try {
        await absenService.deleteAbsen(absen.value.id);
        absens.value = absens.value.filter((val) => val.id !== absen.value.id);
        deleteAbsenDialog.value = false;
        absen.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Absen Deleted', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
};

const exportCSV = () => {
    dt.value.exportPdf();
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
                            <!-- <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openAddModal" /> -->
                        </div>
                    </template>
                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="absens"
                    v-model:selection="selectedAbsens"
                    :dataKey="absens.id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing Absensi {first} to {last} of {totalRecords}"
                >
                    <Column field="user.name" header="Name" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Staff</span>
                            {{ slotProps.data.user.name }}
                        </template>
                    </Column>
                    <Column field="tanggal" header="Tanggal Absen" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tanggal Absen</span>
                            {{ slotProps.data.tanggal }}
                        </template>
                    </Column>
                    <Column field="clock_in" header="Jam Masuk" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Jam Masuk</span>
                            {{ slotProps.data.clock_in }}
                        </template>
                    </Column>
                    <Column field="clock_out" header="Jam Keluar" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Jam Keluar</span>
                            {{ slotProps.data.clock_out }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Badge
                                class="text-white"
                                :value="slotProps.data.izin == 1 ? 'Izin' : slotProps.data.lembur == 1 ? 'Lembur' : slotProps.data.terlambat == 1 ? 'Terlambat' : 'Tepat Waktu'"
                                :severity="slotProps.data.izin == 1 ? 'warning' : slotProps.data.lembur == 1 ? 'info' : slotProps.data.terlambat == 1 ? 'danger' : 'success'"
                            ></Badge>
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="mr-2" severity="info" rounded @click="openEditModal(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteAbsen(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteAbsenDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="absen"
                            >Are you sure you want to delete <b>{{ absen.user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteAbsenDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteAbsen" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" modal :header="isEditing ? 'Edit Absen' : 'Add Absen'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-6 md:col-6 flex justify-content-center">
                            <div class="field">
                                <Image :src="formAbsen.pict == NULL ? `/no_image.jpg` : bUrl + '/' + formAbsen.pict" alt="Image" width="250" preview />
                            </div>
                        </div>
                        <div class="col-6 md:col-6 flex justify-content-center">
                            <div class="field">
                                <Image :src="formAbsen.pict_keluar == NULL ? `/no_image.jpg` : bUrl + '/' + formAbsen.pict_keluar" alt="Image" width="250" preview />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="formname">Nama Staff</label>
                                <InputText id="formname" disabled v-model="formAbsen.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="formname">Status</label>
                                <InputText disabled id="formname" :modelValue="formAbsen.izin == 1 ? 'Izin' : formAbsen.lembur == 1 ? 'Lembur' : formAbsen.terlambat == 1 ? 'Terlambat' : 'Tepat Waktu'" v-model="formAbsen.status" />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="tanggal">Tanggal Masuk</label>
                                <Calendar disabled id="tanggal" v-model="formAbsen.tanggal" />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="tanggal">Tanggal Keluar</label>
                                <Calendar disabled id="tanggal" v-model="formAbsen.tanggal_keluar" />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="clock_in">Jam Masuk</label>
                                <Calendar disabled id="clock_in" v-model="formAbsen.clock_in" timeOnly />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="clock_out">Jam Keluar</label>
                                <Calendar disabled id="clock_out" v-model="formAbsen.clock_out" timeOnly />
                            </div>
                        </div>
                        <div class="col-6 md:col-6">
                            <div class="field">
                                <label for="keterangan">Keterangan Masuk</label>
                                <Textarea disabled v-model="formAbsen.keterangan" autoResize rows="5" cols="30" />
                            </div>
                        </div>
                        <div class="col-6 md:col-6">
                            <div class="field">
                                <label for="keterangan">Keterangan Keluar</label>
                                <Textarea disabled v-model="formAbsen.keterangan_keluar" autoResize rows="5" cols="30" />
                            </div>
                        </div>
                        <div class="col-12 md:col-12">
                            <div class="field">
                                <label for="keterangan">Attachment</label>
                            </div>
                        </div>
                        <div v-for="attachment in formAbsen.attachment" :key="attachment?.id" class="col-4 md:col-4">
                            <div class="field">
                                <Card style="width: 200px; overflow: hidden">
                                    <template #header>
                                        <Image width="200" alt="user header" :src="attachment?.pict == NULL ? `/no_image.jpg` : bUrl + '/' + attachment?.pict" preview />
                                    </template>
                                    <template #content>
                                        <p class="m-0">
                                            {{ attachment?.detail }}
                                        </p>
                                    </template>
                                </Card>
                                <!-- <label for="keterangan">{{ attachment?.detail }}</label> -->
                                <!-- <Image :src="attachment?.pict == NULL ? `/no_image.jpg` : bUrl + '/' + attachment?.pict" alt="Image" width="200" preview />
                                <p>{{ attachment?.detail }}</p> -->
                            </div>
                        </div>
                    </div>
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
