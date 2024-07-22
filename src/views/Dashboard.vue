<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { DashboardService } from '@/service/dashboard/DashboardService';
import { useToast } from 'primevue/usetoast';

const dashboardService = new DashboardService();
const totalStaff = ref(0);
const totalPlaces = ref(0);
const totalPayouts = ref(0);
const totalAdvances = ref(0);
const upcomingBirthdays = ref([]);
const toast = useToast();

const bUrl = 'https://workplan-web.test/';
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value);
};
const lineData = reactive({
    labels: [],
    datasets: [
        {
            label: 'Advance Overview',
            data: [],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'KPI Overview',
            data: [],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const fetchChartData = async () => {
    try {
        const response = await dashboardService.getChartData(); // Assume this is your API endpoint
        const { months, advances, performances } = response;

        lineData.labels = months;
        lineData.datasets[0].data = advances;
        lineData.datasets[1].data = performances;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch chart data',
            life: 3000
        });
    }
};

const fetchData = async () => {
    try {
        const [staffRes, placesRes, payoutsRes, advancesRes, birthdaysRes] = await Promise.all([
            dashboardService.getTotalStaff(),
            dashboardService.getTotalPlaces(),
            dashboardService.getTotalPayouts(),
            dashboardService.getTotalAdvances(),
            dashboardService.getUpcomingBirthday()
        ]);
        totalStaff.value = staffRes.totalStaff;
        totalPlaces.value = placesRes.totalPlaces;
        totalPayouts.value = payoutsRes.totalPayouts;
        totalAdvances.value = advancesRes.totalAdvances;
        upcomingBirthdays.value = birthdaysRes;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchChartData();
    fetchData();
    watch({ immediate: true });
});
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card shadow-2 mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Staff</span>
                        <div class="text-900 font-medium text-xl">{{ totalStaff }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-blue-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">24 new </span> -->
                <span class="text-500">Orang Staff</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card shadow-2 mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Cabang</span>
                        <div class="text-900 font-medium text-xl">{{ totalPlaces }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-green-500 font-medium">2 </span> -->
                <span class="text-500">Tempat</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card shadow-2 mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Payout</span>
                        <div class="text-900 font-medium text-xl">{{ formatCurrency(totalPayouts) }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-money-bill text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Rate </span>
                <span class="text-500">Per Month</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card shadow-2 mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Advance</span>
                        <div class="text-900 font-medium text-xl">{{ formatCurrency(totalAdvances) }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calculator text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Rate </span>
                <span class="text-500">Per Month</span>
            </div>
        </div>
        <div class="col-12 xl:col-12">
            <div class="card shadow-2">
                <h5>Advance & KPI Overview</h5>
                <Chart type="line" :data="lineData" :options="lineOptions" />
            </div>
        </div>

        <div class="col-12 xl:col-12">
            <div class="card shadow-2">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Ulang Tahun</h5>
                    <!-- <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items"></Menu>
                    </div> -->
                </div>

                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li v-for="birthday in upcomingBirthdays" :key="birthday.name" class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <!-- <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"> -->
                        <Avatar :image="`${bUrl + birthday.profile_image}`" class="mr-2" size="xlarge" shape="circle" />
                        <!-- </div> -->
                        <span class="text-900 line-height-3">
                            {{ birthday.name }}
                            <span class="text-700">
                                <span class="text-blue-500">{{ birthday.tgl_lahir }}</span>
                            </span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
