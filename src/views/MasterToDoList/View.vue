<script setup>
import { onMounted, reactive, ref, watch, onBeforeMount } from 'vue';
import { KpiService } from '@/service/kpi/KpiService';
import { TodoService } from '@/service/todo/TodoService';
import { useToast } from 'primevue/usetoast';

const toast = new useToast();
const addTodo = ref(false);
const bUrl = 'https://backend.coffeelabs.id';

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const forms = ref({});
const isEditing = ref(false);
const kpiService = new KpiService();
const todoService = new TodoService();
const filterUserOptions = ref([]);
const todoList = ref([]);
const selectedUser = ref(null);
// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    forms.value.user_name = null;
    forms.value.id_user = null;
    forms.value.name = null;
    forms.value.detail = null;
    forms.value.tanggal = null;
    forms.value.attachment = [];
    addTodo.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = async (task) => {
    isEditing.value = true;
    forms.value.user_name = task.user.name;
    forms.value.id_user = task.id;
    forms.value.name = task.name;
    forms.value.detail = task.detail;
    forms.value.tanggal = task.tanggal;
    forms.value.attachment = task.todo_attachment;
    addTodo.value = true;
};

const fetchUserList = async () => {
    try {
        const response = await kpiService.getUser();
        if (response.status) {
            filterUserOptions.value = response.data.map((user) => ({
                name: user.name,
                id: user.id
            }));
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch user list', life: 3000 });
    }
};
const fetchTodo = async () => {
    try {
        const response = await todoService.getTodo();
        if (response.status) {
            todoList.value = response.data;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch Task', life: 3000 });
    }
};
onBeforeMount(() => {
    fetchUserList();
    fetchTodo();
});
const handleApprove = async (id) => {
    try {
        const formData = new FormData();
        formData.append('id', id);
        const response = await todoService.updateTodoApprove(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
            fetchUserList();
            fetchTodo();
            addTodo.value = false;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleReject = async (id) => {
    try {
        const formData = new FormData();
        formData.append('id', id);
        const response = await todoService.updateTodoReject(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
            fetchUserList();
            fetchTodo();
            addTodo.value = false;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleRemove = async (id) => {
    try {
        const formData = new FormData();
        const response = await todoService.deleteTodo(id);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
            fetchUserList();
            fetchTodo();
            addTodo.value = false;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleAddTask = async () => {
    try {
        const formData = new FormData();
        formData.append('id_user', selectedUser.value.id);
        formData.append('name', forms.value.name);
        formData.append('detail', forms.value.detail);
        formData.append('tanggal', formatDate(forms.value.tanggal));
        const response = await todoService.createTodo(formData);
        if (response.status) {
            fetchUserList();
            fetchTodo();
            addTodo.value = false;
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12 xl:col-12">
            <div class="card shadow-2">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Task List</h5>
                    <div>
                        <!-- <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button> -->
                        <Button icon="pi pi-plus" class="p-button-text p-button-plain p-button-rounded" @click="openAddModal()"></Button>
                    </div>
                </div>

                <span class="block text-600 font-medium mb-3">Undone</span>
                <ul class="overflow-auto surface-height p-0 mx-0 mt-0 mb-4 list-none">
                    <li v-for="todo in todoList" :key="todo.id" class="flex align-items-center justify-content-between py-2 border-bottom-1 surface-border">
                        <div class="flex flex-row align-items-center">
                            <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i class="pi pi-tag text-xl text-blue-500"></i>
                            </div>
                            <span class="text-900 line-height-3">{{ todo.user.name }} - {{ todo.name }} </span>
                        </div>

                        <div class="flex align-items-center justify-content-center">
                            <Tag :severity="todo.status == 1 ? 'info' : 'danger'" class="mr-3">{{ todo.status == 1 ? 'Sudah Selesai' : 'Belum Selesai' }}</Tag>
                            <Button @click.prevent="openEditModal(todo)" class="mr-3" severity="info" icon="pi pi-eye" />
                            <Button @click.prevent="handleRemove(todo.id)" class="mr-3" severity="danger" icon="pi pi-trash" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="addTodo" modal :header="isEditing ? `View Task - ${forms?.name} - ${forms?.user_name}` : 'Add Task'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="formgrid grid p-fluid">
            <div v-if="!isEditing" class="col-12 md:col-12 xs:col-12">
                <div class="field">
                    <Button severity="success" label="Add Task" type="submit" @click.prevent="handleAddTask(forms?.id_user)" />
                </div>
            </div>
            <div v-if="isEditing" class="col-6 md:col-6 xs:col-12">
                <div class="field">
                    <Button severity="success" label="Approve" type="submit" @click.prevent="handleApprove(forms?.id_user)" />
                </div>
            </div>
            <div v-if="isEditing" class="col-6 md:col-6 xs:col-12">
                <div class="field">
                    <Button severity="danger" label="Reject" type="submit" @click.prevent="handleReject(forms?.id_user)" />
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field">
                    <label for="formname">Nama Task</label>
                    <InputText id="formname" v-model="forms.name" />
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field">
                    <label for="tanggal">Deadline</label>
                    <Calendar id="tanggal" v-model="forms.tanggal" />
                </div>
            </div>
            <div v-if="!isEditing" class="col-12 md:col-4">
                <div class="field">
                    <label for="cash_out">Pilih User</label>
                    <Dropdown :options="filterUserOptions" optionLabel="name" placeholder="Pilih User" checkmark dropdownIcon="pi pi-filter" :highlightOnSelect="true" v-model="selectedUser" />
                </div>
            </div>
            <div class="col-12 md:col-12">
                <div class="field">
                    <label for="keterangan">Detail Task</label>
                    <Textarea autoResize rows="5" cols="30" v-model="forms.detail" />
                </div>
            </div>
            <div v-if="isEditing" v-for="attachment in forms.attachment" :key="attachment?.id" class="col-4 md:col-4">
                <div class="field">
                    <Card style="width: 200px; overflow: hidden">
                        <template #header>
                            <Image width="200" alt="user header" :src="attachment?.pict == NULL ? `/no_image.jpg` : bUrl + '/' + attachment?.pict" preview />
                        </template>
                        <template #content>
                            <p class="m-0">
                                {{ attachment?.detail }}
                            </p>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.surface-height {
    /* Use PrimeFlex grid system for responsive layout */
    @media screen and (min-width: 0px) {
        /* Extra small devices (phones) */
        height: 490px; /* Default height for small screens */
    }
    @media screen and (min-width: 576px) {
        /* Small devices (landscape phones) */
        height: 480px; /* Adjust height for small screens if needed */
    }
    @media screen and (min-width: 768px) {
        /* Medium devices (tablets) */
        height: 550px; /* Adjust height for medium screens if needed */
    }
    @media screen and (min-width: 992px) {
        /* Large devices (desktops) */
        height: 590px; /* Adjust height for large screens if needed */
    }
    @media screen and (min-width: 1200px) {
        /* Extra large devices (large desktops) */
        height: 540px; /* Adjust height for extra large screens if needed */
    }
}
</style>
