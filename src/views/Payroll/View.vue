<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive, watch } from 'vue';
import { PayrollService } from '@/service/payroll/PayrollService';
import { useToast } from 'primevue/usetoast';
import '@vuepic/vue-datepicker/dist/main.css';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const toast = useToast();
const payrolls = ref([]);
const deletePayrollDialog = ref(false);
const payroll = ref({});
// const selectedPayrolls = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);
const addModal = ref(false);
const addModalTransfer = ref(false);
const isEditing = ref(false);
const filterUserOptions = ref([]);
const selectedUser = ref(null);
const selectedUserTransfer = ref(null);
const dates = ref(null);

const form = reactive({
    id: null,
    id_user: null,
    name: null,
    tanggal: '',
    cash_out: null,
    status: null,
    approve: 1,
    reject: 2
});
const formTransfer = reactive({
    id: null,
    id_user: null,
    name: null,
    dari_tanggal: '',
    sampai_tanggal: '',
    cash_out: null
});
const payrollService = new PayrollService();

onBeforeMount(async () => {
    loading.value = true;
    fetchUserList();
    fetchPayrollData();
    loading.value = false;
});
const fetchPayrollData = async () => {
    if (!selectedUser.value) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a user', life: 3000 });
        return;
    }

    try {
        const params = {
            id_user: selectedUser.value.id,
            start_date: dates.value ? formatDate(dates.value[0]) : null,
            end_date: dates.value ? formatDate(dates.value[1]) : null
        };
        const response = await payrollService.getPayroll(params);
        if (response.status) {
            payrolls.value = response.data;
            toast.add({ severity: 'success', summary: 'Success Get Data', detail: response.message, life: 3000 });
        } else {
            toast.add({ severity: 'success', summary: 'Success Get Data', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch KPI data', life: 3000 });
    }
};
// onMounted(async () => {
//     loading.value = true;
//     fetchUserList();
//     fetchPayrollData();
//     loading.value = false;
// });

const confirmDeletePayroll = (editPayroll) => {
    payroll.value = editPayroll;
    deletePayrollDialog.value = true;
};

const formatTime = (date) => {
    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    return `${currentYear}-${currentMonth}-${currentDay}`;
};
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Function to open the modal in Add mode
const openAddModalTransfer = () => {
    isEditing.value = false;
    formTransfer.id = null;
    formTransfer.id_user = null;
    formTransfer.name = null;
    formTransfer.dari_tanggal = '';
    formTransfer.sampai_tanggal = '';
    formTransfer.cash_out = null;
    addModalTransfer.value = true;
};
const openAddModal = () => {
    isEditing.value = false;
    form.id = null;
    form.id_user = null;
    form.cash_out = null;
    form.tanggal = '';
    addModal.value = true;
};

// Function to open the modal in Edit mode
const openEditModal = (payroll) => {
    isEditing.value = true;
    form.id = payroll.id;
    form.name = payroll.user.name;
    form.id_user = payroll.id_user;
    form.cash_out = payroll.cash_out;
    form.tanggal = formatTime(payroll.tanggal);
    addModal.value = true;
};
const fetchUserList = async () => {
    try {
        const response = await payrollService.getUser();
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
const handleApprove = async () => {
    try {
        const payload = {
            id: form.id
        };
        await payrollService.updatePayrollApprove(payload);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Payroll Approved', life: 3000 });
        fetchPayrollData();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleTransfer = async () => {
    try {
        const payload = {
            id_user: selectedUserTransfer.value.id,
            tanggal_dari: formatDate(formTransfer.dari_tanggal),
            tanggal_sampai: formatDate(formTransfer.sampai_tanggal)
        };
        // console.log(payload);
        const response = await payrollService.updatePayrollBulk(payload);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000 });
            fetchPayrollData();
            addModalTransfer.value = false;
            isEditing.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
            addModalTransfer.value = false;
            isEditing.value = true;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const handleOneTransfer = async () => {
    try {
        const payload = {
            id: form.id,
            cash_out: form.cash_out
        };
        // console.log(payload);
        const response = await payrollService.updatePayrollOne(payload);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000 });
            fetchPayrollData();
            addModal.value = false;
            isEditing.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
            addModal.value = false;
            isEditing.value = true;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
// const handleReject = async () => {
//     try {
//         const payload = {
//             id: form.id
//         };
//         await payrollService.updatePayrollReject(payload);
//         toast.add({ severity: 'success', summary: 'Success', detail: 'Payroll Rejected', life: 3000 });
//         const data = await payrollService.getPayroll();
//         payrolls.value = data.data;
//     } catch (error) {
//         toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
//     }
// };
// const handleSubmit = async () => {
//     try {
//         const payload = {
//             id_user: form.id_user,
//             tanggal_payroll: formatTime(form.tanggal_payroll),
//             tanggal_payroll_selesai: formatTime(form.tanggal_payroll_selesai),
//             keperluan: form.keperluan,
//             kelengkapan: form.kelengkapan
//         };
//         if (isEditing.value) {
//             payload.id = form.id;
//             await payrollService.updatePayroll(payload); // Assume updatePayroll is defined in your payrollService
//             toast.add({ severity: 'success', summary: 'Success', detail: 'Payroll updated successfully', life: 3000 });
//         } else {
//             await payrollService.createPayroll(payload); // Assume createPayroll is defined in your payrollService
//             toast.add({ severity: 'success', summary: 'Success', detail: 'Payroll added successfully', life: 3000 });
//         }
//         addModal.value = false;
//         form.id = null;
//         form.id_user = null;
//         form.tanggal_payroll = '';
//         form.tanggal_payroll_selesai = null;
//         form.keperluan = null;
//         form.kelengkapan = null;
//         const data = await payrollService.getPayroll();
//         payrolls.value = data.data;
//     } catch (error) {
//         toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
//     }
// };

const deletePayroll = async () => {
    loading.value = true;
    try {
        await payrollService.deletePayroll(payroll.value.id);
        payrolls.value = payrolls.value.filter((val) => val.id !== payroll.value.id);
        deletePayrollDialog.value = false;
        payroll.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Payroll Deleted', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
};

const exportCSV = () => {
    dt.value.exportCSV();
};

watch([selectedUser, dates], fetchPayrollData);
const vFocus = {
    mounted: (el) => el.focus()
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template #start>
                        <div class="my-2">
                            <!-- <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openAddModal" /> -->
                            <Button label="Transfer Gaji Bulanan / Mingguan" icon="pi pi-plus" class="mr-2" severity="success" @click="openAddModalTransfer" />
                        </div>
                    </template>
                    <template #end>
                        <Dropdown v-focus v-model="selectedUser" :options="filterUserOptions" optionLabel="name" placeholder="Filter User" checkmark dropdownIcon="pi pi-filter" :highlightOnSelect="true" class="md:w-14rem mx-2" style="width: 30%" />
                        <Calendar v-focus class="mx-2" placeholder="Filter Date" showIcon icon="pi pi-filter" v-model="dates" selectionMode="range" :manualInput="false" />
                        <Button label="Export" icon="pi pi-upload" class="mx-2" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <div class="card">
                    <DataView :value="payrolls" paginator :rows="5">
                        <template #list="slotProps">
                            <div class="grid grid-nogutter">
                                <div v-for="item in payrolls" :key="item.id" class="col-12">
                                    <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3">
                                        <div class="md:w-10rem relative">
                                            <img class="block xl:block mx-auto border-round w-full" :src="`https://workplan-web.test/${item.user.profile_image}`" :alt="item.user.name" />
                                        </div>
                                        <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                                            <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                                <div>
                                                    <Badge
                                                        class="text-white"
                                                        :value="item.status == 0 ? 'Belum Ditransfer' : item.status == 1 ? 'Transfered' : 'Error'"
                                                        :severity="item.status == 0 ? 'warning' : item.status == 1 ? 'success' : 'danger'"
                                                    ></Badge>
                                                    <div class="text-lg font-medium text-900 mt-2">Nama Staff : {{ item.user.name }}</div>
                                                </div>
                                                <!-- <div class="surface-100 p-1" style="border-radius: 30px">
                                                    <div
                                                        class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2"
                                                        style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)"
                                                    >
                                                        <span class="text-900 font-medium text-sm">1</span>
                                                        <i class="pi pi-star-fill text-yellow-500"></i>
                                                    </div>
                                                </div> -->
                                            </div>
                                            <div class="flex flex-column md:align-items-end gap-5">
                                                <span class="text-xl font-semibold text-900">Rp.{{ item.cash_out }}</span>
                                                <div class="flex flex-row-reverse md:flex-row gap-2">
                                                    <Button @click="confirmDeletePayroll(item)" severity="danger" icon="pi pi-trash"></Button>
                                                    <Button @click="openEditModal(item)" icon="pi pi-money-bill" label="Transfer Gaji" :disabled="item.status == 1" class="flex-auto md:flex-initial white-space-nowrap"></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </DataView>
                </div>

                <!-- <div v-if="loading" class="loading-spinner">
                    <ProgressSpinner />
                </div> -->
            </div>

            <Dialog v-model:visible="deletePayrollDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="payroll"
                        >Are you sure you want to delete <b>{{ payroll.user.name }}</b
                        >?</span
                    >
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deletePayrollDialog = false" />
                    <Button label="Yes" icon="pi pi-check" text @click="deletePayroll" />
                </template>
            </Dialog>
            <Dialog v-model:visible="addModalTransfer" modal :header="isEditing ? 'Edit Payroll' : 'Add Payroll'" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <div class="formgrid grid p-fluid">
                    <div class="col-12 md:col-4">
                        <div class="field">
                            <label for="formname">Nama Staff</label>
                            <Dropdown v-model="selectedUserTransfer" :options="filterUserOptions" optionLabel="name" placeholder="Filter User" checkmark dropdownIcon="pi pi-filter" :highlightOnSelect="true" />
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field">
                            <label for="tanggal">Dari Tanggal</label>
                            <Calendar id="tanggal" v-model="formTransfer.dari_tanggal" />
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field">
                            <label for="tanggal">Sampai Tanggal</label>
                            <Calendar id="tanggal" v-model="formTransfer.sampai_tanggal" />
                        </div>
                    </div>

                    <div class="col-12 md:col-12">
                        <div class="field">
                            <Button @click.prevent="handleTransfer" severity="success" label="Transfer Gaji" type="submit" />
                        </div>
                    </div>
                    <!-- <div class="col-12 md:col-6">
                            <div class="field">
                                <Button @click.prevent="handleReject" severity="danger" label="Reject" type="submit" />
                            </div>
                        </div> -->
                </div>
            </Dialog>
            <Dialog v-model:visible="addModal" modal header="Transfer Gaji Bulanan / Mingguan" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <div class="formgrid grid p-fluid">
                    <div class="col-12 md:col-4">
                        <div class="field">
                            <label for="formname">Nama Staff</label>
                            <InputText id="formname" v-model="form.name" />
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field">
                            <label for="tanggal">Tanggal Payroll</label>
                            <Calendar id="tanggal" v-model="form.tanggal" />
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field">
                            <label for="cash_out">Nominal</label>
                            <InputText id="cash_out" v-model="form.cash_out" />
                        </div>
                    </div>
                    <!-- <div class="col-12 md:col-12">
                        <div class="field">
                            <label for="keterangan">Keterangan</label>
                            <Textarea v-model="form.keterangan" autoResize rows="5" cols="30" />
                        </div>
                    </div> -->
                    <div class="col-12 md:col-6">
                        <div class="field">
                            <Button @click.prevent="handleOneTransfer" severity="success" label="Transfer Gaji" type="submit" />
                        </div>
                    </div>
                    <!-- <div class="col-12 md:col-6">
                            <div class="field">
                                <Button @click.prevent="handleReject" severity="danger" label="Reject" type="submit" />
                            </div>
                        </div> -->
                </div>
            </Dialog>
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
