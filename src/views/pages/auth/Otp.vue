<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { verifyOtp, sendOtp } from '@/service/authService';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';

const otp = ref('');
const loading = ref(false);
const resendLoading = ref(false);
const canResendOtp = ref(true);
const resendTimeout = ref(0);
const router = useRouter();
const toast = useToast();

const handleVerifyOtp = async () => {
    if (otp.value === '') {
        toast.add({ severity: 'error', summary: 'Validation Failed', detail: 'OTP is required', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await verifyOtp(otp.value);
        router.push('/app/dashboard');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'OTP Verification Failed', detail: error.message });
    } finally {
        loading.value = false;
    }
};

const handleResendOtp = async () => {
    if (!canResendOtp.value) return;

    resendLoading.value = true;
    try {
        await sendOtp();
        startResendTimeout();
        toast.add({ severity: 'success', summary: 'OTP Sent', detail: 'A new OTP has been sent to your email', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Resend OTP Failed', detail: error.message });
    } finally {
        resendLoading.value = false;
    }
};

const startResendTimeout = () => {
    canResendOtp.value = false;
    resendTimeout.value = 60; // 60 seconds timeout, adjust as needed
    const interval = setInterval(() => {
        if (resendTimeout.value > 0) {
            resendTimeout.value -= 1;
        } else {
            canResendOtp.value = true;
            clearInterval(interval);
        }
    }, 1000);
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <div class="card"> -->
            <div class="w-full surface-card shadow-2 py-8 px-5 sm:px-8" style="border-radius: 20px; max-width: 400px">
                <div class="text-center mb-5">
                    <h2 class="text-3xl font-bold">Enter OTP</h2>
                </div>
                <div>
                    <label for="otp" class="block text-900 text-xl font-medium mb-2">OTP</label>
                    <InputText id="otp" type="text" placeholder="Enter OTP" class="w-full mb-5 p-inputtext-lg" v-model="otp" />
                    <Button :loading="loading" label="Verify OTP" class="w-full p-3 text-xl p-button-rounded p-button-success" @click="handleVerifyOtp" />
                    <Button :loading="resendLoading" :disabled="!canResendOtp" label="Resend OTP" class="w-full p-3 text-xl p-button-rounded p-button-secondary mt-3" @click="handleResendOtp" />
                    <ProgressBar v-if="!canResendOtp" :value="((60 - resendTimeout) / 60) * 100" class="mt-3" />
                    <p v-if="!canResendOtp" class="mt-3 text-center text-700">You can resend OTP in {{ resendTimeout }} seconds</p>
                </div>
            </div>
            <!-- </div> -->
        </div>
    </div>
    <Toast />
</template>

<style scoped>
.card {
    background-color: #fff;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
