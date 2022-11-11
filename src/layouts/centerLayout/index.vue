<script setup lang="ts">
import {onMounted} from 'vue'
import { useGlobalStore } from '@/stores/global'
import { MenuSlider, Header, Content } from './components/'
import { storeToRefs } from 'pinia'
const globaStore = useGlobalStore()
const { menuData } = storeToRefs(globaStore)
onMounted(() => {
    debugger
})

</script>
<template>
    <a-layout class="layout-demo">
        <MenuSlider :routesData="menuData"></MenuSlider>
        <a-layout>
            <Header />
            <Content :routesData="menuData" />
        </a-layout>
    </a-layout>
</template>

<style scoped>
.layout-demo {
    height: 100%;
    background: var(--color-fill-2);
    border: 1px solid var(--color-border);
}

.layout-demo :deep(.arco-layout-sider) .logo {
    height: 32px;
    margin: 12px 8px;
    background: rgba(255, 255, 255, 0.2);
}

.layout-demo :deep(.arco-layout-sider-light) .logo {
    background: var(--color-fill-2);
    height: 45px;
    font-size: 26px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}

.layout-demo :deep(.arco-layout-header) {
    height: 64px;
    line-height: 64px;
    background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer) {
    height: 48px;
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    line-height: 48px;
}

.layout-demo :deep(.arco-layout-content) {
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-white);
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
}
</style>