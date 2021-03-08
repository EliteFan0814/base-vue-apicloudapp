<template>
  <div class="article-wrap">
    <div @click="openWin(item.id)" class="card" v-for="item in list" :key="item.id">
      <div class="title">
        <span class="text">{{item.title}}</span>
        <span class="right-btn">查看详情
          <van-icon name="arrow" />
        </span>
      </div>
      <div class="flex">
        <div class="left">
          <div class="left-item">
            报名截止日期：<span>{{item.entriesEnd?item.entriesEnd.split(' ')[0]:''}}</span>
          </div>
          <div class="left-item">
            比赛地点：<span>{{item.address}}</span>
          </div>
        </div>
        <!-- <div class="right" @click="openWin(item.id)">
          <baseButton name="查看详情" />
        </div> -->
      </div>
    </div>

    <infinite-loading @infinite="articleList" :identifier="infiniteId" infinite-scroll-distance="10" direction="bottom">
      <div slot="spinner" class="whiteBg">读取中...</div>
      <div slot="no-more" class="whiteBg">已加载全部</div>
      <div slot="no-results" class="whiteBg">
        <noList text="暂无公告"></noList>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import baseButton from '@/components/BaseButton'
import noList from '@/components/noList'

import { openWin } from '@/common/openPage.js'
import { articleInfo } from '@/common/router.js'
import { articleList } from '@/api/matchManage'

export default {
  components: {
    baseButton,
    noList
  },
  data() {
    return {
      list: [],
      page: 1,
      infiniteId: + new Date(),
    }
  },
  methods: {
    articleList($state) {
      const infinite = this.infiniteId
      if (infinite === this.infiniteId) {
        articleList({
          page: this.page,
          pageSize: 10,
        })
          .then(res => {
            console.log(JSON.stringify(res.value.data));
            if (res.value.data.length) {
              this.list.push(...res.value.data)
              this.page += 1
              $state.loaded()
            } else {
              $state.complete()
            }
          })
      }
    },
    openWin(id) {
      openWin(articleInfo, { id })
    }
  }
}
</script>

<style lang="scss" scoped>
.article-wrap {
  margin-top: 1rem;
  padding: 0 1.5rem;
  .card {
    background: #fff;
    padding: 1.3rem 1.55rem 2.05rem 1.15rem;
    border-radius: 1rem;
    margin-bottom: 2rem;
    &:nth-child(n + 2) {
      margin-top: 1.5rem;
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.5rem;
      .text{
        font-weight: bolder;
        width: 65vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .right-btn {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        line-height: 2rem;
        letter-spacing: 0rem;
        color: #697181;
      }
    }
    .flex {
      margin-top: 1rem;
      font-size: 1.2rem;
      justify-content: space-between;
      color: #697181;
      .left {
        &-item {
          &:nth-child(n + 2) {
            margin-top: 0.5rem;
          }
        }
      }
      .right {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>


