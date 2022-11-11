<script lang="ts">
export default {
    name: "child_1",
};
</script>
<script setup lang="ts">
import { FORM_TYPE } from '@/common/components/formItem/config';
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'
import Form from '@/common/components/form/index.vue'

const store = useCounterStore()
const { increment } = store;

// 变量
const columns = [{
    title: '用户编号',
    dataIndex: 'id',
}, {
    title: '用户名称',
    dataIndex: 'name',
}, {
    title: '状态',
    dataIndex: 'status',
}, {
    title: '操作',
    slotName: 'optional'
}];

const data = [{
    id: '1',
    name: 'admin',
    signStr: 'admin',
    status: 1,
}, {
    id: '2',
    name: 'nor',
    signStr: 'normal',
    status: 1,
}];
const formItems = [{
    id: "name",
    title: "用户姓名",
    type: FORM_TYPE.FORM_INPUT,
    span: 12,

}]
</script>
        
<template>
    <div class="content">
        <a-row>
            <Form :from-items="formItems"></Form>
        </a-row>
        <a-table :columns="columns" :data="data">
        </a-table>
    </div>
</template>
        
        
<style scoped>
.content {
    color: black;
    height: 100%;
    width: 100%;

}

.title {
    margin-top: 50px;
    font-size: 60px;
    font-weight: bold;
    background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.info {
    font-size: 30px;
    margin-top: 30px;
    margin-bottom: 30px;
    font-weight: bold;
}
</style>