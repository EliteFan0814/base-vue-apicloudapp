<template>
  <div class="container">
    <div class="pub-header">
      <HeaderBetween leftText="工作台"></HeaderBetween>
    </div>
    <div class="bench-list">
      <div @click="handleOpen(item.url)" v-for="(item,index) in benchList" :key="index" class="bench-item">
        <div class="left-wrap">
          <span class="name">{{item.name}}</span>
          <span>{{item.info}}</span>
        </div>
        <div class="img-wrap">
          <img :src="item.img" alt="">
        </div>
        <div v-if="item.todoNumber" class="point">{{item.todoNumber}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import { tuitionPayment, timetable, gradeManage, matchManage, census, makeUpRecord } from '@/common/router'
import { openWin, openFrame } from '@/common/openPage.js'
import request from '@/api/index'

export default {
  components: {
    HeaderBetween
  },
  data() {
    return {
      userInfo: $api.getStorage('user').userInfo || {},
      benchList: [
        {
          name: '班级课程表',
          info: '查看您的班级课程信息',
          img: require('@/static/image/workbench/timetable.png'),
          url: timetable
        },
        {
          name: '班级管理',
          info: '查看您的上课记录',
          img: require('@/static/image/workbench/grade-contral.png'),
          url: gradeManage,
          todoNumber: undefined
        },
        {
          name: '比赛管理',
          info: '查看比赛公告、比赛项目',
          img: require('@/static/image/workbench/play.png'),
          url: matchManage
        },
        {
          name: '数据统计',
          info: '查看班级出勤、课时情况',
          img: require('@/static/image/workbench/statistics.png'),
          url: census
        },
        {
          name: '补课记录',
          info: '查看班级出勤、出勤情况',
          img: require('@/static/image/workbench/make.png'),
          url: makeUpRecord
        },
        // {
        //   name: '学费缴纳',
        //   info: '管理学生缴费信息',
        //   img: require('@/static/image/workbench/withdraw.png'),
        //   url: tuitionPayment
        // }
      ]
    }
  },
  created() {
    this.getTodoInfo()
  },
  mounted() {
    api.addEventListener(
      {
        name: 'changeTodoNum'
      },
      (res, err) => {
        this.getTodoInfo()
      }
    )
  },
  methods: {
    handleOpen(url) {
      if (url) {
        openWin(url, { type: 'MakeUp' })
      } else {
        this.$toast('暂未开通，敬请期待！')
      }
    },
    // 获取代办
    getTodoInfo() {
      request
        .getTodoInfo()
        .then((res) => {
          this.benchList[1].todoNumber = res.value.studentLeave
        })
        .catch((err) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Bold;
  background-color: #f5f5f5;
  padding: 0;
  .pub-header {
    .header-wrap {
      background-color: #fff;
      padding: 1.75rem 2rem;
    }
  }
  .bench-list {
    padding: 2rem;
    .bench-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0.35rem 3.25rem;
      background-color: #ffffff;
      box-shadow: 0rem 0.1rem 1rem 0rem rgba(67, 133, 255, 0.2);
      border-radius: 1rem;
      font-size: 1.2rem;
      line-height: 2.35rem;
      letter-spacing: 0.06rem;
      color: #999999;
      .left-wrap {
        display: flex;
        flex-direction: column;
        .name {
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 2.35rem;
          letter-spacing: 0.08rem;
          color: #333333;
        }
      }
      .img-wrap {
        // border: 1px solid red;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 9rem;
        height: 9rem;
        img {
          max-width: 9rem;
          max-height: 9rem;
        }
      }
      .point {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        line-height: 1;
        color: #fff;
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        width: 2.1rem;
        height: 2.1rem;
        border-radius: 50%;
        background-color: red;
      }
    }
  }
}
</style>