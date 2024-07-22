<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { UserService } from '@/service/user/UserService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';

const toast = useToast();
const users = ref([]);
const deleteUserDialog = ref(false);
const user = ref({});
const selectedUsers = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const isEditing = ref(false);
const isFileImage = ref(false);
const forms = reactive({
    id: null,
    name: null,
    email: null,
    profile_image: '',
    tgl_lahir: null,
    tgl_masuk: null,
    phone: null,
    role: null,
    salary: null,
    norek: null,
    bank_name: null
});
const dropdownItems = ref([]);
const userService = new UserService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await userService.getUser();
        users.value = data.data;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data fetched successfully', life: 3000 });

        const dataRole = await userService.getRole();
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

const imageHandler = async (event) => {
    forms.profile_image = event.files[0];
    isFileImage.value = true;
};

const confirmDeleteUser = (editUser) => {
    user.value = editUser;
    deleteUserDialog.value = true;
};

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    addModal.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = (user) => {
    isEditing.value = true;

    forms.id = user.id;
    forms.name = user.name;
    forms.email = user.email;
    forms.tgl_lahir = formatDate(user.tgl_lahir);
    forms.tgl_masuk = formatDate(user.tgl_masuk);
    forms.phone = user.phone;
    forms.role = user.roles[0].id; // Ensure the role ID is selected correctly
    forms.salary = user.salary;
    forms.norek = user.norek;
    forms.bank_name = user.bank_name;

    addModal.value = true;
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('name', forms.name);
        formData.append('email', forms.email);
        formData.append('tgl_lahir', formatDate(forms.tgl_lahir));
        formData.append('tgl_masuk', formatDate(forms.tgl_masuk));
        formData.append('phone', forms.phone);
        formData.append('salary', forms.salary);
        formData.append('norek', forms.norek);
        formData.append('bank_name', forms.bank_name);
        if (isFileImage.value) {
            formData.append('profile_image', forms.profile_image);
        }

        if (isEditing.value) {
            formData.append('id', forms.id);
            await userService.updateUser(formData);
            toast.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully', life: 3000 });
        } else {
            formData.append('role', forms.role.value); // Append role ID only when adding a new user
            await userService.createUser(formData);
            toast.add({ severity: 'success', summary: 'Success', detail: 'User added successfully', life: 3000 });
        }
        isFileImage.value = false;
        addModal.value = false;
        resetForm();
        const data = await userService.getUser();
        users.value = data.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

const resetForm = () => {
    forms.id = null;
    forms.name = null;
    forms.email = null;
    forms.profile_image = null;
    forms.tgl_lahir = null;
    forms.tgl_masuk = null;
    forms.phone = null;
    forms.role = null;
    forms.salary = null;
    forms.norek = null;
    forms.bank_name = null;
};

const deleteUser = async () => {
    loading.value = true;
    try {
        await userService.deleteUser(user.value.id);
        users.value = users.value.filter((val) => val.id !== user.value.id);
        deleteUserDialog.value = false;
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
                    <Column header="Image">
                        <template #body="slotProps">
                            <Image preview :src="`https://workplan-web.test/${slotProps.data.profile_image}`" :alt="slotProps.data.image" width="90" class="border-round" />
                        </template>
                    </Column>
                    <Column field="name" header="Nama User" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama User</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="role" header="Role" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Role</span>
                            {{ slotProps.data.roles[0].name }}
                        </template>
                    </Column>
                    <Column field="tgl_masuk" header="Tanggal Masuk" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Tanggal Masuk</span>
                            {{ slotProps.data.tgl_masuk }}
                        </template>
                    </Column>
                    <Column field="email" header="Email" :sortable="false">
                        <template #body="slotProps">
                            <span class="p-column-title">Email</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <router-link to="/app/master/user/area">
                                <Button icon="pi pi-map-marker" class="mr-2" severity="info" rounded />
                            </router-link>
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="openEditModal(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteUser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteUserDialog" :breakpoints="{ '960px': '75vw' }" style="width: 30vw" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >Are you sure you want to delete <b>{{ user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteUser" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="addModal" :modal="true" :header="isEditing ? 'Edit User' : 'Add User'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <div class="formgrid grid p-fluid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formname">Nama User</label>
                                <InputText id="formname" v-model="forms.name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formemail">Email</label>
                                <InputText id="formemail" v-model="forms.email" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="tgl_lahir">Tanggal Lahir</label>
                                <Calendar id="tgl_lahir" v-model="forms.tgl_lahir" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="tgl_masuk">Tanggal Masuk</label>
                                <Calendar id="tgl_masuk" v-model="forms.tgl_masuk" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formphone">Nomor HP / Telfon</label>
                                <InputText id="formphone" v-model="forms.phone" />
                            </div>
                        </div>
                        <div v-if="!isEditing" class="col-12 md:col-6">
                            <div class="field">
                                <label for="formrole">Role</label>
                                <Dropdown id="formrole" v-model="forms.role" :options="dropdownItems" optionLabel="label" placeholder="Select One" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formnorek">Nomor Rekening</label>
                                <InputText id="formnorek" v-model="forms.norek" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formbankname">Nama Bank</label>
                                <InputText id="formbankname" v-model="forms.bank_name" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formsalary">Gaji</label>
                                <InputText id="formsalary" v-model="forms.salary" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="formprofile">Foto Profile</label>

                                <FileUpload class="w-full mb-5" mode="basic" name="profile_image" accept="image/*" capture chooseLabel="Pilih Foto" v-on:select="imageHandler" customUpload />
                                <small v-if="isEditing" class="text-red-500">*lewati jika tidak dirubah</small>
                            </div>
                        </div>

                        <div class="col-12 md:col-12">
                            <div class="field">
                                <Button label="Submit" type="submit" @click.prevent="handleSubmit" />
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
