<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { IzinService } from '@/service/izin/IzinService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const toast = useToast();
const izins = ref([]);
const deleteIzinDialog = ref(false);
const izin = ref({});
const selectedIzins = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const bUrl = 'https://backend.coffeelabs.id';

const form = reactive({
    id: null,
    id_user: null,
    name: null,
    tanggal_izin: '',
    tanggal_izin_selesai: null,
    kelengkapan: null,
    keperluan: null,
    status: null,
    approve: 1,
    reject: 2
});
const izinService = new IzinService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await izinService.getIzin();
        izins.value = data.data;
        console.log(data.data);
        toast.add({ severity: 'success', summary: 'Success Get Data', detail: data.message, life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeleteIzin = (editIzin) => {
    izin.value = editIzin;
    deleteIzinDialog.value = true;
};

const formatTime = (date) => {
    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    return `${currentYear}-${currentMonth}-${currentDay}`;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    form.id = null;
    form.id_user = null;
    form.tanggal_izin = '';
    form.tanggal_izin_selesai = null;
    form.keperluan = null;
    form.kelengkapan = null;
    addModal.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = (izin) => {
    isEditing.value = true;
    form.id = izin.id;
    form.name = izin.user.name;
    form.id_user = izin.id_user;
    form.tanggal_izin = formatTime(izin.tanggal_izin);
    form.tanggal_izin_selesai = formatTime(izin.tanggal_izin_selesai);
    form.keperluan = izin.keperluan;
    form.kelengkapan = izin.kelengkapan;
    addModal.value = true;
};
const handleApprove = async () => {
    try {
        const payload = {
            id: form.id
        };
        await izinService.updateIzinApprove(payload);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Izin Approved', life: 3000 });
        const data = await izinService.getIzin();
        izins.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleReject = async () => {
    try {
        const payload = {
            id: form.id
        };
        await izinService.updateIzinReject(payload);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Izin Rejected', life: 3000 });
        const data = await izinService.getIzin();
        izins.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleSubmit = async () => {
    try {
        const payload = {
            id_user: form.id_user,
            tanggal_izin: formatTime(form.tanggal_izin),
            tanggal_izin_selesai: formatTime(form.tanggal_izin_selesai),
            keperluan: form.keperluan,
            kelengkapan: form.kelengkapan
        };
        if (isEditing.value) {
            payload.id = form.id;
            await izinService.updateIzin(payload); // Assume updateIzin is defined in your izinService
            toast.add({ severity: 'success', summary: 'Success', detail: 'Izin updated successfully', life: 3000 });
        } else {
            await izinService.createIzin(payload); // Assume createIzin is defined in your izinService
            toast.add({ severity: 'success', summary: 'Success', detail: 'Izin added successfully', life: 3000 });
        }
        addModal.value = false;
        form.id = null;
        form.id_user = null;
        form.tanggal_izin = '';
        form.tanggal_izin_selesai = null;
        form.keperluan = null;
        form.kelengkapan = null;
        const data = await izinService.getIzin();
        izins.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const deleteIzin = async () => {
    loading.value = true;
    try {
        await izinService.deleteIzin(izin.value.id);
        izins.value = izins.value.filter((val) => val.id !== izin.value.id);
        deleteIzinDialog.value = false;
        izin.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Izin Deleted', life: 3000 });
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
                            <!-- <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openAddModal" /> -->
                        </div>
                    </template>
                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="izins"
                    v-model:selection="selectedIzins"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} izins"
                >
                    <Column field="name" header="Name" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Staff</span>
                            {{ slotProps.data.user.name }}
                        </template>
                    </Column>
                    <Column field="tanggal_izin" header="Tanggal Izin" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tanggal Izin</span>
                            {{ slotProps.data.tanggal_izin }}
                        </template>
                    </Column>
                    <Column field="tanggal_izin_selesai" header="Tanggal Selesai" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tanggal Selesai</span>
                            {{ slotProps.data.tanggal_izin_selesai }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>

                            <Badge
                                class="text-white"
                                :value="slotProps.data.status == 0 ? 'Menunggu Persetujuan' : slotProps.data.status == 1 ? 'Approved' : 'Rejected'"
                                :severity="slotProps.data.status == 0 ? 'warning' : slotProps.data.status == 1 ? 'success' : 'danger'"
                            ></Badge>
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="openEditModal(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteIzin(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteIzinDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="izin"
                            >Are you sure you want to delete <b>{{ izin.user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteIzinDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteIzin" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" modal :header="isEditing ? 'Edit Izin' : 'Add Izin'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-12 flex justify-content-center">
                            <div class="field">
                                <Image :src="bUrl + '/' + form.kelengkapan" alt="Image" width="250" preview />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="formname">Nama Staff</label>
                                <InputText id="formname" disabled v-model="form.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="tanggal_izin">Tanggal Izin</label>
                                <Calendar id="tanggal_izin" disabled v-model="form.tanggal_izin" timeOnly />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="tanggal_izin_selesai">Tanggal Selesai</label>
                                <Calendar id="tanggal_izin_selesai" disabled v-model="form.tanggal_izin_selesai" timeOnly />
                            </div>
                        </div>
                        <div class="col-12 md:col-12">
                            <div class="field">
                                <label for="id_place">Keterangan</label>
                                <Textarea disabled v-model="form.keperluan" autoResize rows="5" cols="30" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <Button :disabled="form.status == 0 ? false : form.status == 1 ? true : true" @click.prevent="handleApprove" severity="success" label="Approve" type="submit" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <Button :disabled="form.status == 0 ? false : form.status == 1 ? true : true" @click.prevent="handleReject" severity="danger" label="Reject" type="submit" />
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
