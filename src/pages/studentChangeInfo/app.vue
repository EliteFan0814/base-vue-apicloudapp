<template>
  <div class="container">
    <headerBetween leftText="修改信息" leftType class="headerBetween" />

    <div class="content">
      <van-cell center title="头像" is-link @click="upload">
        <template #right-icon>
          <img class="image student-img" :src="hostHeader" alt="">
        </template>
      </van-cell>

      <van-cell title="名字" :value="name" @click="showName" is-link />
      <van-dialog use-slot title="修改名字" v-model="show" show-cancel-button @confirm="submit" @close="close">
        <input class="input-name" type="text" placeholder="请输入昵称" v-model="name" />
      </van-dialog>

      <van-cell center title="修改密码" is-link @click="openWin(changePwd)"></van-cell>
      <van-cell center title="修改手机号" is-link @click="openWin(studentCheckPhone)"></van-cell>

      <div class="submit" @click="quit">退出登录</div>

    </div>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'

import { openWin, openFrame } from '@/common/openPage.js'
import { studentFindPwd, changePwd, studentCheckPhone, login } from '@/common/router.js'
import { changeInfo } from '@/api/student'

export default {
  components: {
    headerBetween
  },
  data() {
    const { data } = api.pageParam;
    console.log(JSON.stringify(data));
    return {
      name: data.name,
      header: data.header,
      photo: data.photo,
      hostHeader: data.hostHeader,
      mobile: data.mobile,
      studentFindPwd,
      changePwd,
      studentCheckPhone,
      show: false,
    }
  },
  created() {
  },
  methods: {
    async upload() {
      //上传图片
      const accessResult = await this.$checkSystemAccess('photos', '相册')
      if (accessResult) {
        let res = await this.$getPic();
        let fiel = await this.$fileUpload(res.data);
        console.log(JSON.stringify(fiel));
        if (fiel.success) {
          this.photo = fiel.pathList[0];
          this.hostHeader = fiel.hostPath[0];
          this.changeInfo('photo');
        }
      }
    },
    showName() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    submit() {
      const { name, photo } = this;
      if (!name) {
        this.$toast.fail('请输入名字')
      } else {
        this.changeInfo('name');
      }
    },
    changeInfo(name) {
      let obj = {};
      obj[name] = this[name]
      console.log(JSON.stringify(obj));
      changeInfo(obj).then(res => {
        if (res.success) {
          api.sendEvent({
            name: 'changeInfo',
          })
          api.toast({ msg: '修改成功' });
        }
      })
    },
    openWin(name) {
      openWin(name, { role: 'student', mobile: this.mobile })
    },
    quit() {
      this.$dialog.confirm({
        title: '提示',
        message: '是否要退出登录',
      }).then(() => {
        $api.clearStorage();
        api.closeWin();
        api.sendEvent({
          name: 'quit',
          // extra: {
          //   index: 2
          // }
        });
      }).catch(() => {
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .content {
    margin-top: 1px solid #f2f2f2;
    .image {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
    }
    .input-name {
      margin: 2rem;
      width: calc(100% - 4rem);
      border-bottom: 1px solid #f1f1f1;
      font-size: 1.4rem;
      padding: 1rem 0;
    }
    .submit {
      background: #4385ff;
      border-radius: 1.87rem;
      padding: 1.1rem;
      color: #fff;
      font-size: 1.5rem;
      text-align: center;
      margin-top: 2.85rem;
    }
  }
}
</style> 