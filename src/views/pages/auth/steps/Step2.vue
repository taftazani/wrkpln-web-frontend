<template>
    <div>
        <h4>Informasi Perusahaan</h4>
        <form @submit.prevent="nextStep">
            <div class="form-group">
                <label for="company_name">Nama Perusahaan</label>
                <InputText id="company_name" v-model="form.company_name" required />
            </div>
            <div class="form-group">
                <label for="company_code">Kode Perusahaan (system generated)</label>
                <InputText id="company_code" v-model="form.company_code" readonly />
            </div>
            <div class="form-group">
                <label for="company_phone">Nomor Telepon Perusahaan</label>
                <InputText id="company_phone" v-model="form.company_phone" required />
            </div>
            <div class="form-group">
                <label for="company_email">Email Perusahaan</label>
                <InputText id="company_email" v-model="form.company_email" required />
            </div>
            <div class="form-group">
                <label for="company_address">Alamat Perusahaan</label>
                <InputText id="company_address" v-model="form.company_address" required />
            </div>
            <div class="form-group">
                <label for="postal_code">Kode Pos Perusahaan</label>
                <InputText id="postal_code" v-model="form.postal_code" required />
            </div>
            <div class="form-group">
                <label for="user_count">Jumlah Pengguna</label>
                <InputText id="user_count" v-model="form.user_count" required />
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
const step2Data = ref({
    company_name: '',
    company_phone: '',
    company_email: '',
    company_address: '',
    postal_code: '',
    user_count: '',
    user_id: ''
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);

onMounted(() => {
    step2Data.value.user_id = route.params.userId;
});

const handleNext = async () => {
    loading.value = true;
    try {
        const response = await registrationService.registerStep2(step2Data.value);
        router.push({ name: 'register-step3', params: { companyId: response.company_id } });
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
