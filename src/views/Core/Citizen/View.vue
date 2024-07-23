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
                    :value="citizens"
                    v-model:selection="selectedCitizens"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} citizens"
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
                    <Column field="status" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Badge class="text-white" :value="slotProps.data.status == 1 ? 'Active' : 'Inactive'" :severity="getStatusSeverity(slotProps.data.status)"></Badge>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="openEditModal(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteCitizen(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteCitizenDialog" :breakpoints="{ '960px': '75vw' }" style="width: 30vw" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="citizen"
                            >Are you sure you want to delete <b>{{ citizen.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteCitizenDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteCitizen" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" :modal="true" header="Add Citizen" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formname">Name</label>
                                <InputText id="formname" v-model="forms.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formstatus">Status</label>
                                <Dropdown
                                    id="formstatus"
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
import { CitizenService } from '@/service/Core/CitizenService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const citizens = ref([]);
const deleteCitizenDialog = ref(false);
const citizen = ref({});
const forms = reactive({
    id: null,
    name: null,
    status: 1
});
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const citizenService = new CitizenService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await citizenService.getCitizens();
        citizens.value = data.data;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeleteCitizen = (editCitizen) => {
    citizen.value = editCitizen;
    deleteCitizenDialog.value = true;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    addModal.value = true;
};

const openEditModal = (editCitizen) => {
    isEditing.value = true;
    forms.id = editCitizen.id;
    forms.name = editCitizen.name;
    forms.status = editCitizen.status;
    addModal.value = true;
};

const handleEditSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('id', forms.id);
        formData.append('name', forms.name);
        formData.append('status', forms.status.value); // Ensure status is appended as integer

        const response = await citizenService.updateCitizen(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Citizen updated successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            const data = await citizenService.getCitizens();
            citizens.value = data.data;
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
        formData.append('status', forms.status.value); // Ensure status is appended as integer

        const response = await citizenService.createCitizen(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Citizen added successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            const data = await citizenService.getCitizens();
            citizens.value = data.data;
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
    forms.status = 1;
};

const deleteCitizen = async () => {
    loading.value = true;
    try {
        await citizenService.deleteCitizen(citizen.value.id);
        citizens.value = citizens.value.filter((val) => val.id !== citizen.value.id);
        deleteCitizenDialog.value = false;
        citizen.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Citizen Deleted', life: 3000 });
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
</script>

<style scoped>
.loading-spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
