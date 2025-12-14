<script setup lang="ts">
import { reactive, ref } from 'vue'
import { userLogin } from '@/api/user.ts'
import { message } from 'ant-design-vue'
import router from '@/router'
import { useUserStore } from '@/stores/user.ts'

const data = reactive({
  loginForm: {
    account: '',
    password: '',
    remember: false,
    rules: {
      account: [
        {
          required: true,
          trigger: 'change',
          message: '用户名或邮箱不能为空'
        }
      ],
      password: [
        {
          required: true,
          trigger: 'change',
          message: '密码不能为空'
        }
      ]
    }
  }
})

const userStore = useUserStore();
const loginForm = ref();
const submitLogin = () => {
  loginForm.value.validate()
    .then(async () => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let email = null;
      let username = null;
      if (new RegExp(regex).test(data.loginForm.account)) {
        email = data.loginForm.account;
      } else {
        username = data.loginForm.account;
      }
      const response = await userLogin(
        username,
        email,
        data.loginForm.password,
        data.loginForm.remember
      )
      const result = response.data;
      if (result.code !== 0) {
        message.error(result.message);
        return;
      }
      message.success('登录成功')
      userStore.setToken(response.headers.authorization ?? '')
      userStore.setInfo(result.data)
      userStore.setLoginStatus(true);
      await router.push({
        name: 'user-profile'
      })
    });
}
</script>

<template>
  <div class="login-container">
    <div class="login-form-card">
      <h1 class="login-form-card-title">账号登录</h1>
      <p class="login-form-card-desc">登录你的账号，开始高效刷题之旅</p>
      <div class="login-form-card-form">
        <a-form layout="vertical" :model="data.loginForm" ref="loginForm" @finish="submitLogin">
          <a-form-item label="用户名或邮箱地址" name="account">
            <a-input placeholder="请输入用户名或邮箱地址" v-model:value="data.loginForm.account">
              <template #prefix>
                <i class="i-mdi:user"></i>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input-password placeholder="请输入密码" v-model:value="data.loginForm.password">
              <template #prefix>
                <div class="i-mdi:lock"></div>
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-row>
              <a-col :span="12">
                <a-checkbox v-model:checked="data.loginForm.remember">记住我</a-checkbox>
              </a-col>
              <a-col :span="12">
                <a style="float: right" href="/user/forget-password">忘记密码？</a>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" size="large" class="login-btn" html-type="submit">
              登录
            </a-button>
          </a-form-item>
          <a-form-item class="login-form-card-register">
            还没有账号？<router-link to="/user/register">立即注册</router-link>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/views/login";
</style>
