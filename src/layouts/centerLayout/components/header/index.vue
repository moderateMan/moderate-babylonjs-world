<script setup lang="ts">
import { IconGithub, IconCheckCircle } from '@arco-design/web-vue/es/icon';
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const handleSelect = (value: string) => {
    if (value == "1") {
        globalStore.setToken("")
    }
}
</script>
        
<template>
    <a-layout-header class="headerLaout" style="padding-left: 20px;">
        <a-avatar class="avaItem" :style="{ backgroundColor: '#6DAAC3' }">
            <IconGithub />
        </a-avatar>
        <a-dropdown position="br" @select="handleSelect">
            <a-avatar class="avaItem" :style="{ backgroundColor: '#3370ff' }">
                <img alt="avatar"
                    src="https://p3-passport.byteimg.com/img/user-avatar/8247dae1f9049f76b6839fc6c98d162e~180x180.awebp" />
            </a-avatar>
            <template #content>
                <a-doption value="1">退出</a-doption>
            </template>
        </a-dropdown>
    </a-layout-header>
</template>
        
        
<style scoped>
.headerLaout {
    display: flex;
    justify-content: end;
    align-items: center;
}

.avaItem {
    margin-right: 30px;
}
</style>