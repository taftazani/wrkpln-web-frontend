<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { PlaceService } from '@/service/place/placeService.js';
import { useRouter } from 'vue-router';

import L from 'leaflet';
import 'leaflet.locatecontrol'; // Import plugin
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'; // Import styles

const toast = useToast();
const router = useRouter();

const placeService = new PlaceService();
const map = ref(null);
const greenIcon = new L.icon({ iconUrl: '/layout/images/logo-dark.svg' });
const form = reactive({
    name: '',
    radius: '',
    work_hour: '',
    latitude: '',
    longitude: ''
});
const handleSubmit = async () => {
    try {
        const data = await placeService.createPlace(form);

        if (data.status == false) {
            if (data.data.name) {
                toast.add({ severity: 'error', summary: 'Error Adding Place', detail: data.data.name.toString(), life: 3000 });
            }
            if (data.data.latitude) {
                toast.add({ severity: 'error', summary: 'Error Adding Place', detail: data.data.latitude.toString(), life: 3000 });
            }
            if (data.data.longitude) {
                toast.add({ severity: 'error', summary: 'Error Adding Place', detail: data.data.longitude.toString(), life: 3000 });
            }
            if (data.data.work_hour) {
                toast.add({ severity: 'error', summary: 'Error Adding Place', detail: data.data.work_hour.toString(), life: 3000 });
            }
            if (data.data.radius) {
                toast.add({ severity: 'error', summary: 'Error Adding Place', detail: data.data.radius.toString(), life: 3000 });
            }
            toast.add({ severity: 'error', summary: 'Error Adding Place', detail: data.message, life: 3000 });
        } else {
            toast.add({ severity: 'success', summary: 'Success Adding Place', detail: data.message, life: 3000 });
            router.push('/app/master/place');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
    // toast.add({ severity: 'success', summary: 'Success Message', detail: 'Form submitted successfully', life: 3000 });
    console.log(form);
};
onMounted(async () => {
    if (navigator.geolocation) {
        map.value = L.map('colabs-map').setView([-6.2244443473916045, 106.93387424690953], 90);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map.value);

        // Fetch data from your place service
        const response = await placeService.getPlace();
        const places = response.data;
        toast.add({ severity: 'success', summary: 'Success Get Place', detail: response.message, life: 3000 });

        // Iterate over the data and add markers to the map
        places.forEach((place) => {
            L.marker([place.latitude, place.longitude], { icon: greenIcon }).addTo(map.value).bindPopup(`<b>${place.name}</b><br>Radius: ${place.radius}<br>Work Hour: ${place.work_hour}`);
        });

        map.value.on('click', function (e) {
            form.latitude = e.latlng.lat;
            form.longitude = e.latlng.lng;
        });
        L.control
            .locate({
                position: 'topright',
                strings: {
                    title: 'Show me where I am'
                },
                locateOptions: {
                    enableHighAccuracy: true
                }
            })
            .addTo(map.value);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
</script>
<template>
    <div className="card ">
        <h5>Add Place</h5>
        <p>Click the map for the location pin.</p>
        <div class="grid">
            <div class="col-12 md:col-6">
                <div class="card shadow-2">
                    <div id="colabs-map" style="width: 100%; height: 500px"></div>
                </div>
            </div>

            <div class="col-12 md:col-6">
                <div class="card shadow-2 p-fluid">
                    <h5>Form Add</h5>
                    <form @submit.prevent="handleSubmit">
                        <div class="field">
                            <label for="name">Nama Tempat Kerja</label>
                            <InputText id="name" v-model="form.name" type="text" />
                        </div>
                        <div class="field">
                            <label for="radius">Radius</label>
                            <InputText id="radius" v-model="form.radius" type="text" />
                        </div>
                        <div class="field">
                            <label for="work_hour">Jam Kerja</label>
                            <InputText id="work_hour" v-model="form.work_hour" type="text" />
                        </div>
                        <div class="field">
                            <label for="latitude">Latitude</label>
                            <InputText id="latitude" disabled v-model="form.latitude" type="text" />
                        </div>
                        <div class="field">
                            <label for="longitude">Longitude</label>
                            <InputText id="longitude" disabled v-model="form.longitude" type="text" />
                        </div>
                        <div class="field">
                            <Button label="Submit" type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
