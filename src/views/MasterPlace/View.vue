<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { PlaceService } from '@/service/place/PlaceService';
import { useToast } from 'primevue/usetoast';
// import { ProgressSpinner } from 'primevue/progressspinner';

const toast = useToast();
const places = ref([]);
const deletePlaceDialog = ref(false);
const place = ref({});
const selectedPlaces = ref([]);
const dt = ref(null);
const filters = ref({});
const loading = ref(false);

const placeService = new PlaceService();

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    loading.value = true;
    try {
        const data = await placeService.getPlace();
        places.value = data.data; // Assuming response structure has a data field
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

// const editPlace = (editPlace) => {
//     place.value = { ...editPlace };
//     placeDialog.value = true;
// };

const confirmDeletePlace = (editPlace) => {
    place.value = editPlace;
    deletePlaceDialog.value = true;
};

const deletePlace = async () => {
    loading.value = true;
    try {
        await placeService.deletePlace(place.value.id);
        places.value = places.value.filter((val) => val.id !== place.value.id);
        deletePlaceDialog.value = false;
        place.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Place Deleted', life: 3000 });
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
                            <router-link to="/app/master/place/add" rel="noopener">
                                <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" />
                            </router-link>
                        </div>
                    </template>
                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="places"
                    v-model:selection="selectedPlaces"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} places"
                >
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama Tempat</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="latlon" header="Kordinat" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Kordinat</span>
                            {{ slotProps.data.latitude }} -
                            {{ slotProps.data.longitude }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editPlace(slotProps.data)" /> -->
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeletePlace(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deletePlaceDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="place"
                            >Are you sure you want to delete <b>{{ place.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deletePlaceDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deletePlace" />
                    </template>
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
