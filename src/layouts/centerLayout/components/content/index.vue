<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Breadcrumb from './components/breadcrumb/index.vue'
import { getRouteData, type RouteRecordRawCustom } from '@/router/index'
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia'

const globaStore = useGlobalStore()
const { pageCacheArr } = storeToRefs(globaStore)

const currentTabKey = ref<string | symbol>("")
const route = useRoute();
const router = useRouter();

watchEffect(() => {
    const routeData = getRouteData(route.path.slice(1).split('/').slice(-1)[0]) as RouteRecordRawCustom;
    if (routeData) {
        let { name = '', path, meta = {} } = routeData
        currentTabKey.value = name;
        if (!(name in pageCacheArr.value!)) {
            pageCacheArr.value![name as string] = { name: name as string, path, title: meta.title as string }
        }
    }
})

const handleClick = (key: string) => {
    let { path } = getRouteData(key);
    path && router.push(path)
}

const handleDelete = (key: string | symbol) => {
    if ((key in pageCacheArr.value!)) {
        if (key == currentTabKey.value) {
            let keys = Object.keys(pageCacheArr.value!)
            let pos = keys.findIndex((item) => {
                return item === key
            })
            let datas = Object.values(pageCacheArr.value!)
            if (datas.length > 1) {
                keys.splice(pos, 1)
                let newKey = keys.slice(-1)[0]
                router.push(getRouteData(newKey).path)
            }
        }
        setTimeout(() => {
            Reflect.deleteProperty(pageCacheArr.value!, key)
        }, 10)
    }
}

</script>

<template>
    <a-layout style="padding: 0 24px;">
        <Breadcrumb></Breadcrumb>
        <a-tabs @tab-click="handleClick" @delete="handleDelete" :active-key="currentTabKey as string" type="card-gutter"
            :editable="true" auto-switch>
            <a-tab-pane v-for="(item, index) of pageCacheArr" :key="item.name" :title="item.title"
                :closable="index !== 2">
            </a-tab-pane>
        </a-tabs>
        <a-layout-content class="layout_content">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
                <!-- <component :is="Component" /> -->
            </router-view>
        </a-layout-content>
        <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>


<style scoped>
.layout_content {
    color: black;
    padding: 20px;

}

:deep(.arco-tabs-type-card-gutter > .arco-tabs-content) {
    border: initial;
    padding: 0px;
}

/* .content>>>.arco-tabs-content {
    border: initial !important;
    padding: 0px !important;
} */
</style>