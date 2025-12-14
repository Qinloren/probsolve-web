<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { userRegister } from '@/api/user.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

const data = reactive({
  registerForm: {
    username: '',
    email: '',
    password: '',
    rePassword: '',
    remember: false
  }
})

// 将规则单独提取出来，避免嵌套太深
const rules: Record<string, Rule[]> = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'change'
    },
    {
      pattern: /^[a-zA-Z0-9_]{3,20}$/,
      message: '用户名只能包含字母、数字和下划线，长度为3-20个字符'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱地址',
      trigger: 'change',
    },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'change'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%*?&.])[A-Za-z\d@!%*?&.]{8,}$/,
      message: '密码必须包含大小写字母、数字和特殊字符(@!%*?&.)，长度至少需为8个字符'
    }
  ],
  rePassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: 'change'
    },
    {
      validator: async (_rule: Rule, value: string) => {
        if (!value) {
          return Promise.resolve() // 如果是空的，让 required 规则处理
        }
        if (value !== data.registerForm.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ]
}

const registerForm = ref()

// 使用 @finish 事件，更符合 Ant Design 的用法
const submitRegister = async () => {
  try {
    const response = await userRegister(
      data.registerForm.username,
      data.registerForm.email,
      null,
      data.registerForm.password
    )

    const result = response.data
    if (result.code !== 0) {
      message.error(result.message)
      return
    }
    message.success('注册成功！请登录')
    await router.push({
      name: 'user-login'
    })
  } catch (error) {
    // 这里可以捕获验证失败或其他错误
    console.error('注册失败:', error)
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-form-card">
      <h1 class="register-form-card-title">账号注册</h1>
      <p class="register-form-card-desc">创建账号，开启你的刷题之旅</p>
      <div class="register-form-card-form">
        <a-form
          layout="vertical"
          :model="data.registerForm"
          :rules="rules"
          ref="registerForm"
          @finish="submitRegister"
        >
          <a-form-item label="用户名" name="username">
            <a-input placeholder="请输入用户名" v-model:value="data.registerForm.username">
              <template #prefix>
                <i class="i-mdi:user"></i>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="邮箱地址" name="email">
            <a-input placeholder="请输入邮箱地址" v-model:value="data.registerForm.email">
              <template #prefix>
                <i class="i-mdi:email-outline"></i>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input-password placeholder="请输入密码" v-model:value="data.registerForm.password">
              <template #prefix>
                <div class="i-mdi:lock"></div>
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item label="确认密码" name="rePassword">
            <a-input-password placeholder="请再次输入密码" v-model:value="data.registerForm.rePassword">
              <template #prefix>
                <div class="i-mdi:lock"></div>
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item v-if="false">
            <a-row>
              <a-col :span="12">
                <a-checkbox v-model:checked="data.registerForm.remember">记住我</a-checkbox>
              </a-col>
              <a-col :span="12">
                <a style="float: right" href="/user/forget-password">忘记密码？</a>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              size="large"
              class="register-btn"
              html-type="submit"
            >
              注册
            </a-button>
          </a-form-item>
          <a-form-item class="register-form-card-login">
            已有账号？<router-link to="/user/login">立即登录</router-link>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/views/register";
</style>
