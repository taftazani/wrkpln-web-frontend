<template>
    <div v-if="formattedMessages.length" class="error-message-container">
        <div class="error-message" v-for="(message, index) in formattedMessages" :key="index"><span class="error-icon">⚠️</span> {{ message }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    errors: {
        type: Object,
        required: true
    }
});

const formattedMessages = computed(() => {
    return Object.entries(props.errors || {}).flatMap(([field, messages]) => {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        return messages.map((message) => {
            if (field === 'name') return `Name: ${message}`;
            if (field === 'user_id') return `User ID: ${message}`;
            if (field === 'phone') return `Phone Number: ${message}`;
            if (field === 'email') return `Email: ${message}`;
            if (field === 'password') return `Password: ${message}`;
            if (field === 'password_confirmation') return `Confirm Password: ${message}`;
            if (field === 'company_name') return `Company Name: ${message}`;
            if (field === 'company_phone') return `Company Phone: ${message}`;
            if (field === 'company_email') return `Company Email: ${message}`;
            if (field === 'company_address') return `Company Address: ${message}`;
            if (field === 'postal_code') return `Postal Code: ${message}`;
            if (field === 'user_count') return `User Count: ${message}`;
            if (field === 'package_type_id') return `Package Selection: ${message}`;
            if (field === 'agreement') return `Agreement: ${message}`;
            return message; // fallback for any other errors
        });
    });
});
</script>

<style scoped>
.error-message-container {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    animation: fadeIn 0.5s ease;
}

.error-message {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.error-icon {
    margin-right: 10px;
    font-size: 1.2em;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
