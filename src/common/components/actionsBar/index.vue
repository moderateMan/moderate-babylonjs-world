<template>
    <div>
        <a-row class="content">
            <template v-for="(item, index) in BTN_PERMISSIONS">
                <a-button @click="handleAction({ type: item.id!, payload: item })" class="btn" type="dashed"
                    v-if="item.code! & btnPermission" :style="{ backgroundColor: item.color }">
                    {{ item.title }}</a-button>
            </template>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { BTN_PERMISSIONS, type BtnItemT } from '@/permissions/actionConfig'

export interface HandleActionParams {
    type: symbol,
    payload: BtnItemT
}

const props = defineProps<{ handleAction: (params: HandleActionParams) => void, btnPermission: number }>()
const { btnPermission, handleAction } = toRefs(props)

</script>

<style scoped>
.content {
    margin-bottom: 12px;
}

.btn {
    margin-right: 10px;
}

.btn:active {
    background-color: black;
}

.btn:focus {
    background-color: black;
}
</style>