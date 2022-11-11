<template>
    <a-form :model="formValues" @submit="handleSubmit">
        <FormItem v-for="(item, id) in fromItems" :formValues="formValues" :formData="item" :key="item!.key"></FormItem>
        <a-form-item>
            <a-button v-for="(item, id) in btnConfig" :type='item.color' :html-type="item.type">{{ item.title }}
            </a-button>
        </a-form-item>
    </a-form>
    <div v-if="debug">{{ formValues }}</div>
</template>
  
<script setup lang="ts">
import { toRefs, ref } from 'vue';
import type { FormItemT } from '../formItem/index.vue';
import type { ValidatedError } from "@arco-design/web-vue";
import { FormItem } from '../index'


export interface SubmitParamsT<T> {
    values: T&Record<string, any>;
    errors: Record<string, ValidatedError> | undefined;
}

export interface BtnConfigItemT { title: string, type?: 'submit' | '', color?: "primary" }[]

const formValues = ref({})
const props = defineProps<{
    fromItems: FormItemT[], btnConfig?: BtnConfigItemT[], handleSubmit?: (<T>(data: SubmitParamsT<{ name: string, password: string }>, ev: Event) => void) | undefined
    , debug?: boolean
}>()
const { fromItems, handleSubmit, btnConfig, debug } = toRefs(props);


</script>