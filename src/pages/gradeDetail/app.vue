<template>
  <div class="container">
    <headerBetween leftType leftText="班级详情" color="#fff" bgColor="transparent" :useHeight="false" />
    <div class="holder-block"></div>
    <div class="content-wrap">
      <div class="grade-detail">
        <div class="grade-title">
          {{gradeDetail.className}} 共{{gradeDetail.studentCount}}(人)
        </div>
        <div class="grade-statistics">
          <div class="top-info">
            <span>统计</span>
            <div @click="handleDialogShow" class="right-link">
              <img src="@/static/image/task/date.png" alt="">
              <span>{{nowYear}}年{{nowMonth}}月</span>
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="info">
            <div class="info-item">
              <span class="number">{{attendanceStatistics}}%</span>
              <span class="name">出勤率</span>
            </div>
            <div class="slide-line"></div>
            <div class="info-item">
              <span class="number">{{courseStatistics}}</span>
              <span class="name">课时数</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 记录 -->
      <div class="common-title-wrap">
        <span class="common-title">
          记录
        </span>
      </div>
      <div class="record-wrap">
        <div @click="openNameRecord" class="record-item">
          <div class="left-info">
            <span class="info-title">点名记录</span>
            <span class="info-btm">已点名 <span class="name-num">{{gradeDetail.tollCallCount}}</span></span>
          </div>
          <img src="@/static/image/task/name-list.png" alt="">
        </div>
        <div @click="openLeaveRecord" class="record-item">
          <div class="left-info">
            <span class="info-title">请假记录</span>
            <span class="info-btm">待审核 <span class="leave-num">{{gradeDetail.leaveCount}}</span></span>
          </div>
          <img src="@/static/image/task/leave-list.png" alt="">
        </div>
      </div>
      <!-- 通讯录 -->
      <div class="common-title-wrap">
        <span class="common-title">
          通讯录
        </span>
      </div>
      <div class="collapse-wrap">
        <!-- <div v-for="(item,index) in gradeContacts" :key="index" class="card-wrap">
          <div class="card">
            <div class="row-item">
              <img src="" alt="">
              <span>白胡子</span>
              <span>男</span>
              <span>白胡子海贼团</span>
            </div>
            <div class="row-item">
              <span>民族：哈啊哈</span>
            </div>
          </div>
          <div class="more">
            <div class="more-info" :class="{'more-info-show':item.isActive}">
              <div class="user-list">
                <div v-for="(member,memberIndex) in item.parents" :key="memberIndex" class="user-item">
                  <span class="left-info">
                    <span>{{member.relation}}</span>
                    <span class="user-text">
                      <img :src="member.hostWxHeader" alt="">
                      <span>{{member.wxName}}</span>
                    </span>
                  </span>
                  <span>{{member.mobile}}</span>
                </div>
              </div>
            </div>
            <div @click="handleSpread(index,item.isActive)" class="more-btn">
              <span v-if="item.isActive">收起联系人</span>
              <span v-else>查看联系人</span>
              <span>
                <van-icon v-if="item.isActive" name="arrow-up" />
                <van-icon v-else name="arrow-down" />
              </span>
            </div>
          </div>
        </div> -->
        <van-collapse v-model="activeNames" accordion>
          <van-collapse-item v-for="(item,index) in gradeContacts" :key="index" :name="index">
            <template #title>
              <div class="user-info">
                <img class="user-img" :src="item.hostHeader||require('@/static/image/personal/defualtHeader.png')"
                  alt="">
                <span class="user-name">{{item.name}}</span>
                <span class="user-name">{{item.gender}}</span>
                <span class="user-name">{{item.ethnic}}</span>
              </div>
              <div class="user-info more-info">
                <div class="user-name">考级：{{item.exam||'暂无'}}</div>
                <div class="user-name">出生日期：{{item.birthDay?item.birthDay.split(' ')[0]:'暂无'}}</div>
                <div class="user-name">身份证号：{{item.cardId||'暂无'}}</div>
                <div class="user-name">地址：{{item.address||'暂无'}}</div>
              </div>
            </template>
            <div class="user-list">
              <div v-for="(member,memberIndex) in item.parents" :key="memberIndex" class="user-item">
                <span class="left-info">
                  <span>{{member.relation}}</span>
                  <span class="user-text">
                    <img :src="member.hostWxHeader" alt="">
                    <span>{{member.wxName}}</span>
                  </span>
                </span>
                <!-- <span> <a href="tel:10086">{{member.mobile}}</a></span> -->
                <span>{{member.mobile}}</span>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <!-- 日期选择 -->
    <div class="date-picker">
      <van-popup v-model="showDatePicker" round position="bottom" :style="{ height: '40%' }">
        <div class="picker-content">
          <van-datetime-picker v-model="pickDate" @confirm="confirmPickDate" @cancel="cancelPickDate" type="year-month"
            title="选择年月" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import headerBetween from '@/components/headerBetween'
