<script setup>
import { ref, computed } from 'vue';
import { login, sendOtp } from '@/service/authService';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';

const emailOrUserId = ref('');
const password = ref('');
const companyCode = ref('');
const router = useRouter();
const toast = useToast();
const loading = ref(false);

const logoUrl = computed(() => {
    return `/layout/images/logo.png`;
});

const handleLogin = async () => {
    if (emailOrUserId.value == '' || password.value == '' || companyCode.value == '') {
        toast.add({ severity: 'error', summary: 'Validation Failed', detail: 'Email/User ID, Password, and Company Code are required', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await login(emailOrUserId.value, password.value, companyCode.value);
        await sendOtp();
        router.push('/otp');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Login Failed', detail: error.message });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div>
                <div class="w-full surface-card shadow-2 py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img :src="logoUrl" alt="Image" height="150" class="mb-3" />
                    </div>
                    <div>
                        <label for="emailOrUserId" class="block text-900 text-xl font-medium mb-2">Email/User ID</label>
                        <InputText id="emailOrUserId" type="text" placeholder="Email address or User ID" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="emailOrUserId" />
                        <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password :feedback="false" id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" />
                        <label for="companyCode" class="block text-900 text-xl font-medium mb-2">Company Code</label>
                        <InputText id="companyCode" type="text" placeholder="Company Code" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="companyCode" />
                        <Button :loading="loading" label="Sign In" class="w-full p-3 text-xl" @click="handleLogin" />
                        <div class="text-center mt-3">
                            <router-link to="register-company">Register Company</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast />
</template>

<style scoped></style>
