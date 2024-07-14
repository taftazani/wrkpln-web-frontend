<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { AreaService } from '@/service/user/AreaService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const users = ref([]);
const deleteAreaDialog = ref(false);
const user = ref({});
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const forms = reactive({
    id: null,
    user_id: null,
    area_id: []
});
const dropdownItems = ref([]);
const areaService = new AreaService();

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const fetchData = async () => {
    loading.value = true;
    try {
        const [userData, areaData] = await Promise.all([areaService.getUser(), areaService.getArea()]);
        users.value = userData.data;
        dropdownItems.value = areaData.data.map((area) => ({
            label: area.name,
            value: area.id
        }));
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
};

onBeforeMount(initFilters);
onMounted(fetchData);

const confirmDeleteUser = (editUser) => {
    user.value = editUser;
    deleteAreaDialog.value = true;
};

const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    addModal.value = true;
};

const openEditModal = (editUser) => {
    isEditing.value = true;
    forms.id = editUser.id;
    forms.user_id = editUser.id;
    forms.area_id = editUser.area.map((areas) => ({
        label: areas.name,
        value: areas.id
    }));
    addModal.value = true;
};

const handleEditSubmit = async () => {
    const area_id = forms.area_id.map((areas_id) => areas_id.value.toString());
    const formData = new FormData();
    formData.append('id', forms.id);
    formData.append('user_id', forms.user_id);
    formData.append('area_id', JSON.stringify(area_id));

    try {
        const response = await areaService.updateArea(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            await fetchData();
        } else {
            toast.add({ severity: 'error', summary: 'Fail', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('user_id', forms.user_id);
    formData.append('area_id', JSON.stringify(forms.area_id));

    try {
        const response = await areaService.createUser(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'User added successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            await fetchData();
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
    forms.area_id = [];
};

const deleteArea = async () => {
    loading.value = true;
    try {
        await areaService.deleteArea(user.value.id);
        users.value = users.value.filter((val) => val.id !== user.value.id);
        deleteAreaDialog.value = false;
        user.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
};

const exportCSV = () => {
    dt.value.exportCSV();
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <!-- <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openAddModal" />
                        </div>
                    </template> -->
                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="users"
                    v-model:selection="selectedUsers"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                >
                    <Column field="name" header="Nama User" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama User</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="area" header="Area" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Area</span>
                            <ul v-if="slotProps.data.area">
                                <li v-for="area in slotProps.data.area" :key="area.id">
                                    <Tag severity="success" class="m-1">{{ area.name }}</Tag>
                                </li>
                            </ul>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-map-marker" class="mr-2" severity="info" rounded @click="openEditModal(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteUser(slotProps.data)" /> -->
                        </template>
                    </Column>
                </DataTable>

                <!-- <Dialog v-model:visible="deleteAreaDialog" :breakpoints="{ '960px': '75vw' }" style="width: 30vw" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >Are you sure you want to delete <b>{{ user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteAreaDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteArea" />
                    </template>
                </Dialog> -->

                <Dialog v-model:visible="addModal" :modal="true" header="Add User" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formname">ID User</label>
                                <InputText id="formname" v-model="forms.user_id" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formarea">Area</label>
                                <MultiSelect v-model="forms.area_id" :maxSelectedLabels="3" :options="dropdownItems" optionLabel="label" filter placeholder="Select Area" />
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

<style scoped>
.loading-spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
