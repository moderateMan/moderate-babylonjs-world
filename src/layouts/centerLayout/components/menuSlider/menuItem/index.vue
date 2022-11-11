<script setup lang="ts">
import {
    IconCalendar,
} from '@arco-design/web-vue/es/icon';
import type { RouteItemDataT } from '@/router/index'
import MenuItem from './index.vue'

const { itemData } = defineProps<{
    itemData: RouteItemDataT
}>()

const hasOneShowingChild = (children: RouteItemDataT[] = [], parent: RouteItemDataT) => {
    if (!children) {
        children = [];
    }
    const showingChildren = children.filter((item: RouteItemDataT) => {
        if (item.hidden) {
            return false
        } else {
            return true
        }
    })

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
        return true
    }

    return false
}

</script>
    
<template>
    <template v-if="hasOneShowingChild(itemData.children, itemData)">
        <a-menu-item :key="itemData.name">{{ itemData.meta!.title }}</a-menu-item>
    </template>
    <a-sub-menu v-else :key="itemData.name">
        <template #title>
            <IconCalendar></IconCalendar> {{ itemData.meta!.title }}
        </template>
        <MenuItem v-for="child in itemData.children" :itemData="child" :key="child.name">
        </MenuItem>
    </a-sub-menu>
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