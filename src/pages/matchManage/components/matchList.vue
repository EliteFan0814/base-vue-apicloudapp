<template>
  <div class="article-wrap">
    <div @click="openWin(item.id)" class="card" v-for="item in list" :key="item.id">
      <div class="title">
        <span class="text">
          {{item.title}}
          <van-tag v-if="item.hasResult" :type="item.hasResult ? 'primary' : 'warning'" round plain>{{item.isEndStr}}</van-tag>
        </span>
        <span class="right-btn">查看详情
          <van-icon name="arrow" />
        </span>
      </div>
      <div class="details-flex flex">
        <div class="left">
          <div class="left-item">
            学院名称：<span>{{item.orgName}}</span>
          </div>
          <div class="left-item">
            参赛人数：<span>{{item.studentCount}}人</span>
          </div>
          <div class="left-item">
            比赛时间：<span>{{item.contestDate}}</span>
          </div>
        </div>
        <!-- <div class="right" @click="openWin(item.id)">
          <baseButton name="查看详情" />
        </div> -->
      </div>
      <div class="bottom flex">
        带队老师：<span>{{item.teachersStr}}</span>
      </div>
    </div>

    <infinite-loading @infinite="matchList" :identifier="infiniteId" infinite-scroll-distance="10" direction="bottom">
      <div slot="spinner" class="whiteBg">读取中...</div>
      <div slot="no-more" class="whiteBg">已加载全部</div>
      <div slot="no-results" class="whiteBg">
        <noList text="暂无比赛"></noList>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import baseButton from '@/components/BaseButton'
import noList from '@/components/noList'

import { openWin } from '@/common/openPage.js'
import { match } from '@/common/router.js'
import { matchList } from '@/api/matchManage'

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
    matchList($state) {
      const infinite = this.infiniteId
      if (infinite === this.infiniteId) {
        matchList({
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
      openWin(match, { id })
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
    padding: 1.3rem 1.55rem 1.35rem 1.15rem;
    border-radius: 1rem;
    margin-bottom: 2rem;
    &:nth-child(n + 2) {
      margin-top: 1.5rem;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.5rem;
      .text{
        font-weight: bolder;
        width: 65vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .van-tag {
        margin-left: 0.5rem;
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
    .details-flex {
      margin-top: 1rem;
      font-size: 1.2rem;
      justify-content: space-between;
      color: #697181;
      padding-bottom: 1.75rem;
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
    .bottom {
      font-size: 1.2rem;
      color: #989fad;
      // padding: .85rem 0;
      &::before {
        display: block;
        content: "";
        width: 100%;
        border: 1px solid #f5f5f5;
        margin-bottom: 0.85rem;
      }
      img {
        width: 2rem;
        height: 2rem;
        margin-right: 1rem;
        border-radius: 50%;
      }
    }
  }
}
</style>


