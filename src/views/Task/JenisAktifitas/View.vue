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
                        <div class="my-2">
                            <Button label="Export" icon="pi pi-upload" severity="help" @click="exportToExcel" />
                            <Button label="Bulk Upload" icon="pi pi-cloud-upload" severity="info" @click="showBulkUploadDialog = true" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="jenisAktifitas"
                    v-model:selection="selectedJenisAktifitas"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} jenis aktifitas"
                >
                    <Column field="kode_jenis_aktifitas" header="Kode Jenis Aktifitas" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Kode Jenis Aktifitas</span>
                            {{ slotProps.data.kode_jenis_aktifitas }}
                        </template>
                    </Column>
                    <Column field="nama_jenis_aktifitas" header="Nama Jenis Aktifitas" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Jenis Aktifitas</span>
                            {{ slotProps.data.nama_jenis_aktifitas }}
                        </template>
                    </Column>
                    <Column field="flag_tab_menu_personal" header="Flag Tab Menu Personal" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Flag Tab Menu Personal</span>
                            {{ slotProps.data.flag_tab_menu_personal }}
                        </template>
                    </Column>
                    <Column field="batas_waktu_kunjungan" header="Batas Waktu Kunjungan (Menit)" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Batas Waktu Kunjungan</span>
                            {{ slotProps.data.batas_waktu_kunjungan }}
                        </template>
                    </Column>
                    <Column field="batas_maksimal_umur_progress" header="Batas Maksimal Umur Progress (Hari)" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Batas Maksimal Umur Progress</span>
                            {{ slotProps.data.batas_maksimal_umur_progress }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Badge class="text-white" :value="slotProps.data.status == 1 ? 'Active' : 'Inactive'" :severity="getStatusSeverity(slotProps.data.status)"></Badge>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="openEditModal(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteJenisAktifitas(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteJenisAktifitasDialog" :breakpoints="{ '960px': '75vw' }" style="width: 30vw" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="jenisAktifitas"
                            >Are you sure you want to delete <b>{{ jenisAktifitas.nama_jenis_aktifitas }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteJenisAktifitasDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteJenisAktifitas" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" :modal="true" header="Add Jenis Aktifitas" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="kodeJenisAktifitas">Kode Jenis Aktifitas</label>
                                <InputText id="kodeJenisAktifitas" v-model="forms.kode_jenis_aktifitas" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="namaJenisAktifitas">Nama Jenis Aktifitas</label>
                                <InputText id="namaJenisAktifitas" v-model="forms.nama_jenis_aktifitas" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="flagTabMenuPersonal">Flag Tab Menu Personal</label>
                                <Dropdown id="flagTabMenuPersonal" v-model="forms.flag_tab_menu_personal" :options="flagTabMenuPersonalOptions" optionLabel="label" placeholder="Select Flag" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="batasWaktuKunjungan">Batas Waktu Kunjungan (Menit)</label>
                                <InputNumber id="batasWaktuKunjungan" v-model="forms.batas_waktu_kunjungan" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="batasMaksimalUmurProgress">Batas Maksimal Umur Progress (Hari)</label>
                                <InputNumber id="batasMaksimalUmurProgress" v-model="forms.batas_maksimal_umur_progress" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="status">Status</label>
                                <Dropdown
                                    id="status"
                                    v-model="forms.status"
                                    optionLabel="label"
                                    :placeholder="forms.status == 1 ? 'Active' : 'Inactive'"
                                    :options="[
                                        { label: 'Active', value: 1 },
                                        { label: 'Inactive', value: 0 }
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="col-12 md:col-12">
                            <div class="field">
                                <Button label="Submit" type="submit" @click.prevent="isEditing ? handleEditSubmit() : handleSubmit()" />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <!-- Add Bulk Upload Dialog -->
                <Dialog header="Bulk Upload Jenis Aktifitas" :visible.sync="showBulkUploadDialog" modal>
                    <template #footer>
                        <Button label="Upload" icon="pi pi-upload" @click="bulkUpload" />
                        <Button label="Close" icon="pi pi-times" class="p-button-secondary" @click="showBulkUploadDialog = false" />
                    </template>
                    <div>
                        <p>Anda dapat download template excel untuk bulk upload <a href="/path/to/template">disini</a></p>
                        <FileUpload name="file" v-model="bulkUploadFile" customUpload @upload="bulkUpload" />
                    </div>
                </Dialog>

                <!-- Add Bulk Upload Detail Dialog -->
                <Dialog header="Detail Bulk Upload" :visible.sync="showBulkUploadDetailDialog" modal>
                    <template #footer>
                        <Button label="Close" icon="pi pi-times" class="p-button-secondary" @click="showBulkUploadDetailDialog = false" />
                    </template>
                    <div>
                        <h5>Nama File: {{ bulkUploadDetail.fileName }}</h5>
                        <h5>Jumlah Data: {{ bulkUploadDetail.totalData }}</h5>
                        <h5>Data Berhasil: {{ bulkUploadDetail.successData }}</h5>
                        <h5>Data Gagal: {{ bulkUploadDetail.failedData }}</h5>
                        <DataTable :value="bulkUploadDetail.errors">
                            <Column field="row" header="Baris Kesalahan" />
                            <Column field="message" header="Penjelasan Kesalahan" />
                        </DataTable>
                    </div>
                </Dialog>

                <div v-if="loading" class="loading-spinner">
                    <ProgressSpinner />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { JenisAktifitasService } from '@/service/task/JenisAktifitasService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const jenisAktifitas = ref([]);
const deleteJenisAktifitasDialog = ref(false);
const jenisAktifitass = ref({});
const showBulkUploadDialog = ref(false);
const showBulkUploadDetailDialog = ref(false);
const bulkUploadFile = ref(null);
const bulkUploadDetail = ref({
    fileName: '',
    totalData: 0,
    successData: 0,
    failedData: 0,
    errors: []
});
const forms = reactive({
    id: null,
    kode_jenis_aktifitas: null,
    nama_jenis_aktifitas: null,
    flag_tab_menu_personal: 'active',
    batas_waktu_kunjungan: 999,
    batas_maksimal_umur_progress: 999,
    status: 1
});
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const jenisAktifitasService = new JenisAktifitasService();

const flagTabMenuPersonalOptions = ref([
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
]);

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        await loadJenisAktifitas();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const loadJenisAktifitas = async () => {
    const response = await jenisAktifitasService.getJenisAktifitas();
    if (response.status) {
        jenisAktifitas.value = response.data.data;
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const confirmDeleteJenisAktifitas = (editJenisAktifitas) => {
    jenisAktifitas.value = editJenisAktifitas;
    deleteJenisAktifitasDialog.value = true;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    addModal.value = true;
};

const openEditModal = (editJenisAktifitas) => {
    isEditing.value = true;
    forms.id = editJenisAktifitas.id;
    forms.kode_jenis_aktifitas = editJenisAktifitas.kode_jenis_aktifitas;
    forms.nama_jenis_aktifitas = editJenisAktifitas.nama_jenis_aktifitas;
    forms.flag_tab_menu_personal = editJenisAktifitas.flag_tab_menu_personal;
    forms.batas_waktu_kunjungan = editJenisAktifitas.batas_waktu_kunjungan;
    forms.batas_maksimal_umur_progress = editJenisAktifitas.batas_maksimal_umur_progress;
    forms.status = editJenisAktifitas.status;
    addModal.value = true;
};

const handleEditSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('id', forms.id);
        formData.append('kode_jenis_aktifitas', forms.kode_jenis_aktifitas);
        formData.append('nama_jenis_aktifitas', forms.nama_jenis_aktifitas);
        formData.append('flag_tab_menu_personal', forms.flag_tab_menu_personal.value);
        formData.append('batas_waktu_kunjungan', forms.batas_waktu_kunjungan);
        formData.append('batas_maksimal_umur_progress', forms.batas_maksimal_umur_progress);
        formData.append('status', forms.status.value.toString());

        const response = await jenisAktifitasService.updateJenisAktifitas(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Jenis Aktifitas updated successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            await loadJenisAktifitas();
        } else {
            toast.add({ severity: 'error', summary: 'Fail', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('kode_jenis_aktifitas', forms.kode_jenis_aktifitas);
        formData.append('nama_jenis_aktifitas', forms.nama_jenis_aktifitas);
        formData.append('flag_tab_menu_personal', forms.flag_tab_menu_personal.value);
        formData.append('batas_waktu_kunjungan', forms.batas_waktu_kunjungan);
        formData.append('batas_maksimal_umur_progress', forms.batas_maksimal_umur_progress);
        formData.append('status', forms.status.value.toString());

        const response = await jenisAktifitasService.createJenisAktifitas(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Jenis Aktifitas added successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            await loadJenisAktifitas();
        } else {
            toast.add({ severity: 'error', summary: 'Fail', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const resetForm = () => {
    forms.id = null;
    forms.kode_jenis_aktifitas = null;
    forms.nama_jenis_aktifitas = null;
    forms.flag_tab_menu_personal = 'active';
    forms.batas_waktu_kunjungan = 999;
    forms.batas_maksimal_umur_progress = 999;
    forms.status = 1;
};

const deleteJenisAktifitas = async () => {
    loading.value = true;
    try {
        await jenisAktifitasService.deleteJenisAktifitas(jenisAktifitas.value.id);
        jenisAktifitas.value = jenisAktifitas.value.filter((val) => val.id !== jenisAktifitas.value.id);
        deleteJenisAktifitasDialog.value = false;
        jenisAktifitas.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Jenis Aktifitas Deleted', life: 3000 });
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

const getStatusSeverity = (status) => {
    return status == 1 ? 'success' : 'danger';
};
const bulkUpload = async () => {
    console.log(bulkUploadFile.value.files[0]);
    const formData = new FormData();
    formData.append('file', bulkUploadFile.value.files[0]);

    // try {
    //     const response = await jenisAktifitasService.bulkUpload(formData);
    //     if (response.status) {
    //         toast.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded Successfully', life: 3000 });
    //         showBulkUploadDialog.value = false;
    //         // Load the details to show in the bulk upload detail dialog
    //         bulkUploadDetail.fileName = bulkUploadFile.value.files[0].name;
    //         // Implement the logic to populate the rest of the bulkUploadDetail object based on the response
    //     } else {
    //         toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    //     }
    // } catch (error) {
    //     toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    // }
};

const exportToExcel = async () => {
    try {
        const response = await jenisAktifitasService.export();
        // Handle the response to trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'jenis_aktifitas.xlsx');
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
</script>

<style scoped>
.loading-spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
