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
                    :value="packageTypes"
                    v-model:selection="selectedPackageTypes"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} package types"
                >
                    <Column field="code" header="Code" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Code</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="name" header="Name" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Price</span>
                            {{ formatCurrency(slotProps.data.price) }}
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
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeletePackageType(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deletePackageTypeDialog" :breakpoints="{ '960px': '75vw' }" style="width: 30vw" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="packageType"
                            >Are you sure you want to delete <b>{{ packageType.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deletePackageTypeDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deletePackageType" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" :modal="true" header="Add Package Type" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="name">Name</label>
                                <InputText id="name" v-model="forms.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="price">Price</label>
                                <InputNumber id="price" v-model="forms.price" mode="currency" currency="IDR" locale="id-ID" />
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
import { PackageTypeService } from '@/service/Core/PackageTypeService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const packageTypes = ref([]);
const deletePackageTypeDialog = ref(false);
const packageType = ref({});
const forms = reactive({
    id: null,
    name: null,
    price: null,
    status: 1
});
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const packageTypeService = new PackageTypeService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await packageTypeService.getPackageTypes();
        packageTypes.value = data.data;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeletePackageType = (editPackageType) => {
    packageType.value = editPackageType;
    deletePackageTypeDialog.value = true;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    addModal.value = true;
};

const openEditModal = (editPackageType) => {
    isEditing.value = true;
    forms.id = editPackageType.id;
    forms.name = editPackageType.name;
    forms.price = editPackageType.price;
    forms.status = editPackageType.status;
    addModal.value = true;
};

const handleEditSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('id', forms.id);
        formData.append('name', forms.name);
        formData.append('price', forms.price);
        formData.append('status', forms.status.value.toString()); // Convert status to string

        const response = await packageTypeService.updatePackageType(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Package Type updated successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            const data = await packageTypeService.getPackageTypes();
            packageTypes.value = data.data;
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
        formData.append('name', forms.name);
        formData.append('price', forms.price);
        formData.append('status', forms.status.value.toString()); // Convert status to string

        const response = await packageTypeService.createPackageType(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Package Type added successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            const data = await packageTypeService.getPackageTypes();
            packageTypes.value = data.data;
        } else {
            toast.add({ severity: 'error', summary: 'Fail', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const resetForm = () => {
    forms.id = null;
    forms.name = null;
    forms.price = null;
    forms.status = 1;
};

const deletePackageType = async () => {
    loading.value = true;
    try {
        await packageTypeService.deletePackageType(packageType.value.id);
        packageTypes.value = packageTypes.value.filter((val) => val.id !== packageType.value.id);
        deletePackageTypeDialog.value = false;
        packageType.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Package Type Deleted', life: 3000 });
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
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
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
