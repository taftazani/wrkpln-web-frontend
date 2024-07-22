<template>
    <div>
        <h4>Informasi User (Super Admin)</h4>
        <form @submit.prevent="nextStep">
            <div class="form-group">
                <label for="name">Nama Lengkap</label>
                <InputText id="name" v-model="form.name" required />
            </div>
            <div class="form-group">
                <label for="user_id">User ID</label>
                <InputText id="user_id" v-model="form.user_id" required />
            </div>
            <div class="form-group">
                <label for="phone">Nomor HP</label>
                <InputText id="phone" v-model="form.phone" required />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <InputText id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <Password id="password" v-model="form.password" required />
            </div>
            <div class="form-group">
                <label for="password_confirmation">Konfirmasi Password</label>
                <Password id="password_confirmation" v-model="form.password_confirmation" required />
            </div>
            <Button type="submit" label="Next" />
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { RegistrationService } from '@/service/registrationService';

const registrationService = new RegistrationService();
const form = ref({
    name: '',
    user_id: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: ''
});
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const handleNext = async () => {
    loading.value = true;
    try {
        const response = await registrationService.registerStep1(step1Data.value);
        router.push({ name: 'register-step2', params: { userId: response.user_id } });
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
