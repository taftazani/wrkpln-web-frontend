<template>
    <div>
        <h4>Informasi Paket</h4>
        <form @submit.prevent="nextStep">
            <div class="form-group">
                <label for="package">Select Package</label>
                <Dropdown id="package" v-model="form.package" :options="packages" optionLabel="label" required />
            </div>
            <Button type="submit" label="Next" />
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { RegistrationService } from '@/service/RegistrationService';

const registrationService = new RegistrationService();
const step3Data = ref({
    package_type_id: '',
    company_id: ''
});
const packages = ref([]);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);

onMounted(() => {
    step3Data.value.company_id = route.params.companyId;
    // Load packages from your API
});

const handleNext = async () => {
    loading.value = true;
    try {
        await registrationService.registerStep3(step3Data.value);
        router.push({ name: 'register-step4', params: { companyId: step3Data.value.company_id } });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Registration Failed', detail: error.message });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form-group {
    margin-bottom: 20px;
}
</style>
