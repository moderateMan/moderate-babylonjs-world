<template>
    <div class="hello">
        <div class="title">Moderate admin</div>
        <div :style="{
            boxSizing: 'border-box',
            width: '100%',
            padding: '40px',
            backgroundColor: 'var(--color-fill-2)',
        }">
            <a-row :gutter="20" :style="{ marginBottom: '20px' }">
                <a-col :span="8">
                    <a-card title="Vue3" :bordered="false" :style="{ width: '100%' }">
                        <template #extra>
                            <a-link>More</a-link>
                        </template>
                        <a-row justify="center">
                            组合式api，上手快
                        </a-row>
                        <a-row justify="center">
                            Vite秒开
                        </a-row>
                        <a-row justify="center">
                            React用户友好
                        </a-row>
                    </a-card>
                </a-col>
                <a-col :span="8">
                    <a-card title="Arco design" :bordered="false" :style="{ width: '100%' }">
                        <template #extra>
                            <a-link>More</a-link>
                        </template>
                        <a-row justify="center">
                            整挺好
                        </a-row>
                        <a-row justify="center">
                            React和Vue都有
                        </a-row>
                        <a-row justify="center">
                            功能全，文档有Antd味～
                        </a-row>
                    </a-card>
                </a-col>
                <a-col :span="8">
                    <a-card title="Pinia" :bordered="false" :style="{ width: '100%' }">
                        <template #extra>
                            <a-link>More</a-link>
                        </template>
                        <a-row justify="center">
                            小巧简单
                        </a-row>
                        <a-row justify="center">
                            小巧简单
                        </a-row>
                        <a-row justify="center">
                            小巧简单
                        </a-row>
                    </a-card>
                </a-col>
            </a-row>
            <a-row :gutter="20">
                <a-col :span="16">
                    <a-card title="Koa2" :bordered="false" :style="{ width: '100%' }">
                        <template #extra>
                            <a-link>More</a-link>
                        </template>
                        <a-row justify="center">
                            实现登录，JWT，权限管理，用户管理
                        </a-row>
                    </a-card>
                </a-col>
                <a-col :span="8">
                    <a-card title="Java" :bordered="false" :style="{ width: '100%' }">
                        <template #extra>
                            <a-link>More</a-link>
                        </template>

                        <a-row justify="center">
                            java后台开发中～～～
                        </a-row>

                    </a-card>
                </a-col>
            </a-row>
        </div>
        <div :style="{
            boxSizing: 'border-box',
            width: '100%',
            padding: '40px',
            backgroundColor: 'var(--color-fill-2)',
            display: 'flex',
            justifyContent: 'start',
            color: 'black',
            alignItems: 'center',
        }">
            <a-image width="150" :src='homeIcon' />
            <h3 :style="{
                color:'#6CA2CE',
                fontWeight:'bold',
                marginLeft: '50px'
            }">技术交流群，有问题就问，提供强有力的技术支持～～～</h3>
        </div>

    </div>
</template>
  
<script lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import homeIcon from '@/assets/images/dland.png'


export default {
    setup() {
        const route = useRoute();
        const globaStore = useGlobalStore()
        const mode = ref<'left' | 'right' | 'top' | 'bottom' | 'alternate'>('top');
        const onChange = (_mode: string | number | boolean) => {
            mode.value = _mode as 'left' | 'right' | 'top' | 'bottom' | 'alternate';
        };
        return {
            mode,
            onChange,
            homeIcon
        }
    },
};
</script>
<style scoped>
.arco-card-size-medium :deep(.arco-card-header-title) {
    padding-left: 38px;
}

.hello {
    height: 100%;
    width: 100%;
}

.infoList {
    width: 40%;
}

.title {
    text-align: center;
    font-weight: bold;
    font-size: 50px;
    background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 76px;
    line-height: 1.25;
    font-weight: 900;
    letter-spacing: -1.5px;
}
</style>