<template>
    <div>
        <h4>Persetujuan dan Konfirmasi</h4>
        <form @submit.prevent="submit">
            <div class="form-group">
                <p>Dengan memberikan konfirmasi perjanjian di bawah ini maka anda dianggap telah menyetujui proses register perusahaan di aplikasi ini dan mematuhi seluruh ketentuan yang berlaku dalam PKS.</p>
                <label> <input type="checkbox" v-model="form.agreement" required /> Menerima Perjanjian </label>
            </div>
            <Button type="submit" label="Submit" />
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { RegistrationService } from '@/service/RegistrationService';

const registrationService = new RegistrationService();
const step4Data = ref({
    company_id: '',
    agreement: false
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref(false);

onMounted(() => {
    step4Data.value.company_id = route.params.companyId;
});

const handleSubmit = async () => {
    if (!step4Data.value.agreement) {
        toast.add({ severity: 'error', summary: 'Agreement Required', detail: 'You must accept the agreement' });
        return;
    }

    loading.value = true;
    try {
        await registrationService.registerStep4(step4Data.value);
        toast.add({ severity: 'success', summary: 'Registration Complete', detail: 'Company registered successfully' });
        router.push('/');
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
