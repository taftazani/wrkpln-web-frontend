<script setup>
import { onMounted, reactive, ref, watch, onBeforeMount } from 'vue';
import { NotificationService } from '@/service/notification/NotificationService';
import { useToast } from 'primevue/usetoast';

const toast = new useToast();
const addNotification = ref(false);
const bUrl = 'https://workplan-web.test';

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const forms = ref({});
const isEditing = ref(false);
const notificationService = new NotificationService();
const filterUserOptions = ref([]);
const notificationList = ref([]);
const selectedUser = ref(null);
const valueMessage = ref('All User');
const options = ref(['All User', 'Direct User']);
// Function to open the modal in Add mode
const openAddModal = () => {
    isEditing.value = false;
    forms.value.category = null;
    forms.value.user_id = null;
    forms.value.title = null;
    forms.value.detail = null;
    forms.value.tanggal = null;
    forms.value.status = null;
    addNotification.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = async (notification) => {
    isEditing.value = true;
    forms.value.category = notification.category;
    forms.value.user_id = notification.user_id;
    forms.value.title = notification.title;
    forms.value.detail = notification.detail;
    forms.value.tanggal = notification.tanggal;
    forms.value.status = notification.status;
    addNotification.value = true;
};

const fetchUserList = async () => {
    try {
        const response = await notificationService.getUser();
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
const fetchNotification = async () => {
    try {
        const response = await notificationService.getNotification();
        if (response.status) {
            notificationList.value = response.data;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch Notification', life: 3000 });
    }
};
onBeforeMount(() => {
    fetchUserList();
    fetchNotification();
});
const handleApprove = async (id) => {
    try {
        const formData = new FormData();
        formData.append('id', id);
        const response = await notificationService.updateNotificationApprove(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
            fetchUserList();
            fetchNotification();
            addNotification.value = false;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleReject = async (id) => {
    try {
        const formData = new FormData();
        formData.append('id', id);
        const response = await notificationService.updateNotificationReject(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
            fetchUserList();
            fetchNotification();
            addNotification.value = false;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleRemove = async (id) => {
    try {
        const formData = new FormData();
        const response = await notificationService.deleteNotification(id);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
            fetchUserList();
            fetchNotification();
            addNotification.value = false;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleAddNotification = async () => {
    try {
        const formData = new FormData();
        if (valueMessage.value == 'Direct User') {
            formData.append('user_id', selectedUser.value.id);
        }
        formData.append('category', forms.value.category);
        formData.append('title', forms.value.title);
        formData.append('detail', forms.value.detail);
        formData.append('tanggal', formatDate(forms.value.tanggal));
        const response = await notificationService.createNotification(formData);
        if (response.status) {
            fetchUserList();
            fetchNotification();
            addNotification.value = false;
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
                    <h5>Notification List</h5>
                    <div>
                        <!-- <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button> -->
                        <Button icon="pi pi-plus" class="p-button-text p-button-plain p-button-rounded" @click="openAddModal()"></Button>
                    </div>
                </div>

                <ul class="overflow-auto surface-height p-0 mx-0 mt-0 mb-4 list-none">
                    <li v-for="notification in notificationList" :key="notification.id" class="flex align-items-center justify-content-between py-2 border-bottom-1 surface-border">
                        <div class="flex flex-row align-items-center">
                            <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i class="pi pi-bell text-xl text-blue-500"></i>
                            </div>
                            <span class="text-900 line-height-3"
                                ><b>{{ notification.category }}</b> (<b>{{ notification.title }}</b
                                >) - {{ notification.detail }}
                            </span>
                        </div>

                        <div class="flex align-items-center justify-content-center">
                            <Tag :severity="notification.status == 1 ? 'success' : 'danger'" class="mr-3">{{ notification.status == 1 ? 'Sended' : 'Deleted by User' }}</Tag>
                            <Button @click.prevent="handleRemove(notification.id)" class="mr-3" severity="danger" icon="pi pi-trash" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="addNotification" modal :header="isEditing ? `View Notification` : 'Add Notification'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="formgrid grid p-fluid">
            <div v-if="!isEditing" class="col-12 md:col-12 xs:col-12">
                <div class="field">
                    <Button severity="success" label="Send Notification" type="submit" @click.prevent="handleAddNotification(forms?.user_id)" />
                </div>
            </div>
            <div v-if="isEditing" class="col-12 md:col-12 xs:col-12">
                <div class="field">
                    <Button severity="danger" label="Reject" type="submit" @click.prevent="handleReject(forms?.id_user)" />
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field">
                    <label for="formname">Category</label>
                    <InputText id="formname" v-model="forms.category" />
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field">
                    <label for="formname">Title</label>
                    <InputText id="formname" v-model="forms.title" />
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field">
                    <label for="tanggal">Date</label>
                    <Calendar id="tanggal" v-model="forms.tanggal" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="field">
                    <label for="">Send Message For : </label>
                    <SelectButton v-model="valueMessage" :options="options" aria-labelledby="basic" />
                </div>
            </div>
            <div v-if="valueMessage == 'Direct User'" class="col-12 md:col-6">
                <div class="field">
                    <label for="cash_out">Pilih User</label>
                    <Dropdown :options="filterUserOptions" optionLabel="name" placeholder="Pilih User" checkmark dropdownIcon="pi pi-filter" :highlightOnSelect="true" v-model="selectedUser" />
                </div>
            </div>
            <div class="col-12 md:col-12">
                <div class="field">
                    <label for="keterangan">Message</label>
                    <Textarea autoResize rows="5" cols="30" v-model="forms.detail" />
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
