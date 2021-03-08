<template>
  <div class="tabbar-content">
    <div @click="openDetail(item.id)" v-for="(item,index) in formList" :key="index" class="tabbar-item">
      <div>
        <div class="school-name flex">
          <img :src="item.orgLogoHost||require('@/static/image/index/orgDefualt.png')">
          <div class="school-info">
            <div class="top">
              <span class="title">{{item.name}}</span>
              <span class="right-btn">查看详情
                <van-icon name="arrow" />
              </span>
            </div>
            <span class="org-name">{{item.orgName}}</span>
            <div class="mark-wrap">
              <span v-for="label in item.labelArr " class="mark">{{label}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <infinite-loading @infinite="getData" :identifier="infiniteId" direction="bottom">
      <div slot="spinner" class="state-style">读取中...</div>
      <div slot="no-more" class="state-style">已加载全部</div>
      <div slot="no-results" class="state-style">
        <no-list text="暂无信息"></no-list>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import noList from '@/components/noList'
import request from '@/api/student'
import { studentJobsDetail } from '@/common/router.js'
import { openWin } from '@/common/openPage.js'

export default {
  components: {
    BaseButton,
    noList
  },
  props: {},
  watch: {
    formType() {
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
        .getJobsList(this.page, this.row)
        .then(({ value: { data } }) => {
          if (data.length) {
            this.page += 1
            data.map((item) => {
              item.labelArr = (item.label || '无').split(',').filter((o) => o)
            })
            this.formList.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch((err) => {})
    },
    // 打开详情
    openDetail(id) {
      openWin(studentJobsDetail, { id })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    padding: 1rem;
    margin-bottom: 1rem;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.6rem;
      font-weight: bold;
      line-height: 2rem;
      letter-spacing: 0rem;
      // color: #697181;
      margin-bottom: 0.5rem;
      .title {
        font-weight: bolder;
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
    .org-name {
      color: #989fad;
    }
    .mark-wrap {
      margin: 0.5rem 0;
      white-space: pre-wrap;
      .mark {
        padding: 0.2rem;
        margin: 0 0.2rem;
        color: #697181;
        background-color: #f5f5f5;
      }
    }
  }
  .state-style {
    padding: 1rem 0;
  }
  .school-addr {
    color: #697181;
  }
  .school-name {
    display: flex;
    align-items: center;
    img {
      width: 7rem;
      height: 7rem;
      margin-right: 0.5rem;
      border-radius: 5px;
    }
    .school-info {
      flex: 1;
    }
  }
}
</style>