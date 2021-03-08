<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div class="container">
      <div class="pub-header">
        <HeaderBetween leftText="艺企淘"></HeaderBetween>
      </div>
      <!-- 顶部按钮 -->
      <div class="tab-list-wrap">
        <!-- 顶部轮播 -->
        <div class="swiper-wrap">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item>
              <img src="@/static/image/index/banner.png" alt="">
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="tab-list">
          <div @click="handleOpen(item)" v-for="(item ,index) in tabList" :key="index" class="tab-item">
            <div v-if="item.haveTodo&&item.todoNumber!== 0" class="todo-style">
              <!-- <div class="todo-style"> -->
              <span v-if="index ===0">{{item.todoNumber}}</span>
              <span v-if="index ===2">{{item.todoNumber}}</span>
            </div>
            <div class="img-wrap">
              <img :src="item.img" alt="">

            </div>
            <span class="span-name">{{item.name}}</span>
          </div>
        </div>
        <div class="tabbar-list">
          <div class="list-wrap">
            <BaseTab @tabClick="handleTab" :tabs="tabbarList"></BaseTab>
          </div>
        </div>
      </div>
      <!-- tabbar -->
      <div class="tabbar-wrap">
        <!-- 切换 -->
        <NoticeList v-if="isShowNotice" :tabType="tabType" :refresh="refreshId">
        </NoticeList>
        <StaffList v-else :formType="formType" :refresh="refreshId"></StaffList>
      </div>
    </div>
  </van-pull-refresh>

</template>

<script>
import BaseTab from '@/components/baseTab'
import BaseButton from '@/components/BaseButton'
import HeaderBetween from '@/components/headerBetween'
import { getUrlName } from '@/common/util.js'
import request from '@/api/index'
import { login, gradeManage, workbench, task, timetable, matchManage, rollCall, census } from '@/common/router.js'
import { openWin, openFrame } from '@/common/openPage.js'

import NoticeList from './components/NoticeList'
import StaffList from './components/StaffList'

export default {
  components: {
    BaseTab,
    BaseButton,
    HeaderBetween,
    NoticeList,
    StaffList
  },
  data() {
    return {
      isLoading: false,
      userInfo: $api.getStorage('user').userInfo || {},
      studentLeave: undefined,
      assignment: undefined,
      tabList: [
        // {
        //   img: require('@/static/image/index/grade.png'),
        //   name: '班级',
        //   url: gradeManage,
        //   isFramePage: false,
        //   haveTodo: true,
        //   todoNumber: 0
        // },
        // {
        //   img: require('@/static/image/index/workbench.png'),
        //   name: '工作台',
        //   url: workbench,
        //   isFramePage: true,
        //   tabbarIndex: 1,
        //   haveTodo: false,
        //   todoNumber: 0
        // },
        // {
        //   img: require('@/static/image/index/task.png'),
        //   name: '改作业',
        //   url: task,
        //   isFramePage: true,
        //   tabbarIndex: 2,
        //   haveTodo: true,
        //   todoNumber: 0
        // },
        {
          img: require('@/static/image/index/timetable.png'),
          name: '课程表',
          url: timetable,
          isFramePage: false,
          haveTodo: false,
          todoNumber: 0
        },
        {
          img: require('@/static/image/index/play.png'),
          name: '比赛',
          url: matchManage,
          isFramePage: false,
          haveTodo: false,
          todoNumber: 0
        },
        {
          img: require('@/static/image/index/call-name.png'),
          name: '点名',
          url: rollCall,
          isFramePage: false,
          haveTodo: false,
          todoNumber: 0
        },
        {
          img: require('@/static/image/index/statistics.png'),
          name: '统计',
          url: census,
          isFramePage: false,
          haveTodo: false,
          todoNumber: 0
        }
        // {
        //   img: require('@/static/image/index/mall.png'),
        //   name: '商城',
        //   url: '',
        //   isFramePage: false,
        //   haveTodo: false,
        //   todoNumber: 0
        // }
      ],
      isShowNotice: true,
      tabType: 0,
      formType: undefined,
      tabbarList: [
        { name: '平台公告', value: 'platform' },
        { name: '机构公告', value: 'orgform' },
        { name: '班级管理', value: 'gradeform' },
        { name: '师资培训', value: 'teacherform' }
      ],
      refreshId: +new Date()
      // startPullDownRefresh: false
    }
  },
  created() {
    this.getTodoInfo()
  },
  mounted() {
    const self = this
  },
  methods: {
    // 下拉刷新
    onRefresh() {
      this.refreshId += 1
      this.getTodoInfo()
      this.isLoading = false
    },
    // 打开相应页面
    handleOpen(e) {
      if (!e.url) {
        return api.toast({ msg: '敬请期待' })
      } else {
        // 以 frame 方式打开页面
        if (e.isFramePage) {
          api.sendEvent({
            name: 'ClickTabbarInPage',
            extra: {
              index: e.tabbarIndex
            }
          })
          // openFrame(e.url)
        } else {
          // 以 window 方式打开页面
          openWin(e.url)
        }
      }
    },
    // 处理 tab 点击
    handleTab(e) {
      switch (e) {
        case 'platform':
          this.tabType = 0
          this.isShowNotice = true
          break
        case 'orgform':
          this.tabType = $api.getStorage('user').userInfo.orgId
          this.isShowNotice = true
          break
        case 'gradeform':
          this.isShowNotice = false
          this.formType = e
          break
        case 'teacherform':
          this.isShowNotice = false
          this.formType = e
          break
        default:
      }
    },
    // 获取代办
    getTodoInfo() {
      request
        .getTodoInfo()
        .then((res) => {
          this.tabList[0].todoNumber = res.value.studentLeave
          this.tabList[2].todoNumber = res.value.assignment
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
    }
  }
  .tab-list-wrap {
    position: fixed;
    z-index: 3;
    width: 100%;
    .swiper-wrap {
      background-color: #fff;
      padding: 0.8rem 1.75rem 0;
      img {
        width: 100%;
        border-radius: 1rem;
      }
    }
    .tab-list {
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      font-size: 1.4rem;
      font-weight: bold;
      line-height: 2.35rem;
      letter-spacing: 0.07rem;
      color: #333333;
      .tab-item {
        position: relative;
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 5.5rem;
          height: 5.5rem;
          img {
            width: 3.2rem;
            height: 3.2rem;
          }
        }
        .span-name {
          font-weight: 700;
        }
        .todo-style {
          position: absolute;
          top: 0.2rem;
          right: 1.5rem;
          width: 1.3rem;
          height: 1.3rem;
          font-size: 1.2rem;
          line-height: 1.3rem;
          text-align: center;
          background-color: red;
          border-radius: 50%;
          color: #fff;
          padding: 0.4rem;
        }
      }
    }
    .tabbar-list {
      // border: 1px solid red;
      background-color: #f5f5f5;
      padding-top: 0.5rem;
      .list-wrap {
        // border: 1px solid red;
        background-color: #fff;
        padding: 1rem 0rem 0rem;
      }
    }
  }
  .tabbar-wrap {
    margin-top: 26.5rem;
    background-color: #f5f5f5;
  }
}
</style>