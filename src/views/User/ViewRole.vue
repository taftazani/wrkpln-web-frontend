<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { RoleService } from '@/service/user/RoleService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const roles = ref([]);
const deleteRoleDialog = ref(false);
const role = ref({});
const forms_permission = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const isFileImage = ref(false);
const forms = reactive({
    id: null,
    name: null,
    permission: []
});
const dropdownItems = ref([]);
const roleService = new RoleService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await roleService.getRole();
        roles.value = data.data;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });

        const dataRole = await roleService.getPermission();
        dropdownItems.value = dataRole.data.map((role) => ({
            label: role.name,
            value: role.id
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const confirmDeleteUser = (editUser) => {
    role.value = editUser;
    deleteRoleDialog.value = true;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    addModal.value = true;
};
const openEditModal = (editRole) => {
    isEditing.value = true;
    forms.id = editRole.id;
    forms.name = editRole.name;
    forms.permission = editRole.permissions.map((perm) => ({
        label: perm.name,
        value: perm.id
    }));
    addModal.value = true;
};

const handleEditSubmit = async () => {
    const permission = forms.permission.map((permission) => permission.value.toString());
    try {
        const formData = new FormData();
        formData.append('id', forms.id);
        formData.append('name', forms.name);
        formData.append('permission', JSON.stringify(permission));

        const response = await roleService.updateRole(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Role updated successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            const data = await roleService.getRole();
            roles.value = data.data;
        } else {
            toast.add({ severity: 'error', summary: 'Fail', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleSubmit = async () => {
    const permission = forms.permission.map((permission) => permission.value.toString());
    try {
        const formData = new FormData();
        formData.append('name', forms.name);
        formData.append('permission', JSON.stringify(permission));

        const response = await roleService.createRole(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'User added successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            const data = await roleService.getRole();
            roles.value = data.data;
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
    forms.permission = [];
};

const deleteRole = async () => {
    loading.value = true;
    try {
        await roleService.deleteRole(role.value.id);
        roles.value = roles.value.filter((val) => val.id !== role.value.id);
        deleteRoleDialog.value = false;
        role.value = {};
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
                    :value="roles"
                    v-model:selection="selectedUsers"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles"
                >
                    <Column field="name" header="Nama Role" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Role</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="name" header="Permission" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Permission</span>
                            <ul v-if="slotProps.data.permissions">
                                <li v-for="permission in slotProps.data.permissions" :key="permission.id">{{ permission.name }}</li>
                            </ul>
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="openEditModal(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteUser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteRoleDialog" :breakpoints="{ '960px': '75vw' }" style="width: 30vw" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="role"
                            >Are you sure you want to delete <b>{{ role.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteRoleDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteRole" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" :modal="true" header="Add User" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formname">Nama Role</label>
                                <InputText id="formname" v-model="forms.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formemail">Permission</label>
                                <MultiSelect v-model="forms.permission" :maxSelectedLabels="3" :options="dropdownItems" optionLabel="label" filter placeholder="Select Permission" />
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
