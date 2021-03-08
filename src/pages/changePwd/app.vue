<template>
  <div class="container">
    <headerBetween leftText="修改密码" leftType color="#fff" bgColor="transparent" class="headerBetween" />

    <div class="content">
      <div class="field">
        <div class="label flex">
          <img class="icon" src="@/static/image/registAndLogin/psd.png" alt="">
          <div class="text">原密码</div>
        </div>
        <input :type="showOldPwd ? 'text' : 'password'" placeholder="请输入原密码" data-key="phone" v-model="oldPwd">
        <van-icon color="#4385ff" size="1.65rem" :name="showOldPwd ? 'eye-o' : 'closed-eye'"
          @click="seePwd('showOldPwd')" />
      </div>

      <div class="field">
        <div class="label flex">
          <img class="icon" src="@/static/image/registAndLogin/psd.png" alt="">
          <div class="text">新密码</div>
        </div>
        <input :type="showNewPwd? 'text' : 'password'" placeholder="请输入新密码" v-model="newPwd">
        <van-icon color="#4385ff" size="1.65rem" :name="showNewPwd ? 'eye-o' : 'closed-eye'"
          @click="seePwd('showNewPwd')" />
      </div>

      <div class="field">
        <div class="label flex">
          <img class="icon" src="@/static/image/registAndLogin/psd.png" alt="">
          <div class="text">确认密码</div>
        </div>
        <input :type="showNewPwda ? 'text' : 'password'" placeholder="请确认密码" v-model="newPwda">
        <van-icon color="#4385ff" size="1.65rem" :name="showNewPwda ? 'eye-o' : 'closed-eye'"
          @click="seePwd('showNewPwda')" />
      </div>

      <div class="login-btn" @click="submit">修改密码</div>
    </div>
  </div>
</template>
<script>
import headerBetween from '@/components/headerBetween'

import { openWin, openFrame } from '@/common/openPage'
import { login } from '@/common/router'

export default {
  components: {
    headerBetween,
  },
  data() {
    return {
      oldPwd: '',
      newPwd: '',
      newPwda: '',
      showOldPwd: false,
      showNewPwd: false,
      showNewPwda: false,
      role: '',
    }
  },
  created() {
    this.role = api.pageParam.data.role;
  },
  methods: {
    submit() {
      const { oldPwd, newPwd, newPwda } = this;
      if (!oldPwd) {
        this.$toast.fail('请输入旧密码')
      } else if (!newPwd) {
        this.$toast.fail('请输入新密码')
      } else if (!newPwda) {
        this.$toast.fail('请确认密码')
      } else {
        // /api/PlatformTrainee/UpdatePwd
        this.handlerSumbit(this.role);
      }
    },
    handlerSumbit(role) {
      let url = '/api/OrgTeacher/UpdatePwd';
      if (role == 'student') {
        url = '/api/PlatformTrainee/UpdatePwd';
      }
      const { oldPwd, newPwd, newPwda } = this;
      this.$http.post(url, { oldPwd, newPwd }).then(res => {
        if (!res.success) return;
        api.toast({ msg: '修改成功,请重新登录', global: true });
        $api.clearStorage();
        api.sendEvent({
          name: 'quit',
        });
        api.closeToWin({
          name: 'root'
        });
      })
    },
    seePwd(type) {
      this[type] = !this[type];
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
  background: url("../../static/image/login-bg.png") no-repeat;
  background-size: 100% 100%;
  .headerBetween {
    position: absolute;
    z-index: 9;
  }
  .content {
    margin-top: 15rem;
    background: #fff;
    padding: 3rem 2.5rem;
    border-radius: 0.5rem;
    .field {
      position: relative;
      &:nth-child(n + 2) {
        margin-top: 3rem;
      }
      .label {
        .icon {
          width: 1.1rem;
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
}
</style>