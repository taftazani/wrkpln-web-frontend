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
                    :value="menuMappings"
                    v-model:selection="selectedMenuMappings"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} menu mappings"
                >
                    <Column field="package_type_id" header="Package Type" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Package Type</span>
                            {{ getPackageTypeName(slotProps.data.package_type_id) }}
                        </template>
                    </Column>
                    <Column field="module" header="Module" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Module</span>
                            {{ slotProps.data.module }}
                        </template>
                    </Column>
                    <Column field="permission_id" header="Permission" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Permission</span>
                            {{ getPermissionName(slotProps.data.permission_id) }}
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
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteMenuMapping(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteMenuMappingDialog" :breakpoints="{ '960px': '75vw' }" style="width: 30vw" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="menuMapping"
                            >Are you sure you want to delete <b>{{ menuMapping.module }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteMenuMappingDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteMenuMapping" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" :modal="true" header="Add Menu Mapping" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="packageType">Package Type</label>
                                <Dropdown id="packageType" v-model="forms.package_type_id" :options="packageTypes" optionLabel="label" placeholder="Select Package Type" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="module">Module</label>
                                <Dropdown id="module" v-model="forms.module" :options="moduleOptions" optionLabel="label" placeholder="Select Module" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="permission">Permission</label>
                                <Dropdown id="permission" v-model="forms.permission_id" :options="permissions" optionLabel="label" placeholder="Select Permission" />
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
import { MenuMappingService } from '@/service/Core/MenuMappingService';
import { PackageTypeService } from '@/service/Core/PackageTypeService';
import { PermissionService } from '@/service/user/PermissionService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const menuMappings = ref([]);
const deleteMenuMappingDialog = ref(false);
const menuMapping = ref({});
const forms = reactive({
    id: null,
    package_type_id: null,
    module: null,
    permission_id: null,
    status: 1
});
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const menuMappingService = new MenuMappingService();
const packageTypeService = new PackageTypeService();
const permissionService = new PermissionService();

const packageTypes = ref([]);
const permissions = ref([]);
const moduleOptions = ref([
    { label: 'Web', value: 'web' },
    { label: 'Mobile', value: 'mobile' }
]);

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        await loadMenuMappings();
        await loadPackageTypes();
        await loadPermissions();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const loadMenuMappings = async () => {
    const response = await menuMappingService.getMenuMappings();
    if (response.status) {
        menuMappings.value = response.data;
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const loadPackageTypes = async () => {
    const response = await packageTypeService.getPackageTypes();
    if (response.status) {
        packageTypes.value = response.data.map((type) => ({ label: type.name, value: type.id }));
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const loadPermissions = async () => {
    const response = await permissionService.getPermission();
    if (response.status) {
        permissions.value = response.data.map((perm) => ({ label: perm.name, value: perm.id }));
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const confirmDeleteMenuMapping = (editMenuMapping) => {
    menuMapping.value = editMenuMapping;
    deleteMenuMappingDialog.value = true;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    addModal.value = true;
};

const openEditModal = (editMenuMapping) => {
    isEditing.value = true;
    forms.id = editMenuMapping.id;
    forms.package_type_id = { label: getPackageTypeName(editMenuMapping.package_type_id), value: editMenuMapping.package_type_id };
    forms.module = { label: editMenuMapping.module.charAt(0).toUpperCase() + editMenuMapping.module.slice(1), value: editMenuMapping.module };
    forms.permission_id = { label: getPermissionName(editMenuMapping.permission_id), value: editMenuMapping.permission_id };
    forms.status = editMenuMapping.status;
    addModal.value = true;
};

const handleEditSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('id', forms.id);
        formData.append('package_type_id', forms.package_type_id.value);
        formData.append('module', forms.module.value);
        formData.append('permission_id', forms.permission_id.value);
        formData.append('status', forms.status.value); // Ensure status is appended as string

        const response = await menuMappingService.updateMenuMapping(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Menu Mapping updated successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            await loadMenuMappings();
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
        formData.append('package_type_id', forms.package_type_id.value);
        formData.append('module', forms.module.value);
        formData.append('permission_id', forms.permission_id.value);
        formData.append('status', forms.status.value); // Ensure status is appended as string

        const response = await menuMappingService.createMenuMapping(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Menu Mapping added successfully', life: 3000 });
            addModal.value = false;
            resetForm();
            await loadMenuMappings();
        } else {
            toast.add({ severity: 'error', summary: 'Fail', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const resetForm = () => {
    forms.id = null;
    forms.package_type_id = null;
    forms.module = null;
    forms.permission_id = null;
    forms.status = 1;
};

const deleteMenuMapping = async () => {
    loading.value = true;
    try {
        await menuMappingService.deleteMenuMapping(menuMapping.value.id);
        menuMappings.value = menuMappings.value.filter((val) => val.id !== menuMapping.value.id);
        deleteMenuMappingDialog.value = false;
        menuMapping.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Menu Mapping Deleted', life: 3000 });
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

const getPackageTypeName = (id) => {
    const packageType = packageTypes.value.find((type) => type.value == id);
    return packageType ? packageType.label : 'Unknown';
};

const getPermissionName = (id) => {
    const permission = permissions.value.find((perm) => perm.value == id);
    return permission ? permission.label : 'Unknown';
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
