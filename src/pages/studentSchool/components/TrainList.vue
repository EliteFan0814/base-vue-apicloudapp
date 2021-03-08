<template>
  <div class="tabbar-content">
    <div v-for="(item,index) in formList" :key="index" class="tabbar-item">
      <!-- 师资培训 -->
      <div class="bar-top">
        <div class="left-info">
          <span class="title">{{item.title}}</span>
          <span class="time">课程：{{item.trainingTypeName}}</span>
        </div>
        <BaseButton @click="openJoinDetail(item.id)" name="前往报名"></BaseButton>
      </div>
      <div class="bar-btm">
        <span>开始时间：{{item.createDate.split(' ')[0]}}</span>
        <span>结束时间：{{item.endDate.split(' ')[0]}}</span>
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
import { gradeDetail, teacherTrain } from '@/common/router.js'
import { openWin } from '@/common/openPage.js'

export default {
  components: {
    BaseButton,
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
  methods: {
    getData($state) {
      request
        .getTrainList(this.page, this.row)
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
    // 打开报名
    openJoinDetail(id) {
      openWin(teacherTrain, { id })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabbar-content {
  padding-bottom: 1rem;
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
    .bar-top {
      margin-bottom: 1rem;
      &,
      .left-info {
        display: flex;
      }
      align-items: center;
      justify-content: space-between;
      .left-info {
        flex-direction: column;
        .title {
          font-weight: bolder;
        }
        .time {
          color: #989fad;
        }
      }
    }
    .bar-btm {
      color: #989fad;
      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      line-height: 1.8rem;
      letter-spacing: 0rem;
    }
  }
  .state-style {
    padding: 1rem 0;
  }
}
</style>