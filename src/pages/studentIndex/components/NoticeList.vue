<template>
  <div class="tabbar-content">
    <div @click="openNoticeDetail(item.id)" v-for="(item,index) in formList" :key="index" class="tabbar-item">
      <div class="left-info">
        <img :src="item.picHost" alt="">
        <div class="title-info">
          <span class="title single-omit">{{item.title}}</span>
          <span class="time">{{item.publishDate}}</span>
        </div>
      </div>
      <van-icon name="arrow" />
    </div>
    <infinite-loading @infinite="getData" :identifier="infiniteId" direction="bottom">
      <div slot="spinner" class="state-style">读取中...</div>
      <div slot="no-more" class="state-style">已加载全部</div>
      <div slot="no-results" class="state-style">
        <no-list text="暂无公告"></no-list>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import noList from '@/components/noList'
import request from '@/api/student'
import { notice } from '@/common/router.js'
import { openWin } from '@/common/openPage.js'
export default {
  components: {
    BaseButton,
    noList
  },
  props: {
    tabType: {
      type: Number,
      default: 0
    }
  },
  watch: {
    tabType() {
      this.page = 1
      this.formList = []
      this.infiniteId += 1
    }
  },
  data() {
    return {
      page: 1,
      row: 10,
      formList: [],
      infiniteId: +new Date()
    }
  },
  methods: {
    getData($state) {
      request
        .getNoticeList(this.page, this.row, this.tabType)
        .then(({ value: { data } }) => {
          if (data.length) {
            this.page += 1
            this.formList.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch((err) => {})
    },
    openNoticeDetail(id) {
      openWin(notice, { id })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/baseStyle/Base-frame';
.tabbar-content {
  padding-bottom: 1rem;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  top: 6rem;
  bottom: 0;
  overflow-y: scroll;
  font-size: 1.4rem;
  font-weight: bold;
  line-height: 2.35rem;
  letter-spacing: 0.07rem;
  color: #333333;
  .tabbar-item {
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-info {
      display: flex;
      img {
        border: 1px soldi red;
        width: 6rem;
        height: 6rem;
        margin-right: 1rem;
      }
      .title-info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .title{
          font-weight: bolder;
        }
        .time {
          color: #697181;
        }
      }
    }
  }
  .state-style {
    padding: 1rem 0;
  }
}
</style>