import request from '@/api/index'
import { rollCallRecord, leaveRecord } from '@/common/router.js'
import { openWin } from '@/common/openPage.js'

export default {
  components: {
    headerBetween
  },
  data() {
    return {
      showDatePicker: false,
      attendanceStatistics: undefined,
      courseStatistics: undefined,
      pickDate: undefined,
      currentDate: this.getCurrentDate(),
      minDate: this.getMinDate(),
      maxDate: this.getCurrentDate(),
      gradeId: api.pageParam.data.id,
      gradeDetail: {},
      gradeContacts: [],
      activeNames: 0
    }
  },
  computed: {
    // 返回年和月
    nowYear() {
      return this.currentDate.getFullYear()
    },
    nowMonth() {
      return this.currentDate.getMonth() + 1
    }
  },
  created() {
    this.getGradeDetail(this.gradeId)
    this.getGradeContacts(this.gradeId)
    this.getStatistics(this.gradeId, this.nowYear, this.nowMonth)
  },
  methods: {
    // 获取班级详情
    getGradeDetail(id) {
      request
        .getGradeDetail(id)
        .then((res) => {
          this.gradeDetail = res.value
        })
        .catch((err) => {})
    },
    // 获取班级通讯录
    getGradeContacts(id) {
      request
        .getGradeContacts(id)
        .then((res) => {
          this.gradeContacts = res.value.map((item, index) => {
            if (index === 0) {
              item.isActive = true
            } else {
              item.isActive = false
            }
            return item
          })
        })
        .catch((err) => {})
    },
    // 获取统计数据
    getStatistics(id, year, month) {
      // 出勤率
      request
        .getAttendanceStatistics(id, year, month)
        .then((res) => {
          this.attendanceStatistics = res.value.attendance
        })
        .catch((err) => {})
      // 课时数
      request
        .getCourseStatistics(id, year, month)
        .then((res) => {
          this.courseStatistics = res.value
        })
        .catch((err) => {})
    },
    // 处理展开状态
    handleSpread(index, isActive) {
      this.gradeContacts = this.gradeContacts.map((item, innerIndex) => {
        if (index === innerIndex) {
          item.isActive = !isActive
        }
        return item
      })
    },
    // 格式化日期选择显示
    formatter(type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
    },
    // 获取当前时间
    getCurrentDate() {
      return new Date(new Date().getFullYear(), new Date().getMonth())
    },
    //获取最小时间
    getMinDate() {
      return new Date(new Date().getFullYear() - 5, new Date().getMonth())
    },
    // 处理dialog显示
    handleDialogShow() {
      if (!this.showDatePicker) {
        this.pickDate = this.currentDate
      }
      this.showDatePicker = !this.showDatePicker
    },
    // 确认选择时间
    confirmPickDate(value) {
      this.currentDate = value
      this.getStatistics(this.gradeId, this.nowYear, this.nowMonth)
      this.handleDialogShow()
    },
    // 取消选择时间
    cancelPickDate() {
      this.handleDialogShow()
    },
    // 打开点名记录
    openNameRecord() {
      openWin(rollCallRecord, { id: this.gradeId })
    },
    // 打开请假记录
    openLeaveRecord() {
      openWin(leaveRecord, { id: this.gradeId })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Bold;
  padding: 0;
  background-color: #f5f5f5;
  .holder-block {
    height: 15rem;
    // background-color: #4385ff;
    background-color: #fff;
    background-image: url('../../static/image/class/top-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .content-wrap {
    // border: 1px solid green;
    padding: 0 2rem;
    background-color: #f5f5f5;
    .common-title-wrap {
      padding: 1.5rem 0;
      .common-title {
        position: relative;
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 2.35rem;
        letter-spacing: 0.12rem;
        color: #333333;
        &::after {
          position: absolute;
          bottom: -0.1rem;
          content: '';
          display: block;
          width: 120%;
          height: 0.75rem;
          background-color: #4385ff;
          border-radius: 0.38rem;
          opacity: 0.3;
        }
      }
    }
    .grade-detail {
      border-top: 1px solid transparent;
      .grade-title {
        margin-top: -8rem;
        margin-bottom: 1.65rem;
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 2.35rem;
        letter-spacing: 0.12rem;
        color: #ffffff;
      }
      .grade-statistics {
        padding: 0.5rem 1.5rem 2rem;
        background-color: #ffffff;
        background-image: url('../../static/image/class/bg-max.png');
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center bottom;
        box-shadow: 0rem 0.1rem 1rem 0rem rgba(67, 133, 255, 0.2);
        border-radius: 0.5rem;
        .top-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 2.35rem;
          letter-spacing: 0.12rem;
          color: #333333;
          margin-bottom: 2.25rem;
          .right-link {
            display: flex;
            align-items: center;
            font-size: 1.2rem;
            line-height: 2.35rem;
            letter-spacing: 0.09rem;
            color: #697181;
            img {
              width: 1.15rem;
            }
            span {
              margin: 0 0.3rem;
            }
          }
        }
        .info {
          display: flex;
          justify-content: space-between;
          .info-item {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 1.2rem;
            line-height: 2.35rem;
            letter-spacing: 0.09rem;
            color: #333333;
            .number {
              font-size: 1.8rem;
              font-weight: bold;
              line-height: 2.35rem;
              letter-spacing: 0.14rem;
              color: #4385ff;
            }
          }
          .slide-line {
            border-right: 1px solid #cccccc;
          }
        }
      }
    }
    .record-wrap {
      display: flex;
      justify-content: space-between;
      .record-item {
        display: flex;
        align-items: flex-start;
        background-color: #ffffff;
        background-image: url('../../static/image/class/bg-min.png');
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center bottom;
        box-shadow: 0rem 0.1rem 1rem 0rem rgba(67, 133, 255, 0.2);
        border-radius: 0.5rem;
        padding: 0.8rem 1rem;
        font-size: 1.5rem;
        line-height: 2.35rem;
        letter-spacing: 0.12rem;
        color: #333333;
        .left-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-right: 2.4rem;
          .info-btm {
            font-size: 1.2rem;
            .name-num {
              color: #4385ff;
            }
            .leave-num {
              color: #ffad5c;
            }
          }
        }
        img {
          width: 4.6rem;
          height: 6rem;
        }
      }
    }
    .collapse-wrap {
      // border: 1px solid red;
      box-sizing: border-box;
      position: fixed;
      top: 41rem;
      bottom: 0;
      width: calc(100% - 4rem);
      overflow-y: scroll;
      .user-info {
        display: flex;
        align-items: center;
        .user-img {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 50%;
          margin-right: 0.5rem;
          background-color: #c6daff;
        }
        .user-name {
          padding: 0 0.3rem;
          font-size: 1.4rem;
          line-height: 2.35rem;
          letter-spacing: 0.11rem;
          color: #697181;
        }
      }
      .more-info {
        margin-top: 0.3rem;
        flex-direction: column;
        align-items: flex-start;
      }
      .user-list {
        .user-item {
          font-size: 1.2rem;
          line-height: 2.35rem;
          letter-spacing: 0.09rem;
          color: #697181;
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          .left-info {
            display: flex;
            align-items: center;
            img {
              width: 2.4rem;
              height: 2.4rem;
              margin-right: 0.5rem;
              border-radius: 50%;
              background-color: #c6daff;
            }
            .user-text {
              margin-left: 1rem;
              display: flex;
              align-items: center;
            }
          }
        }
      }
      ::v-deep .van-collapse-item {
        margin-bottom: 1rem;
        border-radius: 0.5rem;
      }
      .card-wrap {
        border: 1px solid red;

        font-size: 1.4rem;
        line-height: 2.35rem;
        letter-spacing: 0.11rem;
        color: #697181;
        .card {
          padding: 0.5rem;
          .row-item {
            display: flex;
            align-items: center;
            img {
              display: block;
              border: 1px solid red;
              width: 3.2rem;
              height: 3.2rem;
              border-radius: 50%;
              margin-right: 0.5rem;
              background-color: #c6daff;
            }
            span {
              padding: 0 0.3rem;
            }
          }
        }
        .more {
          border: 1px solid red;
          .more-info {
            border: 1px solid green;
            padding: 0.3rem 0.2rem 0;
            // height: 0;
            display: none;
            overflow: hidden;
            transition: all 0.5s;
            .user-list {
              .user-item {
                font-size: 1.2rem;
                line-height: 2.35rem;
                letter-spacing: 0.09rem;
                color: #697181;
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                .left-info {
                  display: flex;
                  align-items: center;
                  img {
                    width: 2.4rem;
                    height: 2.4rem;
                    margin-right: 0.5rem;
                    border-radius: 50%;
                    background-color: #c6daff;
                  }
                  .user-text {
                    margin-left: 1rem;
                    display: flex;
                    align-items: center;
                  }
                }
              }
            }
          }
          .more-info-show {
            // min-height: 3rem;
          }
          .more-btn {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
