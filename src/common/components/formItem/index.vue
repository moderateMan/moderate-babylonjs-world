<template>
    <a-form-item  :rules="config?.rules" label-col-flex="70px" :field=id :label="title">
        <SelectItem :formValues="formValues" :form-data="formData" v-if="type == FORM_SELECT"></SelectItem>
        <TreeItem :formValues="formValues" :form-data="formData" v-else-if="type == FORM_TREE" />
        <a-input :placeholder="config?.placeholder" v-else v-model="formValues[id]" />
    </a-form-item>
</template>
 
<script setup lang="ts">
import { ref, toRefs, type Ref } from 'vue';
import SelectItem from './components/select/index.vue'
import type { TreeNodeData, FieldRule } from '@arco-design/web-vue';
import { FORM_TYPE } from './config'
import TreeItem,{type TreePropsT} from './components/tree/index.vue'

export interface FormItemT {
    key?: string,
    id: string
    title: string
    type: symbol
    span?: number
    formValue?: Ref<unknown>
    config?: {
        initValue?: TreeNodeData[],
        options?: { name: string, value: string }[]
        treeOptions?: TreePropsT
        handleTreeChange?: (value: string[]) => void
        rules?: FieldRule | FieldRule[]
        placeholder?: string
    }
}

const { FORM_SELECT, FORM_DATE_PICKER, FORM_TEXTAREA, FORM_TREE_SELECT, FORM_TREE } = FORM_TYPE;

const props = defineProps<{ formValues: any, formData: FormItemT }>();
const { formData, formValues } = toRefs(props)
const { type, id, title, config } = toRefs(formData.value);
</script>
