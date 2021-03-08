<template>
  <div class="container">
    <div class="pub-header">
      <HeaderBetween leftType leftText="班级管理"></HeaderBetween>
    </div>
    <div class="grade-content">
      <div v-for="(item,index) in formList" class="grade-item">
        <div class="item-top">
          <div class="left-info">
            <span class="class-name">{{item.className}}</span>
            <span class="num">学员数：{{item.studentCount}}</span>
          </div>
          <div class="btn-wrap">
            <div v-if="item.leaveCount" class="leave-num">{{item.leaveCount}}</div>
            <BaseButton @click="openGradeDetail(item.id)" name="进入班级"></BaseButton>
          </div>
        </div>
        <div class="item-btm">
          <!-- <span>待审核请假数：{{item.createDate | shortDate}}</span> -->
          <span>创建时间：{{item.createDate | shortDate}}</span>
          <!-- <span>结束时间：{{item.endtime}}</span> -->
        </div>
      </div>
      <infinite-loading :identifier="infiniteId" @infinite="getData" direction="bottom">
        <div slot="spinner" class="state-style">读取中...</div>
        <div slot="no-more" class="state-style">已加载全部</div>
        <div slot="no-results" class="state-style">
          <no-list text="暂无班级"></no-list>
        </div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import HeaderBetween from '@/components/headerBetween'
import noList from '@/components/noList'
import request from '@/api/index'
import { gradeDetail } from '@/common/router.js'
import { openWin, openFrame } from '@/common/openPage.js'

export default {
  components: {
    BaseButton,
    HeaderBetween,
    noList
  },
  data() {
    return {
      page: 1,
      row: 10,
      formList: [],
      infiniteId: +new Date()
    }
  },
  created() {
    api.addEventListener(
      {
        name: 'viewappear'
      },
      (res, err) => {
        this.page = 1
        this.formList = []
        this.infiniteId += 1
      }
    )
  },
  methods: {
    getData($state) {
      let url = 'getGradeList'
      request[url](this.page, this.row)
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
    //
    openGradeDetail(id) {
      openWin(gradeDetail, { id })
      // request.getGradeDetail(id).then(res => {

      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Bold;
  background-color: #f5f5f5;
  // padding: 0 2rem;
  .pub-header {
    .header-wrap {
      background-color: #fff;
      padding: 1.75rem 2rem;
    }
  }
  .grade-content {
    padding-top: 2rem;
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 2.35rem;
    letter-spacing: 0.07rem;
    color: #333333;
    .grade-item {
      // border: 1px solid red;
      background-color: #fff;
      padding: 2rem 0;
      border-radius: 1rem;
      padding: 1rem 1.2rem;
      margin-bottom: 1rem;
      .item-top {
        margin-bottom: 1rem;
        &,
        .left-info {
          display: flex;
        }
        align-items: center;
        justify-content: space-between;
        .left-info {
          flex-direction: column;
          .class-name {
            color: #000;
            font-size: 1.5rem;
            font-weight: bolder;
          }
          .num {
            color: #697181;
            font-size: 1.4rem;
          }
        }
        .btn-wrap {
          position: relative;
          .leave-num {
            position: absolute;
            top: -0.5rem;
            color: #fff;
            right: 0;
            width: 1.4rem;
            height: 1.4rem;
            font-size: 1.2rem;
            line-height: 1.4rem;
            background-color: red;
            border-radius: 50%;
            text-align: center;
            padding: 0.2rem;
          }
        }
      }
      .item-btm {
        color: #989fad;
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
        line-height: 1.8rem;
        letter-spacing: 0rem;
      }
    }
  }
  .state-style {
    padding: 1rem 0;
  }
}
</style>