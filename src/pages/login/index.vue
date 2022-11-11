<template>
    <div class="containerLogin">
        <div class="moderate">
            <AnimateText :texts="texts"></AnimateText>
        </div>
        <div class="login-panel">
            <Card>
                <Form :btnConfig="btnConfig" :handle-submit="handleLogin" :from-items="fromItems!"></Form>
            </Card>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notification } from '@arco-design/web-vue';
import { AnimateText, Card, Form, type BtnConfigItemT, type SubmitParamsT } from '@/common/components'
import { FORM_TYPE } from '@/common/components/formItem/config';
import type { FormItemT } from '@/common/components/formItem/index.vue';
import { login } from './service'
import { useGlobalStore } from '@/stores/global';

const globaStore = useGlobalStore()
const router = useRouter()
const { FORM_INPUT } = FORM_TYPE;
const texts = ref([" Moderate admin", "基于Vue3+ArcoDesign+Pinia+Vite开发"])

const fromItems = ref<FormItemT[]>()
fromItems.value = [{
    id: "name",
    title: "用户名",
    type: FORM_INPUT,
    config: {
        placeholder: "用户名是admin",
        rules: [
            { required: true, message: '用户名是admin！' }
        ]
    }
}, {
    id: "password",
    title: "密码",
    type: FORM_INPUT,
    config: {
        placeholder: "密码是123",
        rules: [
            { required: true, message: '密码是123！' }
        ]
    }
}]
const btnConfig = ref<BtnConfigItemT[]>([
    { type: 'submit', title: "登录", color: "primary" }
])
const handleLogin = (data: SubmitParamsT<{ name: string, password: string }>) => {
    const { values } = data;
    const { name, password } = values;
    if (data.errors) {
        Notification.error({
            title: '错误',
            content: "请输入账户或密码！"
        })
    } else {
        login({
            name: name,
            password: password,
        }).then((res) => {
            const { token } = res.data;
            sessionStorage.setItem("ACCESS_TOKEN", token)
            globaStore.setToken(token)
            router.push('/home')
        }).catch(() => {
        })
    }
}
</script>
        

        
        
<style lang="scss" scoped>
.containerLogin {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 30px 0px;

    .moderate {
        width: calc(100% - 350px - 75px - 75px);
        padding: 75px 0 75px 75px;
        font-size: 28px;
        text-align: left;
    }

    .login-panel {
        flex: none;
        margin: 75px;
        width: 350px;
        margin-right: 150px;

        .login-form {
            width: 100%;
            padding: 50px;
            border-radius: 16px;
            overflow: hidden;
            transition: 0.375s;
        }

        .login-form-margin {
            margin-bottom: 16px;
        }

        .login-form-button {
            width: 100%;
        }
    }
}

@media screen and (max-width: 768px) {

    .container {
        flex-direction: column;

        .moderate {
            width: 100%;
            padding: 25px;
            height: 150px;
            text-align: center;
        }

        .login-panel {
            flex: 1;
            margin: 0;
            width: 100%;
            max-width: 350px;
        }
    }
}
</style>