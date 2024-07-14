<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { KasbonService } from '@/service/kasbon/KasbonService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const toast = useToast();
const kasbons = ref([]);
const deleteKasbonDialog = ref(false);
const kasbon = ref({});
const selectedKasbons = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);

const form = reactive({
    id: null,
    id_user: null,
    name: null,
    tanggal: '',
    cash_out: null,
    keterangan: null,
    status: null,
    approve: 1,
    reject: 2
});
const kasbonService = new KasbonService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await kasbonService.getKasbon();
        kasbons.value = data.data;
        console.log(data.data);
        toast.add({ severity: 'success', summary: 'Success Get Data', detail: data.message, life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeleteKasbon = (editKasbon) => {
    kasbon.value = editKasbon;
    deleteKasbonDialog.value = true;
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
    form.cash_out = null;
    form.tanggal = '';
    form.keterangan = null;
    addModal.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = (kasbon) => {
    isEditing.value = true;
    form.id = kasbon.id;
    form.name = kasbon.user.name;
    form.id_user = kasbon.id_user;
    form.cash_out = kasbon.cash_out;
    form.tanggal = formatTime(kasbon.tanggal);
    form.keterangan = kasbon.keterangan;
    addModal.value = true;
};
const handleApprove = async () => {
    try {
        const payload = {
            id: form.id
        };
        await kasbonService.updateKasbonApprove(payload);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Kasbon Approved', life: 3000 });
        const data = await kasbonService.getKasbon();
        kasbons.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleReject = async () => {
    try {
        const payload = {
            id: form.id
        };
        await kasbonService.updateKasbonReject(payload);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Kasbon Rejected', life: 3000 });
        const data = await kasbonService.getKasbon();
        kasbons.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
// const handleSubmit = async () => {
//     try {
//         const payload = {
//             id_user: form.id_user,
//             tanggal_kasbon: formatTime(form.tanggal_kasbon),
//             tanggal_kasbon_selesai: formatTime(form.tanggal_kasbon_selesai),
//             keperluan: form.keperluan,
//             kelengkapan: form.kelengkapan
//         };
//         if (isEditing.value) {
//             payload.id = form.id;
//             await kasbonService.updateKasbon(payload); // Assume updateKasbon is defined in your kasbonService
//             toast.add({ severity: 'success', summary: 'Success', detail: 'Kasbon updated successfully', life: 3000 });
//         } else {
//             await kasbonService.createKasbon(payload); // Assume createKasbon is defined in your kasbonService
//             toast.add({ severity: 'success', summary: 'Success', detail: 'Kasbon added successfully', life: 3000 });
//         }
//         addModal.value = false;
//         form.id = null;
//         form.id_user = null;
//         form.tanggal_kasbon = '';
//         form.tanggal_kasbon_selesai = null;
//         form.keperluan = null;
//         form.kelengkapan = null;
//         const data = await kasbonService.getKasbon();
//         kasbons.value = data.data;
//     } catch (error) {
//         toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
//     }
// };

const deleteKasbon = async () => {
    loading.value = true;
    try {
        await kasbonService.deleteKasbon(kasbon.value.id);
        kasbons.value = kasbons.value.filter((val) => val.id !== kasbon.value.id);
        deleteKasbonDialog.value = false;
        kasbon.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Kasbon Deleted', life: 3000 });
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
                    :value="kasbons"
                    v-model:selection="selectedKasbons"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} kasbons"
                >
                    <Column field="name" header="Name" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Staff</span>
                            {{ slotProps.data.user.name }}
                        </template>
                    </Column>
                    <Column field="tanggal" header="Tanggal Pengajuan" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tanggal Pengajuan</span>
                            {{ slotProps.data.tanggal }}
                        </template>
                    </Column>
                    <Column field="cash_out" header="Nominal" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Nominal</span>
                            <span>Rp. {{ slotProps.data.cash_out.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}</span>
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
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteKasbon(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteKasbonDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="kasbon"
                            >Are you sure you want to delete <b>{{ kasbon.user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteKasbonDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteKasbon" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" modal :header="isEditing ? 'Edit Kasbon' : 'Add Kasbon'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="formname">Nama Staff</label>
                                <InputText id="formname" disabled v-model="form.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="tanggal">Tanggal Kasbon</label>
                                <Calendar id="tanggal" disabled v-model="form.tanggal" />
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="cash_out">Nominal</label>
                                <InputText id="cash_out" disabled v-model="form.cash_out" />
                            </div>
                        </div>
                        <div class="col-12 md:col-12">
                            <div class="field">
                                <label for="keterangan">Keterangan</label>
                                <Textarea disabled v-model="form.keterangan" autoResize rows="5" cols="30" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <Button @click.prevent="handleApprove" severity="success" label="Approve" type="submit" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <Button @click.prevent="handleReject" severity="danger" label="Reject" type="submit" />
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
