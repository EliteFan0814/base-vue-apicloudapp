<template>
  <div class="container">
    <HeaderBetween leftText="艺企淘"></HeaderBetween>
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item @click="openBanner(item.page)" v-for="(item, index) in bannerList" :key="index"><img
            class="img-style" :src="item.url" alt="" /></van-swipe-item>
      </van-swipe>
    </div>
    <!-- tabbar -->
    <div class="tabbar-wrap">
      <div class="tabbar-list">
        <BaseTab @tabClick="handleTab" :tabs="tabbarList"></BaseTab>
      </div>
      <!-- 切换 -->
      <jobsList v-if="activeTab === 0"></jobsList>
      <NoticeList v-else></NoticeList>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import BaseTab from '@/components/baseTab'
import BaseButton from '@/components/BaseButton'

import JobsList from './components/JobsList'
import NoticeList from './components/NoticeList'
import { getUrlName } from '@/common/util.js'
import { login } from '@/common/router.js'
import request from '@/api/student'
import { openWin, openFrame } from '@/common/openPage.js'
export default {
  components: {
    HeaderBetween,
    BaseButton,
    BaseTab,
    NoticeList,
    JobsList
  },
  data() {
    return {
      activeTab: 0,
      userInfo: $api.getStorage('user').userInfo || {},
      bannerList: [
        {
          name: '商城',
          url: require('@/static/image/index/banner01.png'),
          page: ''
        }
      ],
      tabbarList: [
        { name: '招聘信息', value: 0 },
        { name: '平台公告', value: 1 }
      ]
    }
  },
  created() {
    api.addEventListener(
      {
        name: 'changeInfo'
      },
      (ret, err) => {
        this.getUserInfo()
      }
    )
  },
  methods: {
    handleTab(e) {
      this.activeTab = e
    },
    getUserInfo() {
      request.getInfo().then((res) => {
        this.userInfo = res.value
      })
    },
    // 打开 banner 详情
    openBanner(page) {
      if (page) {
      } else {
        this.$toast('敬请期待！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f5f5f5;
  padding: 0 2rem;
  min-height: 100vh;
  .banner {
    border-radius: 1rem;
    overflow: hidden;
    margin-top: 1rem;
    .my-swipe .van-swipe-item {
      height: 11rem;
      text-align: center;
      background-color: #39a9ed;
      .img-style {
        width: 100%;
        height: 11rem;
      }
    }
  }
  .tabbar-wrap {
    // border: 1px solid red;
    // padding: 0 2rem;
    // background-color: #f5f5f5;
    position: fixed;
    box-sizing: border-box;
    width: calc(100% - 4rem);
    top: 18rem;
    bottom: 0;
    .tabbar-list {
      padding: 1rem 0 2.5rem;
    }
  }
}
</style>
