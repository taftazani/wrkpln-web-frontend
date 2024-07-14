<script>
export default {
    props: {
        title: String,
        value: [String, Number],
        icon: String,
        backgroundColor: String,
        iconColor: String,
        period: String,
        classs: String
    }
};
</script>

<template>
    <div :class="classs">
        <div class="card shadow-2 mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-500 font-medium mb-3">{{ title }}</span>
                    <div class="text-900 font-medium text-xl">{{ value }}</div>
                </div>
                <div :class="`flex align-items-center justify-content-center ${backgroundColor} border-round`" style="width: 2.5rem; height: 2.5rem">
                    <i :class="`pi ${icon} ${iconColor} text-xl`"></i>
                </div>
            </div>
            <span class="text-green-500 font-medium">{{ period }}</span>
        </div>
    </div>
</template>

<style scoped>
/* Add any custom styles if needed */
</style>
