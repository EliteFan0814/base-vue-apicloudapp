<template>
  <div class="container">
    <headerBetween leftText="公告详情" color="#fff" bgColor="transparent" :leftType="true" class="headerBetween" />
    <div class="bg">
      <img src="@/static/image/header-bg.png" alt="">
    </div>

    <div class="card">
      <div class="title-name ellipsis_2">{{info.title}}</div>
      <div class="content" v-html="info.content"></div>

      <div class="bottom">
        <div class="name">{{info.isPlatformStr == '机构' ? info.orgInfo.orgName : info.isPlatformStr}}</div>
        <div class="time">发布时间：<span v-if="info.publishDate">{{info.publishDate | shortDate}}</span></div>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'

import { noticeInfo } from '@/api/personal'

export default {
  components: {
    headerBetween
  },
  data() {
    return {
      info: {}
    }
  },
  created() {
    this.id = api.pageParam.data.id
    this.noticeInfo()
  },
  methods: {
    noticeInfo() {
      noticeInfo({ articleId: this.id }).then((res) => {
        res.value.content = res.value.content.replace(/\<img/, '<img style="max-width:100%;height:auto;display:block" ')
        this.info = res.value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // border: 1px solid red;
  position: relative;
  background: #f5f5f5;
  .headerBetween {
    position: absolute;
    z-index: 9;
  }
  .bg {
    // border: 1px solid red;
    width: 100vw;
    height: 18rem;
    margin-left: -1.5rem;
    img {
      width: 100%;
    }
  }

  .card {
    // border: 1px solid red;
    width: calc(100vw - 3rem);
    // min-height: 60rem;
    position: absolute;
    top: 8.2rem;
    bottom: 0;
    padding: 0rem 1.7rem 10rem;
    // margin-bottom: 2rem;
    box-sizing: border-box;
    background: #fff;
    border-radius: 0.5rem;
    .title-name {
      // border: 1px solid transparent;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 7rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: #697181;
      border-bottom: 2px dashed #4385ff;
    }
    .content {
      position: absolute;
      width: calc(100% - 3.4rem);
      top: 8rem;
      bottom: 8rem;
      overflow-y: scroll;
      font-size: 1.3rem;
      color: #697181;
    }

    .bottom {
      position: absolute;
      bottom: 4rem;
      right: 1.65rem;
      text-align: right;
      font-size: 1.4rem;
      color: #989fad;
      .time {
        margin-top: 0.3rem;
      }
    }
  }
}
</style>