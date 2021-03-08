<template>
  <div class="container">
    <headerBetween leftText="修改信息" leftType class="headerBetween" />

    <div class="content">
      <van-cell center title="头像" is-link @click="upload">
        <template #right-icon>
          <img class="image student-img" :src="photo" alt="">
        </template>
      </van-cell>

      <van-field v-model="desc" type="textarea" rows="3" clearable label="个人简介" placeholder="请输入个人简介" />

      <!-- <van-cell center title="修改密码"  is-link @click="openWin"></van-cell> -->

      <div class="submit" @click="submit">修改信息</div>

    </div>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'

import { openWin } from '@/common/openPage.js'
import { changePwd } from '@/common/router.js'
import { changeInfo } from '@/api/personal'

export default {
  components: {
    headerBetween
  },
  data() {
    return {
      name: '',
      photo: '',
      desc: ''
    }
  },
  created() {
    this.photo = api.pageParam.data.photo
    this.desc = api.pageParam.data.desc
    console.log(this.photo)
  },
  methods: {
    async upload() {
      //上传图片
      let res = await this.$getPic()
      let fiel = await this.$fileUpload(res.data)
      if (fiel.success) {
        this.photo = fiel.hostPath[0]
        console.log(this.photo)
      }
    },
    submit() {
      const { desc, photo } = this
      if (!desc) {
        this.$toast.fail('请输入个人简介')
      } else {
        changeInfo({ photo, desc }).then((res) => {
          if (res.success) {
            api.toast({ msg: '修改成功' })
            api.sendEvent({
              name: 'changeInfo'
            })
          }
        })
      }
    },
    openWin() {}
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