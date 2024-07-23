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

                <!-- Organization Chart -->
                <OrganizationChart :value="structuredData" collapsible class="mt-4">
                    <template #default="slotProps">
                        <div class="flex flex-col items-center">
                            <span class="font-medium text-lg">{{ slotProps.node.label }}</span>
                            <Button icon="pi pi-info-circle" class="p-button-rounded p-button-info mt-2" @click="showOptions(slotProps.node.data)" />
                        </div>
                    </template>
                </OrganizationChart>

                <!-- Modals -->
                <Dialog v-model:visible="addEditModalVisible" header="Add/Edit Structure" :modal="true" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <!-- Form for Add/Edit Structure -->
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formname">Nama Structure</label>
                                <InputText id="formname" v-model="formData.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="organization">Organization</label>
                                <Dropdown id="organization" v-model="formData.organization_id" :options="organizations" optionLabel="name" placeholder="Pilih Organization" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="function">Function</label>
                                <Dropdown id="function" v-model="formData.function_id" :options="functions" optionLabel="name" placeholder="Pilih Function" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="levelStructure">Level Structure</label>
                                <Dropdown id="levelStructure" v-model="formData.level_structure_id" :options="levelStructures" optionLabel="name" placeholder="Pilih Level Structure" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="costCenter">Cost Center</label>
                                <InputText id="costCenter" v-model="formData.cost_center" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="planManPower">Plan Man Power</label>
                                <InputText id="planManPower" v-model="formData.plan_man_power" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="actualManPower">Actual Man Power</label>
                                <InputText id="actualManPower" v-model="formData.actual_man_power" disabled />
                            </div>
                        </div>
                        <div class="col-12 md:col-12">
                            <div class="field">
                                <Button label="Submit" type="submit" @click.prevent="isEditing ? handleEditSubmit() : handleSubmit()" />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <!-- User List Modal -->
                <Dialog v-model:visible="userListModalVisible" header="User List" :modal="true" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="flex flex-col gap-4">
                        <div v-for="user in selectedStructureUsers" :key="user.id" class="flex items-center gap-4">
                            <img :src="user.profile_picture" class="w-12 h-12 rounded-full" />
                            <span>{{ user.name }}</span>
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="removeUser(user.id)" />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
// import { OrganizationChart } from 'primevue/organizationchart';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { StructureService } from '@/service/Core/StructureService';
import { FunctionService } from '@/service/Core/FunctionService';
import { OrganizationService } from '@/service/Core/OrganizationService';
import { LevelStructureService } from '@/service/Core/LevelStructureService';

const toast = useToast();
const structures = ref([]);
const structuredData = ref([]);
const organizations = ref([]);
const functions = ref([]);
const levelStructures = ref([]);
const selectedStructureUsers = ref([]);
const addEditModalVisible = ref(false);
const userListModalVisible = ref(false);
const isEditing = ref(false);
const formData = reactive({
    id: null,
    name: '',
    organization_id: null,
    function_id: null,
    level_structure_id: null,
    cost_center: '',
    plan_man_power: '',
    actual_man_power: 0
});
const structureService = new StructureService();
const organizationService = new OrganizationService();
const functionService = new FunctionService();
const levelStructureService = new LevelStructureService();

onMounted(async () => {
    await loadStructures();
    await loadDropdownData();
});

const loadStructures = async () => {
    const response = await structureService.getStructures();
    if (response.status) {
        structures.value = response.data;
        structuredData.value = transformData(response.data);
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const loadDropdownData = async () => {
    const dataFunction = await functionService.getFunctions();
    functions.value = dataFunction.data.map((functionss) => ({
        label: functionss.name,
        value: functionss.id
    }));

    const dataOrganization = await organizationService.getOrganizations();
    organizations.value = dataOrganization.data.map((organizationss) => ({
        label: organizationss.name,
        value: organizationss.id
    }));

    const dataLevelStructure = await levelStructureService.getLevelStructures();
    levelStructures.value = dataLevelStructure.data.map((levelStructuress) => ({
        label: levelStructuress.name,
        value: levelStructuress.id
    }));
};

const transformData = (data) => {
    return data.map((item) => ({
        label: item.name,
        data: item,
        children: item.children ? transformData(item.children) : []
    }));
};

const openAddModal = () => {
    resetForm();
    isEditing.value = false;
    addEditModalVisible.value = true;
};

const openEditModal = (structure) => {
    formData.id = structure.id;
    formData.name = structure.name;
    formData.organization_id = structure.organization_id;
    formData.function_id = structure.function_id;
    formData.level_structure_id = structure.level_structure_id;
    formData.cost_center = structure.cost_center;
    formData.plan_man_power = structure.plan_man_power;
    formData.actual_man_power = structure.users.length;
    isEditing.value = true;
    addEditModalVisible.value = true;
};

const showOptions = (structure) => {
    // Logic to show options (people, add, delete, edit)
};

const handleSubmit = async () => {
    const response = await structureService.createStructure(formData);
    if (response.status) {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Structure created successfully', life: 3000 });
        addEditModalVisible.value = false;
        await loadStructures();
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const handleEditSubmit = async () => {
    const response = await structureService.updateStructure(formData);
    if (response.status) {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Structure updated successfully', life: 3000 });
        addEditModalVisible.value = false;
        await loadStructures();
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const removeUser = async (userId) => {
    const response = await structureService.removeUserFromStructure({ structure_id: formData.id, user_id: userId });
    if (response.status) {
        toast.add({ severity: 'success', summary: 'Success', detail: 'User removed successfully', life: 3000 });
        selectedStructureUsers.value = selectedStructureUsers.value.filter((user) => user.id !== userId);
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const resetForm = () => {
    formData.id = null;
    formData.name = '';
    formData.organization_id = null;
    formData.function_id = null;
    formData.level_structure_id = null;
    formData.cost_center = '';
    formData.plan_man_power = '';
    formData.actual_man_power = 0;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const getStatusSeverity = (status) => {
    return status == 1 ? 'success' : 'danger';
};
</script>
