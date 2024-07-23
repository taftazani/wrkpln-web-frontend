<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { GeneralService } from '@/service/Core/GeneralService';

const toast = useToast();
const loginTimeout = ref(null);
const workdays = ref([]);
const generalService = new GeneralService();

onMounted(async () => {
    await loadSettings();
});

const loadSettings = async () => {
    const response = await generalService.getSettings();
    if (response.status) {
        loginTimeout.value = Number(response.data.loginTimeout.timeout_hours); // Ensure it's a number
        workdays.value = response.data.workdays.map((day) => ({
            ...day,
            is_workday: day.is_workday == '1' || day.is_workday == 1 // Ensure boolean type
        }));
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const updateLoginTimeout = async () => {
    const response = await generalService.updateLoginTimeout({ timeout_hours: loginTimeout.value });
    if (response.status) {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Login timeout updated successfully', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const updateWorkday = async (day) => {
    const payload = { is_workday: day.is_workday ? 0 : 1 }; // Convert boolean to integer
    const response = await generalService.updateWorkday(day.id, payload);
    if (response.status) {
        // Update the state immediately
        const updatedDay = {
            ...response.data,
            is_workday: response.data.is_workday == 1 // Convert integer to boolean
        };
        const index = workdays.value.findIndex((d) => d.id == day.id);
        if (index !== -1) {
            workdays.value[index] = updatedDay;
        }
        toast.add({ severity: 'success', summary: 'Success', detail: `Workday for ${day.day} updated successfully`, life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
    }
};

const handleWorkdayChange = async (day) => {
    try {
        day.is_workday = !day.is_workday; // Toggle the workday status
        await updateWorkday(day); // Update the workday status on the server
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>General Settings</h3>

                <!-- Login Timeout Section -->
                <div class="field">
                    <label for="login-timeout">Login Timeout (hours)</label>
                    <InputNumber id="login-timeout" v-model.number="loginTimeout" :min="1" :max="24" />
                    <Button label="Update Login Timeout" class="mt-2" @click="updateLoginTimeout" />
                </div>

                <!-- Workdays Section -->
                <h4>Workdays</h4>
                <div class="card flex flex-wrap justify-content-center gap-3">
                    <div v-for="day in workdays" :key="day.id" class="flex align-items-center">
                        <Checkbox binary="true" v-model="day.is_workday" @change="() => handleWorkdayChange(day)" />
                        <label class="ml-2">{{ day.day }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
