<script setup>
import { onMounted, ref, watch } from 'vue';
import { KpiService } from '@/service/kpi/KpiService';
import { useToast } from 'primevue/usetoast';

const kpiService = new KpiService();
const dates = ref(null);
const formAdd = ref([]);
const addDialog = ref(false);
const filterUserOptions = ref([]);
const filterKpiOptions = ref([]);
const kpiAspects = ref([]);
const kpiData = ref({});
const selectedUser = ref(null);
const toast = useToast();

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

const fetchKpiAspects = async () => {
    try {
        const response = await kpiService.getKpiAspects();
        if (response.status) {
            kpiAspects.value = response.data;
            filterKpiOptions.value = response.data.map((aspect) => ({
                name: aspect.name,
                id: aspect.id
            }));
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch KPI aspects', life: 3000 });
    }
};

const fetchKpiData = async () => {
    if (!selectedUser.value) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a user', life: 3000 });
        return;
    }

    try {
        const params = {
            user_id: selectedUser.value.id,
            start_date: dates.value ? formatDate(dates.value[0]) : null,
            end_date: dates.value ? formatDate(dates.value[1]) : null
        };
        const response = await kpiService.getKpi(params);

        if (response.status) {
            kpiData.value = response.data.reduce((acc, kpi) => {
                if (kpi.aspect) {
                    if (!acc[kpi.aspect.name]) {
                        acc[kpi.aspect.name] = [];
                    }
                    acc[kpi.aspect.name].push(kpi);
                }
                return acc;
            }, {});
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch KPI data', life: 3000 });
    }
};

const getLineData = (aspectName) => {
    const data = kpiData.value[aspectName] || [];

    // Get the start and end dates from the dates filter
    const startDate = dates.value ? new Date(dates.value[0]) : null;
    const endDate = dates.value ? new Date(dates.value[1]) : null;

    // Filter data based on the selected date range
    const filteredData = data.filter((kpi) => {
        const kpiDate = new Date(kpi.period);
        if (startDate && endDate) {
            return kpiDate >= startDate && kpiDate <= endDate;
        } else if (startDate) {
            return kpiDate >= startDate;
        } else if (endDate) {
            return kpiDate <= endDate;
        }
        return true;
    });

    return {
        labels: filteredData.map((kpi) => kpi.period),
        datasets: [
            {
                label: aspectName,
                data: filteredData.map((kpi) => kpi.rate),
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            }
        ]
    };
};
const calculateAspectPercentage = (aspectName) => {
    const data = kpiData.value[aspectName] || [];

    // Get the start and end dates from the dates filter
    const startDate = dates.value ? new Date(dates.value[0]) : null;
    const endDate = dates.value ? new Date(dates.value[1]) : null;

    // Filter data based on the selected date range
    const filteredData = data.filter((kpi) => {
        const kpiDate = new Date(kpi.period);
        if (startDate && endDate) {
            return kpiDate >= startDate && kpiDate <= endDate;
        } else if (startDate) {
            return kpiDate >= startDate;
        } else if (endDate) {
            return kpiDate <= endDate;
        }
        return true;
    });

    if (filteredData.length === 0) {
        return '0%';
    }
    const totalRate = filteredData.reduce((sum, kpi) => sum + parseFloat(kpi.rate), 0);
    const averageRate = totalRate / filteredData.length;
    return `${averageRate.toFixed(2)}%`;
};

const handleAdd = async () => {
    try {
        const formData = new FormData();
        formData.append('user_id', formAdd.value.user_id.id);
        formData.append('aspect_id', formAdd.value.aspect_id.id);
        formData.append('rate', formAdd.value.rate);
        formData.append('period', formatDate(formAdd.value.period));
        const response = await kpiService.createKpi(formData);
        if (response.status) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: response.message, life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
const clearFilters = () => {
    kpiData.value = null;
    dates.value = [new Date(), new Date()];
};
onMounted(() => {
    fetchUserList();
    fetchKpiAspects();
});

watch([selectedUser, dates], fetchKpiData);
</script>

<template>
    <Toolbar class="mb-5">
        <template #start>
            <Button @click="addDialog = true" label="Add KPI" icon="pi pi-plus" class="mr-2" severity="success" />
            <!-- <Button icon="pi pi-print" class="mr-2" severity="success" />
            <Button icon="pi pi-upload" severity="success" /> -->
        </template>
        <template #end>
            <Dropdown v-model="selectedUser" :options="filterUserOptions" optionLabel="name" placeholder="Filter User" checkmark dropdownIcon="pi pi-filter" :highlightOnSelect="true" class="md:w-14rem ml-5" style="width: 30%" />
            <Calendar class="ml-5" placeholder="Filter Date" showIcon icon="pi pi-filter" v-model="dates" selectionMode="range" :manualInput="false" />
            <Button class="ml-5" :autofocus="false" label="Clear Filters" icon="pi pi-filter-slash" @click="clearFilters"
        /></template>
    </Toolbar>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6" v-for="aspect in kpiAspects" :key="aspect.id">
            <div class="grid">
                <div class="col-12 lg:col-12 xl:col-12">
                    <div class="card shadow-2 mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">{{ aspect.name }}</span>
                                <div class="text-900 font-medium text-xl">{{ calculateAspectPercentage(aspect.name) }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-chart-bar text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-green-500 font-medium">Average on % </span>
                        <!-- <span class="text-500">since last visit</span> -->
                    </div>
                </div>

                <div class="col-12 lg:col-12 xl:col-12">
                    <div class="card shadow-2">
                        <h5>{{ aspect.name }} Overview</h5>
                        <Chart type="line" :data="getLineData(aspect.name)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="addDialog" modal :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="formgrid grid p-fluid">
            <div class="col-12 md:col-6 xl:col-6">
                <div class="field">
                    <label for="">Pilih Staff</label>
                    <Dropdown v-model="formAdd.user_id" :options="filterUserOptions" optionLabel="name" checkmark dropdownIcon="pi pi-user" :highlightOnSelect="true" />
                </div>
            </div>
            <div class="col-12 md:col-6 xl:col-6">
                <div class="field">
                    <label for="">Pilih Aspect</label>
                    <Dropdown v-model="formAdd.aspect_id" :options="filterKpiOptions" optionLabel="name" checkmark dropdownIcon="pi pi-chart-pie" :highlightOnSelect="true" />
                </div>
            </div>
            <div class="col-12 md:col-6 xl:col-6">
                <div class="field">
                    <label for="">Nilai</label>
                    <InputText v-model="formAdd.rate" />
                </div>
            </div>
            <div class="col-12 md:col-6 xl:col-6">
                <div class="field">
                    <label for="">Tanggal</label>
                    <Calendar showIcon icon="pi pi-calendar" v-model="formAdd.period" :manualInput="false" />
                </div>
            </div>
            <div class="col-12 md:col-12 xl:col-6">
                <div class="field">
                    <Button label="Create" severity="succes" @click.prevent="handleAdd" />
                </div>
            </div>
        </div>
    </Dialog>
</template>
