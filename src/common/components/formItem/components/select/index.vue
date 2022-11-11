<template>
    <a-select v-model="formValues[id]" placeholder="Please select ...">
        <a-option v-for="(item, index) of config!.options" :key="item.name">
            {{ item.value }}
        </a-option>
    </a-select>
</template>
 
<script setup lang="ts">
import { toRefs } from 'vue';
import type { FormItemT } from '../../index.vue';

const props = defineProps<{ formValues: any, formData: FormItemT }>();
const { formValues, formData } = toRefs(props)
const { config, id } = toRefs(formData.value);
</script>
