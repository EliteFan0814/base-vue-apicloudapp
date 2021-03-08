<template>
  <div class="container flex">
    <HeaderBetween leftType />

    <div :class="['content', role ? '' : 'pt'] "> 
      <div class="logo">
        <img src="@/static/image/registAndLogin/logo.png" alt="">
        <div class="name">艺术教育行业一站式服务平台</div>
      </div>
       <div class="login-img">
          <img v-if="!role" src="@/static/image/registAndLogin/student.png" alt="">
          <img v-if="role" src="@/static/image/registAndLogin/teacher.png" alt="">
       </div>
      <div class="field">
        <div class="label flex">
          <img class="icon" src="@/static/image/registAndLogin/phone.png" alt="">
          <div class="text"v-if="!role">手机号</div>
          <div class="text"v-if="role">账号</div>
        </div>
        <input type="text" :placeholder="role?'请输入账号(机构分配)':'请输入手机号'" data-key="phone" v-model="phone">
        <van-icon name="cross" size="1.65rem" @click="clearPhone" color="#ccc" />
      </div>

      <div class="field">
        <div class="label flex">
          <img class="icon" src="@/static/image/registAndLogin/psd.png" alt="">
          <div class="text">密码</div>
        </div>
        <input :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" v-model="password">
        <van-icon color="#4385ff" size="1.65rem" :name="showPwd ? 'eye-o' : 'closed-eye'" @click="seePwd(true)" />
        <!-- @mouseup="seePwd(false)"  -->
      </div>

      <div class="forget" @click="open(studentFindPwd)" v-if="!role">忘记密码？</div>
      <div class="login-btn" @click="submit">登录</div>
      <!-- <BaseButton name="登录" @click="submit"></BaseButton> -->

      <div class="register" @click="open(register)" v-if="!role">
        还没有账号？<span>立即注册</span>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderBetween from '@/components/headerBetween'
import BaseButton from '@/components/BaseButton'

import { openFrame, openWin } from '@/common/openPage.js'
import { winPageIndex, register, studentFindPwd } from '@/common/router.js'
import { teacherLogin, studentLogin } from '@/api/login'
export default {
  components: {
    BaseButton,
    HeaderBetween
  },
  data() {
    return {
      role: api.pageParam.data.role, // role === 1 代表老师 role === 0 代表学员
      phone: '',
      password: '',
      showPwd: false,
      studentFindPwd,
      register,
    }
  },
  created() {
    // alert(JSON.stringify(api.pageParam))
  },
  methods: {
    async submit() {
      if (!this.phone) {
        this.$toast.fail('请输入账号')
      } else if (!this.password) {
        this.$toast.fail('请输入密码')
      } else {
        this.login()
      };
    },
    // 登录请求封装
    login() {
      if (this.role === 1) {
        // 老师登录
        teacherLogin({
          loginName: this.phone,
          pwd: this.password
        }).then(res => {

          this.handlerLogin(res);
        }).catch(err => {
          console.log('err', JSON.stringify(err));
        })
      } else if (this.role === 0) {
        // 学员登录
        studentLogin({
          mobile: this.phone,
          pwd: this.password
        }).then(res => {

          this.handlerLogin(res);
        })
      } else {

      }
    },
    handlerLogin(res) {
      if (res.success) {
        $api.setStorage('user', {
          islogin: true,
          mytoken: res.value.token,
          userInfo: res.value.user
        });
        api.sendEvent({
          name: 'loginSuccess',
          extra: {
            msg: '登录成功！'
          }
        });
        console.log(JSON.stringify(res));
        // openWin(winPageIndex); 
        api.closeWin()
        // api.closeFrame()
      }
    },
    // 清空电话
    clearPhone() {
      this.phone = '';
    },
    seePwd(key) {
      this.showPwd = !this.showPwd;
      console.log(this.showPwd);
    },
    open(name) {
      openWin(name);
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  min-height: 100vh;
  overflow: hidden;
  background: #fff;
  justify-content: center;
  // background: url("../../static/image/login-bg.png") no-repeat;
  // background-size: 100% 100%;

  .content {
    // background: #fff;
    width: 100%;
    padding: 0rem 2.5rem 10rem;
    border-radius: 0.5rem;
    .logo {
      text-align: center;
 
      img {
        width: 7rem;
        height: 7rem;
        display: inline-block;
        border-radius: 50%;
        // border: 1px solid #000;
      }
      .name {
        font-size: 1.8rem;
        margin-top: 0.5rem;
        color: #333;
      }
    }
    .login-img{
        margin: 0 auto;
          width: 80%;
          margin-bottom: 3rem;
      img {
          width: 100%;
          height: auto;
        }
    }
    .field {
      position: relative;
      &:nth-child(n + 2) {
        margin-top: 1rem;
      }
      .label {
        .icon {
          width: 0.75rem;
          height: 1.1rem;
        }
        .text {
          font-size: 1.2rem;
          color: #697181;
          margin-left: 0.5rem;
        }
      }
      input {
        border-bottom: 1px solid #e4ebff;
        width: 100%;
        margin-top: 2rem;
        padding-bottom: 1rem;
        font-size: 1.2rem;
        &::placeholder {
        }
      }
      .van-icon {
        position: absolute;
        right: 0;
        bottom: 1rem;
      }
    }
  }
  .pt{
    padding-top: 4rem;
  }
  .forget {
    margin-top: 1.35rem;
    text-align: right;
    color: #4385ff;
  }
  .login-btn {
    background: #4385ff;
    border-radius: 1.87rem;
    padding: 1.1rem;
    color: #fff;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 2.85rem;
  }
  .register {
    margin-top: 2.1rem;
    font-size: 1.2rem;
    color: #d4d9fb;
    text-align: center;
    span {
      color: #4385ff;
      margin-left: 0.5rem;
    }
  }
}
</style>
