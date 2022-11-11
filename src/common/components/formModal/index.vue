 
<template>
    <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel" @before-ok="handleBeforeOk">
        <a-form :model="formValues" @submit="handleSubmit">
            <a-row v-for="(childArr, index) in formItemsPro" class="grid-demo" :gutter="24" :key="childArr[0].key">
                <a-col v-for="(cItem, cId) in childArr" class="grid-demo" :span="cItem.span" :key="cItem.key">
                    <FormItem :formValues="formValues" :formData="cItem"></FormItem>
                </a-col>
            </a-row>
        </a-form>
        {{ formValues }}
    </a-modal>
</template>
 
<script setup lang="ts">
import { toRefs, ref, watchEffect, type Ref } from 'vue';
import { UUID } from '@/common/utils'
import FormItem, { type FormItemT } from '@/common/components/formItem/index.vue'

const props = defineProps<{ handleSubmit: (permissions: string[]) => void, form: any, formItems: FormItemT[], visible: boolean, handleClose: () => void, title: string }>()
const { form, visible, handleClose, title, formItems } = toRefs(props);


const formValues = ref<any>({})
const processFormItems = (arr: FormItemT[]) => {
    let result: FormItemT[][] = [];
    let rowId = 0;
    let total = 0
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        const { span = 0 } = item;
        if ((total * 1 + span * 1) > 24) {
            total = 0;
            rowId++;
        }
        total += span;
        if (!(rowId in result)) {
            result[rowId] = []
        }
        result[rowId].push(item);
        formValues.value[item.id] = "";
        form.value[item.id] = ref({});
        item.formValue = form.value[item.id];
        item.key = UUID()
    }
    return result
}
const formItemsPro = ref<FormItemT[][]>()
watchEffect(() => {
    if (formItems.value) {
        formItemsPro.value = processFormItems(formItems.value)
    }
})

watchEffect(() => {
    console.log(formItemsPro.value)
})


const handleBeforeOk = (done: () => void) => {
    done()
    props.handleSubmit(formValues.value)
};
const handleCancel = () => {

    handleClose.value()
}
</script>
