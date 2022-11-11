<script setup lang="ts">
import {
    IconCaretRight,
    IconCaretLeft,
} from '@arco-design/web-vue/es/icon';
import MenuItem from './menuItem/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { watch, reactive, onMounted, ref, watchEffect, toRefs } from 'vue'
import { getRouteData, type RouteRecordRawCustom } from '@/router/index'
import type { RouteItemDataT } from "@/router/index";

const router = useRouter()
const route = useRoute()
const openKeys = reactive<{ value: string[] }>({ value: [] })
const selectKeys = reactive<{ value: string[] }>({ value: [] })

const props = defineProps<{
    routesData: RouteItemDataT[]
}>()
const { routesData } = toRefs(props);

watchEffect(() => {
    console.log(props.routesData.length)
    console.log(routesData)
})

const onClickMenuItem = (name: string) => {
    let path = getRouteData(name).path;
    path && router.push(path)
}


const initMemuOption = () => {
    let keyArr = route.path.slice(1).split('/')
    openKeys.value = keyArr.slice(0, -1)
    selectKeys.value = keyArr.slice(-1)
}

onMounted(() => {
    if (props.routesData.length) {
        initMemuOption()
    }
})

watchEffect(() => {
    if (props.routesData.length) {
        initMemuOption()
    }
})

watch(() => route.path, (value, oldValue) => {
    initMemuOption()
})


</script>
    
<template>
    <a-layout-sider :width="260" collapsible breakpoint="xl">
        <div class="logo">Moderate</div>
        <a-menu v-if="props.routesData.length" :selected-keys="selectKeys.value" :default-open-keys="openKeys.value"
            :style="{ width: '100%' }" @menu-item-click="onClickMenuItem">
            <MenuItem v-for="(route, index) in props.routesData" :item-data="route">
            </MenuItem>
        </a-menu>
        <!-- trigger -->
        <template #trigger="{ collapsed }">
            <IconCaretRight v-if="collapsed"></IconCaretRight>
            <IconCaretLeft v-else></IconCaretLeft>
        </template>
    </a-layout-sider>

</template>
    
    
<style scoped>
.menu-demo {
    box-sizing: border-box;
    width: 100%;
    height: 600px;
    padding: 40px;
    background-color: var(--color-neutral-2);
}
</style>