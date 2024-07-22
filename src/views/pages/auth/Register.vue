<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { RegistrationService } from '@/service/RegistrationService';
import { useConfirm } from 'primevue/useconfirm';
import 'animate.css';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import InlineMessage from 'primevue/inlinemessage';
import Fieldset from 'primevue/fieldset';
import ConfirmDialog from 'primevue/confirmdialog';

const registrationService = new RegistrationService();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const activeStep = ref(0);
const loading = ref(false);
const dropdownPackageType = ref([]);
const errors = reactive({
    name: '',
    user_id: '',
    phone: '',
    email: '',
    password: '',
    company_name: '',
    company_phone: '',
    company_email: '',
    company_address: '',
    postal_code: '',
    user_count: '',
    package_type_id: '',
    agreement: ''
});

onMounted(async () => {
    loading.value = true;
    try {
        const dataPackages = await registrationService.getPackages();
        dropdownPackageType.value = dataPackages.data.map((packages) => ({
            label: packages.name,
            value: packages.id
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
        loading.value = false;
    }
});

const formData = reactive({
    step1: {
        name: '',
        user_id: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: ''
    },
    step2: {
        company_name: '',
        company_phone: '',
        company_email: '',
        company_address: '',
        postal_code: '',
        user_count: ''
    },
    step3: {
        package_type_id: ''
    },
    step4: {
        agreement: false
    }
});

const onlyNumbers = (step, field) => {
    formData[step][field] = formData[step][field].replace(/\D/g, '');
};
const handleSubmit = async () => {
    loading.value = true;
    try {
        const data = {
            ...formData.step1,
            ...formData.step2,
            package_type_id: formData.step3.package_type_id.value,
            agreement: formData.step4.agreement
        };
        const response = await registrationService.registerCompany(data);
        confirm.require({
            message: 'Silahkan Login Dengan Kredensial yang telah dibuat.',
            header: 'Pendaftaran Berhasil',
            icon: 'pi pi-check',
            accept: () => {
                router.push('/'); // Redirect to login page
            }
        });
    } catch (error) {
        if (error.message) {
            const backendErrors = JSON.parse(error.message);
            Object.keys(backendErrors).forEach((key) => {
                errors.name = JSON.stringify(backendErrors.message.name);
                errors.user_id = JSON.stringify(backendErrors.message.user_id);
                errors.phone = JSON.stringify(backendErrors.message.phone);
                errors.email = JSON.stringify(backendErrors.message.email);
                errors.password = JSON.stringify(backendErrors.message.password);
                errors.company_name = JSON.stringify(backendErrors.message.company_name);
                errors.company_phone = JSON.stringify(backendErrors.message.company_phone);
                errors.company_email = JSON.stringify(backendErrors.message.company_email);
                errors.company_address = JSON.stringify(backendErrors.message.company_address);
                errors.postal_code = JSON.stringify(backendErrors.message.postal_code);
                errors.user_count = JSON.stringify(backendErrors.message.user_count);
                errors.package_type_id = JSON.stringify(backendErrors.message.package_type_id);
                errors.agreement = JSON.stringify(backendErrors.message.agreement);
                // errors[key] = backendErrors.message; // Assign the first error message for each key
                // console.log(backendErrors.message.name[0]);
            });
            confirm.require({
                message: 'Terdapat Error, Silahkan Cek Kembali Form Anda',
                header: 'Pendaftaran Gagal',
                icon: 'pi pi-exclamation-triangle'
            });
        } else {
            confirm.require({
                message: JSON.stringify(error.message) || 'An unknown error occurred.',
                header: 'Pendaftaran Gagal',
                icon: 'pi pi-exclamation-triangle'
            });
        }
    } finally {
        loading.value = false;
    }
};

const handleNext = async () => {
    errors.value = {}; // Clear errors before moving to the next step
    if (activeStep.value < 3) {
        activeStep.value++;
    } else {
        await handleSubmit();
    }
    await nextTick();
    scrollToTop();
};

const handlePrev = async () => {
    if (activeStep.value > 0) {
        activeStep.value--;
    }
    await nextTick();
    scrollToTop();
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
    <div class="container">
        <ConfirmDialog />
        <Stepper v-model:activeIndex="activeStep" class="p-stepper">
            <StepperPanel header="Informasi User">
                <template #content="{ nextCallback }">
                    <Fieldset legend="Informasi User">
                        <div class="form-group" :class="{ 'p-invalid': errors.name }">
                            <label for="name">Nama Lengkap: </label>
                            <InputText class="w-full mb-3" id="name" v-model="formData.step1.name" :invalid="!!errors.name" />
                            <InlineMessage v-if="errors.name" severity="error">{{ errors.name }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.user_id }">
                            <label for="user_id">User ID: </label>
                            <InputText class="w-full mb-3" id="user_id" v-model="formData.step1.user_id" :invalid="!!errors.user_id" />
                            <InlineMessage v-if="errors.user_id" severity="error">{{ errors.user_id }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.phone }">
                            <label for="phone">Nomor Hp: </label>
                            <InputText class="w-full mb-3" id="phone" v-model="formData.step1.phone" @input="onlyNumbers('step1', 'phone')" :invalid="!!errors.phone" />
                            <InlineMessage v-if="errors.phone" severity="error">{{ errors.phone }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.email }">
                            <label for="email">Email: </label>
                            <InputText class="w-full mb-3" id="email" v-model="formData.step1.email" :invalid="!!errors.email" />
                            <InlineMessage v-if="errors.email" severity="error">{{ errors.email }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.password }">
                            <label for="password">Password: </label>
                            <Password :toggleMask="true" class="w-full mb-3" inputClass="w-full" id="password" v-model="formData.step1.password" :invalid="!!errors.password" />
                            <InlineMessage v-if="errors.password" severity="error">{{ errors.password }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.password_confirmation }">
                            <label for="password_confirmation">Confirm Password: </label>
                            <Password :toggleMask="true" class="w-full mb-3" inputClass="w-full" id="password_confirmation" v-model="formData.step1.password_confirmation" :invalid="!!errors.password_confirmation" />
                        </div>
                        <div class="flex pt-4 justify-content-end">
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                        </div>
                    </Fieldset>
                </template>
            </StepperPanel>

            <StepperPanel header="Informasi Perusahaan">
                <template #content="{ prevCallback, nextCallback }">
                    <Fieldset legend="Informasi Perusahaan">
                        <div class="form-group" :class="{ 'p-invalid': errors.company_name }">
                            <label for="company_name">Nama Perusahaan: </label>
                            <InputText class="w-full mb-3" id="company_name" v-model="formData.step2.company_name" :invalid="!!errors.company_name" />
                            <InlineMessage v-if="errors.company_name" severity="error">{{ errors.company_name }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.company_phone }">
                            <label for="company_phone">Nomor Telfon Perusahaan: </label>
                            <InputText class="w-full mb-3" id="company_phone" v-model="formData.step2.company_phone" @input="onlyNumbers('step2', 'company_phone')" :invalid="!!errors.company_phone" />
                            <InlineMessage v-if="errors.company_phone" severity="error">{{ errors.company_phone }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.company_email }">
                            <label for="company_email">Email Perusahaan: </label>
                            <InputText class="w-full mb-3" id="company_email" v-model="formData.step2.company_email" :invalid="!!errors.company_email" />
                            <InlineMessage v-if="errors.company_email" severity="error">{{ errors.company_email }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.company_address }">
                            <label for="company_address">Alamat Perusahaan: </label>
                            <InputText class="w-full mb-3" id="company_address" v-model="formData.step2.company_address" :invalid="!!errors.company_address" />
                            <InlineMessage v-if="errors.company_address" severity="error">{{ errors.company_address }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.postal_code }">
                            <label for="postal_code">Kode Pos: </label>
                            <InputText class="w-full mb-3" id="postal_code" v-model="formData.step2.postal_code" @input="onlyNumbers('step2', 'postal_code')" :invalid="!!errors.postal_code" />
                            <InlineMessage v-if="errors.postal_code" severity="error">{{ errors.postal_code }} </InlineMessage>
                        </div>
                        <div class="form-group" :class="{ 'p-invalid': errors.user_count }">
                            <label for="user_count">Jumlah Pengguna: </label>
                            <InputText class="w-full mb-3" id="user_count" v-model="formData.step2.user_count" @input="onlyNumbers('step2', 'user_count')" :invalid="!!errors.user_count" />
                            <InlineMessage v-if="errors.user_count" severity="error">{{ errors.user_count }} </InlineMessage>
                        </div>
                        <div class="flex pt-4 justify-content-between">
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                        </div>
                    </Fieldset>
                </template>
            </StepperPanel>

            <StepperPanel header="Informasi Paket">
                <template #content="{ prevCallback, nextCallback }">
                    <Fieldset legend="Informasi Paket">
                        <div class="form-group" :class="{ 'p-invalid': errors.package_type_id }">
                            <label for="package_type_id">Pilih Paket: </label>
                            <Dropdown class="w-full mb-3" id="package_type_id" v-model="formData.step3.package_type_id" :options="dropdownPackageType" optionLabel="label" placeholder="Select One" :invalid="!!errors.package_type_id" />
                            <InlineMessage v-if="errors.package_type_id" severity="error">{{ errors.package_type_id }} </InlineMessage>
                        </div>
                        <div class="flex pt-4 justify-content-between">
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                        </div>
                    </Fieldset>
                </template>
            </StepperPanel>

            <StepperPanel header="Persetujuan dan Konfirmasi">
                <template #content="{ prevCallback }">
                    <Fieldset legend="Persetujuan dan Konfirmasi">
                        <div class="form-group" :class="{ 'p-invalid': errors.agreement }">
                            <label>Dengan memberikan konfirmasi perjanjian di bawah ini maka anda dianggap telah menyetujui proses register perusahaan di aplikasi ini dan mematuhi seluruh ketentuan yang berlaku dalam PKS.</label>
                        </div>
                        <div class="form-group">
                            <label class="agreement-label"> <Checkbox v-model="formData.step4.agreement" binary :invalid="!!errors.agreement" /> I agree to the terms and conditions</label>
                            <InlineMessage v-if="errors.agreement" severity="error">{{ errors.agreement }} </InlineMessage>
                        </div>
                        <div class="flex pt-4 justify-content-between">
                            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                            <Button label="Submit" @click="handleSubmit" :loading="loading" />
                        </div>
                    </Fieldset>
                </template>
            </StepperPanel>
        </Stepper>
    </div>
    <Toast />
</template>

<style scoped>
.container {
    max-width: 1000px;
    margin: auto;
    padding: 20px;
}

.title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
}

.form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

/* .form-group input,
.form-group .p-inputtext,
.form-group .p-password input,
.form-group .p-dropdown {
    display: block;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
} */

/* .form-group .p-invalid input,
.form-group .p-invalid .p-inputtext,
.form-group .p-invalid .p-password input,
.form-group .p-invalid .p-dropdown {
    border-color: #dc3545;
} */

/* .form-group .p-error {
    display: block;
    color: #dc3545;
    margin-top: 0.25rem;
} */

/* .agreement-label {
    margin-left: 8px;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.flex {
    display: flex;
}

.justify-content-end {
    justify-content: flex-end;
}

.justify-content-between {
    justify-content: space-between;
}

.justify-content-start {
    justify-content: flex-start;
}

.pt-4 {
    padding-top: 1rem;
} */
</style>
