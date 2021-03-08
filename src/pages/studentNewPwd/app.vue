<template>
  <div class="container">
    <headerBetween leftText="重置密码"  leftType class="headerBetween"/>

    <div class="content">
      <van-field v-model="pwd" type="password" label="密码" input-align="right" clearable placeholder="请输入密码">
        <template #left-icon>
          <img class="icon" src="@/static/image/registAndLogin/psd.png" />
        </template>
      </van-field>

      <van-field v-model="newPwd" type="password" label="确认密码" input-align="right" clearable placeholder="请确认密码">
        <template #left-icon>
          <img class="icon" src="@/static/image/registAndLogin/psd.png" />
        </template>
      </van-field>

      <div class="button" @click="register">重置密码</div>
    </div>

  </div>
</template>
<script>
import headerBetween from '@/components/headerBetween'

import { openFrame } from '@/common/openPage.js'
import { newPwd } from '@/common/router.js'
// import { register, sendCode } from '@/api/register'
export default {
  components: {
    headerBetween
  },
  data() {
    return {
      pwd: '',
      newPwd: '',
      smsCode: api.pageParam.data.code,
      outType: true, // 是否显示验证码按钮
      number: 60 // 验证码间隔,
    }
  },
  methods: {
    // 发送验证码
    sendOut() {
      if (!this.mobile) {
        this.$toast.fail('请输入手机号')
        return
      }
      if (/^1[345789]\d{9}$/.test(this.mobile)) {
        sendCode({mobile: this.mobile}).then((res) => {
          if (res.success) {
            this.times()
            this.$toast.success('发送成功')
          } else {
          }
        })
      } else {
        this.$toast.fail('手机格式不正确')
      }
    },
    // 验证码时间
    times() {
      this.outType = false
      var time = setInterval(() => {
        if (this.number !== 1) {
          this.number -= 1
        } else {
          clearInterval(time)
          this.outType = true
          this.number = 5
        }
      }, 1000)
    },
    register() {
      let tips = '';
      const {pwd, newPwd, smsCode} = this;
      if (!pwd) {
        tips = '请输入密码'
      } else if (!newPwd) {
        tips = '请确认密码'
      }else if(pwd !== newPwd){
        tips = '两次密码输入不一致'
      } else {
        this.$http.post('/api/PlatformTrainee/SetPwd', { smsCode, newPwd}).then((res) => {
          if (res.success) {
            api.toast({msg: '重置成功', global: true});
            $api.clearStorage();
            setTimeout(() => {
              api.closeWin();
            }, 200);
          } else {
            tips = res.msg
          }
        })
      }
      if (tips) {
        api.toast({msg: tips, global: true});
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.container{
  background: #f5f5f5;
  .content{
    margin-top: 1.5rem;
    padding: 2rem 0;
    background: #fff;
    border-radius: .5rem;
  }
  .van-field {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    // padding: 1.3rem 0;
    .icon {
      width: .75rem;
      height: auto;
      margin-right: .5rem;
    }
    .code-button {
      text-align: center;
      padding: .2rem .4rem;
      border-radius: .5rem;
      color: #4385ff;
      border: 1px solid #4385ff;
      font-size: 1.2rem;
      margin-left: auto;
    }
  }
  .button {
    background: #4385ff;
    border-radius: 1.87rem;
    padding: 1.1rem;
    color: #fff;
    font-size: 1.5rem;
    text-align: center;
    margin: 1.5rem;
    margin-top: 2.85rem;
  }
}
</style>
