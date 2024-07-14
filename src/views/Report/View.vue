<script>
import { ref, watch, onMounted, computed } from 'vue';
import { ReportService } from '@/service/report/ReportService';
import ReportCard from '@/components/ReportCard.vue';
import { KpiService } from '@/service/kpi/KpiService';

const kpiService = new KpiService();
const reportService = new ReportService();
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};

export default {
    components: {
        ReportCard
    },
    setup() {
        const selectedUser = ref(null);
        const dateRange = ref([new Date(), new Date()]); // Only date range needed
        const filterUserOptions = ref([]);
        const salaryAverage = ref(0);
        const advanceAverage = ref(0);
        const totalAbsensi = ref(0);
        const totalIzin = ref(0);
        const totalLembur = ref(0);
        const totalTidakMasuk = ref(0);

        const fetchFilteredReport = async () => {
            if (selectedUser.value) {
                try {
                    const payload = {
                        user_id: selectedUser.value.id,
                        start_date: formatDate(dateRange.value[0]),
                        end_date: formatDate(dateRange.value[1])
                    };

                    const response = await reportService.getReport(payload);
                    const data = response.data;
                    salaryAverage.value = data.salary.reduce((acc, curr) => acc + parseFloat(curr.cash_out), 0);
                    advanceAverage.value = data.advance.reduce((acc, curr) => acc + parseFloat(curr.cash_out), 0);
                    totalAbsensi.value = data.absensi.length;
                    totalIzin.value = data.izin.length;
                    totalLembur.value = data.lembur.length;
                    totalTidakMasuk.value = data.tidak_masuk.length;
                } catch (error) {
                    console.error('Error fetching filtered report:', error);
                }
            }
        };

        const clearFilters = () => {
            selectedUser.value = null;
            dateRange.value = [new Date(), new Date()];
        };

        watch([selectedUser, dateRange], fetchFilteredReport);

        onMounted(async () => {
            try {
                const response = await kpiService.getUser();
                if (response.status) {
                    filterUserOptions.value = response.data.map((user) => ({
                        name: user.name,
                        id: user.id
                    }));
                }
            } catch (error) {
                console.error('Error fetching user options:', error);
            }
        });
        const getPeriodLabel = computed(() => {
            const startDate = new Date(dateRange.value[0]);
            const endDate = new Date(dateRange.value[1]);
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    return `${startDate.getFullYear()}, ${startDate.toLocaleString('default', { month: 'long' })}`;
                } else {
                    return `${startDate.toLocaleString('default', { month: 'long' })} - ${endDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
                }
            } else {
                return `${startDate.getFullYear()} - ${endDate.getFullYear()}`;
            }
        });
        return {
            selectedUser,
            dateRange,
            filterUserOptions,
            salaryAverage,
            advanceAverage,
            totalAbsensi,
            totalIzin,
            totalLembur,
            totalTidakMasuk,
            formatCurrency,
            clearFilters,
            getPeriodLabel
        };
    }
};
</script>

<template>
    <Toolbar class="mb-5">
        <template #start>
            <Dropdown v-model="selectedUser" :options="filterUserOptions" optionLabel="name" placeholder="Filter User" checkmark dropdownIcon="pi pi-filter" :highlightOnSelect="true" class="md:w-14rem" style="width: 30%" />
            <Calendar class="ml-5" placeholder="Filter Date Range" showIcon icon="pi pi-filter" selectionMode="range" v-model="dateRange" :manualInput="false" />
            <label class="ml-3">Date Range</label>
        </template>
        <template #end>
            <Button label="Clear Filters" icon="pi pi-times" class="p-button-secondary" @click="clearFilters" />
        </template>
    </Toolbar>
    <div class="grid">
        <ReportCard class="col-6" title="Salary Average" :value="formatCurrency(salaryAverage)" icon="pi pi-user" backgroundColor="bg-blue-100" iconColor="text-blue-500" :period="getPeriodLabel" />
        <ReportCard class="col-6" title="Advance Average" :value="formatCurrency(advanceAverage)" icon="pi pi-user" backgroundColor="bg-blue-100" iconColor="text-blue-500" :period="getPeriodLabel" />
        <ReportCard class="col-3" title="Total Absensi" :value="totalAbsensi" icon="pi pi-user" backgroundColor="bg-blue-100" iconColor="text-blue-500" :period="getPeriodLabel" />
        <ReportCard class="col-3" title="Total Izin" :value="totalIzin" icon="pi pi-map-marker" backgroundColor="bg-orange-100" iconColor="text-orange-500" :period="getPeriodLabel" />
        <ReportCard class="col-3" title="Total Lembur" :value="totalLembur" icon="pi pi-money-bill" backgroundColor="bg-cyan-100" iconColor="text-cyan-500" :period="getPeriodLabel" />
        <ReportCard class="col-3" title="Total Terlambat" :value="totalTidakMasuk" icon="pi pi-calculator" backgroundColor="bg-purple-100" iconColor="text-purple-500" :period="getPeriodLabel" />
    </div>
</template>

<style scoped></style>
