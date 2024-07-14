<script setup>
import { ref, computed } from 'vue';

import { login } from '@/service/authService';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
const email = ref('');
const password = ref('');
// const checked = ref(false);
const router = useRouter();
const toast = useToast();
const loading = ref(false);

const logoUrl = computed(() => {
    return `/layout/images/logo.png`;
});

const handleLogin = async () => {
    if (email.value === '' || password.value === '') {
        toast.add({ severity: 'error', summary: 'Validation Failed', detail: 'Email and Password are required', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await login(email.value, password.value);
        router.push('/app/dashboard');
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
                        <!-- <div class="text-900 text-3xl font-medium mb-3">Coffelabs Back Office</div> -->
                        <!-- <span class="text-600 font-medium">Sign in to continue</span> -->
                    </div>
                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password :feedback="false" id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" />

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <!-- <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2" />
                                <label for="rememberme1">Remember me</label>
                            </div> -->
                            <!-- <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Sign Up Here</a>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a> -->
                        </div>
                        <Button :loading="loading" label="Sign In" class="w-full p-3 text-xl" @click="handleLogin" />
                        <!-- <ProgressSpinner class="text-center" v-if="loading" style="width: 50px; height: 50px; margin-top: 10px" /> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Toast />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
