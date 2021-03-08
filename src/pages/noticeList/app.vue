<template>
  <div class="container">
    <headerBetween leftType leftText="公告"></headerBetween>

    <div class="content">
      <div class="list">
        <div class="list-item flex" v-for="(item, index) in artList" :key="item.id" @click="open(item.id)">
          <img :src="item.picHost" alt="">
          <div class="details">
            <div class="title ellipsis_2">{{item.title}}</div>
            <div class="bottom flex">
              <div class="time">{{item.publishDate}}</div>
              <div class="text">发布方 <span>{{item.isPlatformStr}}/</span>{{item.orgInfo.orgName}}</div>
            </div>
          </div>
        </div>
      </div>

      <infinite-loading @infinite="getData" :identifier="infiniteId" direction="bottom">
        <div slot="spinner" class="whiteBg">读取中...</div>
        <div slot="no-more" class="whiteBg">已加载全部</div>
        <div slot="no-results" class="gonggao">
          暂无公告
        </div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'

import { openWin } from '@/common/openPage.js'
import { notice } from '@/common/router.js'
import { noticeList } from '@/api/personal'

export default {
  components: {
    headerBetween
  },
  data() {
    return {
      artList: [],
      page: 1,
      infiniteId: +new Date(),
    }
  },
  methods: {
    getData($state) {
      const infinite = this.infiniteId
      if (infinite === this.infiniteId) {
        noticeList({ page: this.page, pageSize: 10, }).then((res) => {
          if (res.value.data.length) {
            this.page += 1
            this.artList.push(...res.value.data)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
      }
    },
    open(id) {
      openWin(notice, { id })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  .content {
    width: 100vw;
    min-height: calc(100vh - 50px);
    background-color: #f5f5f5;
    margin-left: -1.5rem;
    padding: 1.5rem;
    box-sizing: border-box;
  }
  .list {
    margin-bottom: 2rem;
    &-item {
      padding: 1.3rem 1.1rem 1.3rem 1.6rem;
      background-color: #ffffff;
      border-radius: 0.5rem;
      &:nth-child(n + 2) {
        margin-top: 1.5rem;
      }
      img {
        width: 9.65rem;
        height: 7.05rem;
      }
      .details {
        margin-left: 1.1rem;
        flex: 1;
        .title {
          width: 19.55rem;
          font-size: 1.4rem;
          font-weight: 800;
          color: #697181;
        }
        .bottom {
          justify-content: space-between;
          font-size: 1.2rem;
          color: #989fad;
          margin-top: 2.4rem;
          .time {
          }
          .text {
          }
        }
      }
    }
  }
}
</style>
