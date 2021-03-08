<template>
  <div class="container">
    <div class="title">请选择您的身份</div>
    <div class="login-text">
      <img src="@/static/image/registAndLogin/teacher.png" alt="">
      <BaseButton @click="openLoginForm(1)" name="老师登录" class="btn-style"></BaseButton>
    </div>
    <div class="slide-line"><span>OR</span></div>
    <div class="login-text">
      <img src="@/static/image/registAndLogin/student.png" alt="">
      <BaseButton @click="openLoginForm(0)" name="学员登录" class="btn-style"></BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import { loginForm } from '@/common/router.js'
import { openWin } from '@/common/openPage.js'
import request from '@/api/loginAndRegist'
export default {
  components: {
    BaseButton
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    // 打开登录表单页面  role === 1 代表老师 role === 0 代表学员
    openLoginForm(role) {
      $api.setStorage('roleValue', role)
      // alert($api.getStorage('roleValue'))
      openWin(loginForm, { role })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // border: 1px solid red;
  font-family: PingFang-SC-Bold;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // min-height: 100vh;
  .title {
    padding-top: 5.9rem;
    font-size: 1.8rem;
    letter-spacing: 0rem;
    color: #333333;
    text-align: center;
    margin-bottom: 2.65rem;
  }
  .login-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3.85rem;
    img {
      width: 19.3rem;
      margin-bottom: 2.65rem;
    }
  }
  .slide-line {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.18rem;
    letter-spacing: 0rem;
    color: #b9b9b9;
    &::before,
    &::after {
      content: "";
      display: inline-block;
      width: 6rem;
      border-top: 1px solid #b9b9b9;
    }
    span {
      padding: 0 1rem;
    }
  }
  .btn-style {
    border-radius: 0.5rem;
    font-size: 1.47rem;
    letter-spacing: 0rem;
    color: #fffefe;
    padding: 1.1rem 4rem;
  }
}
</style>