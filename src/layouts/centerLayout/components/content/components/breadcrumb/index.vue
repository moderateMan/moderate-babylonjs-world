<script setup lang="ts">
import { getRouteData, type RouteRecordRawCustom } from '@/router/index'
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const pathInfoArr = ref<string[]>([])
watchEffect(() => {
    let keyArr = route.path.slice(1).split('/')
    pathInfoArr.value = keyArr.map((item) => {
        return (getRouteData(item) as RouteRecordRawCustom)?.meta!.title as string || item
    })
})

</script>
<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>{{ pathInfoArr[0] }}</a-breadcrumb-item>
        <a-breadcrumb-item v-if="pathInfoArr[1]">{{ pathInfoArr[1] }}</a-breadcrumb-item>
        <a-breadcrumb-item v-if="pathInfoArr[2]">{{ pathInfoArr[2] }}</a-breadcrumb-item>
    </a-breadcrumb>
</template>