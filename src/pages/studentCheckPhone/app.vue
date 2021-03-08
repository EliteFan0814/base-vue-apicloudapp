<template>
  <div class="container">
    <headerBetween leftText="验证手机号"  leftType class="headerBetween"/>

    <div class="content">
      <van-field v-model="mobile" label="原手机号" input-align="right" clearable readonly>
        <template #left-icon>
          <img class="icon" src="@/static/image/registAndLogin/phone.png" />
        </template>
      </van-field>
      
      <van-field v-model="smsCode" label="验证码" input-align="right" clearable >
        <template #left-icon>
          <img class="icon" src="@/static/image/registAndLogin/code.png" />
        </template>
        <template #right-icon>
          <div v-if="outType" class="code-button" @click="sendOut">获取验证码</div>
          <div v-else class="code-button">{{ number }}</div>
        </template>
      </van-field>

      <van-field v-model="newMobile" label="新手机号" input-align="right" clearable>
        <template #left-icon>
          <img class="icon" src="@/static/image/registAndLogin/phone.png" />
        </template>
      </van-field>
      
      <div class="button" @click="register">验证手机号</div>
    </div>

  </div>
</template>
<script>
import headerBetween from '@/components/headerBetween'

import {openFrame} from '@/common/openPage'
import {studentNewPhone} from '@/common/router'

export default {
  components: {
    headerBetween
  },
  data() {
    return {
      mobile: api.pageParam.data.mobile,
      smsCode: '',
      newMobile: '',
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
        this.$http.post('/api/PlatformTrainee/CheckMobile').then((res) => {
          if (res.success) {
            this.times()
            this.$toast.success('发送成功')
          } else {
            // this.$toast.fail(res.msg)
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
      const {mobile, smsCode, newMobile} = this;
      if (!mobile) {
        tips = '请输入原手机号'
      } else if (!smsCode) {
        tips = '请输入验证码'
      } else if (!newMobile) {
        tips = '请输入新手机号'
      } else {
        this.$http.post('/api/PlatformTrainee/NewMobileSmsCode', 
        { smsCode, mobile: newMobile}).then((res) => {
          if (res.success) {
            api.toast({msg: '请注意查收验证码', global: true});
            setTimeout(() => {
              openFrame(studentNewPhone, {mobile: this.newMobile});
            }, 200)
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
