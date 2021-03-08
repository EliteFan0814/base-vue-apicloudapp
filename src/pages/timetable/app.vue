<template>
  <div class="container">
    <headerBetween leftType color="#fff" leftText="课程表" bgColor="#4385ff"></headerBetween>
    <div class="calendar-wrap">
      <div class="flag-bg-wrap">
        <div class="flag-info">
          <div class="flag-item">
            <span class="flag-dot"></span>
            <span>班级课程</span>
          </div>
          <div class="flag-item">
            <span class="flag-dot make-up-dot"></span>
            <span>补课</span>
          </div>
          <div class="flag-item">
            <span class="flag-dot"></span>
            <span class="flag-dot make-up-dot"></span>
            <span>班级课程&补课</span>
          </div>
        </div>
      </div>
      <div class="calendar">
        <!-- <calendar /> -->
        <!-- <inlineCalendar @change="onDayClick" @switch="slideTimetable" :minDate="currentYearFirstDate()"> -->
        <inlineCalendar @change="onDayClick" @switch="slideTimetable">
          <template v-slot:day="scope">
            <!-- 先判断是否是所显示的月份 -->
            <div v-for="(item,index) in attrs" :key="index">
              <template v-if="!scope.date.isGrey">
                <div v-if="scope.date.value == item.day" class="point-wrap">
                  <div v-if="item.value.isClass" class="point-blue" />
                  <div v-if="item.value.isMakeUp" class="point-red" />
                </div>
              </template>
            </div>
            <!-- <div v-if="scope.date.value === 1" class="point" /> -->
          </template>
        </inlineCalendar>

        <!-- <v-date-picker @update:to-page="slideTimetable" @dayclick="onDayClick" v-model="selectedDate"
          :attributes="attrs" :min-date="currentYearFirstDate()" is-expanded>
        </v-date-picker> -->
      </div>
    </div>
    <div class="course-wrap">
      <template v-if="courseList.length">
        <div class="course-list">
          <div v-for="(item,index) in courseList" :key="index" class="course-item">
            <span class="class-wrap">
              <span :class="['flag-dot', item.refType === 'MakeUp'?'make-up-dot':'']"></span>
              <span class="class-name">{{item.refName}}</span>
            </span>
            <span class="course-period">{{item.beginTime}} ~ {{item.endTime}}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <noList text="当天暂无课程"></noList>
      </template>
    </div>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import noList from '@/components/noList'
import request from '@/api/index'
import dayjs from 'dayjs'
export default {
  components: {
    headerBetween,
    noList
  },
  data() {
    return {
      show: true,
      todayDate: new Date(),
      dataLoaded: false,
      courseList: [],
      attrs: []
    }
  },
  computed: {
    // 返回年月日（以下四个值只在进入页面创建时使用一次）
    nowYear() {
      return this.todayDate.getFullYear()
    },
    nowMonth() {
      return this.todayDate.getMonth() + 1
    },
    nowDay() {
      return this.todayDate.getDate()
    },
    // 今天的 YYYY-MM-DD 格式
    nowDate() {
      return `${this.nowYear}-${this.nowMonth}-${this.nowDay}`
    }
  },
  created() {
    // slidBackEnabled: false,
    api.setWinAttr({
      slidBackEnabled: false
    })
    // 获取当月的课程表课程
    this.getTimetable(this.nowYear, this.nowMonth)
    // 获取今天的具体课程
    this.getCourseList(this.nowDate)
  },
  methods: {
    // 点击日历某一天
    onDayClick(e) {
      const nowDay = dayjs(e).format('YYYY-MM-DD')
      this.getCourseList(nowDay)
    },
    // 滑动日历
    slideTimetable(e) {
      this.getTimetable(e.year, e.month)
    },
    // 获取当年第一天
    currentYearFirstDate() {
      return new Date(new Date().getFullYear(), 0, 1)
    },
    // 获取日期课程表
    getTimetable(year, month) {
      request.getTimetable(year, month).then((res) => {
        const temp = this.objTransToArray(res.value)
        temp.map((item, index) => {
          const tempDay = item.name.split('-')
          item.day = tempDay[tempDay.length - 1]
        })
        this.attrs = temp
      })
    },
    // 工具函数 将对象转换为数组
    objTransToArray(obj) {
      let arr = []
      Object.keys(obj).forEach((itemKey) => {
        let o = {}
        o.name = itemKey
        o.value = obj[itemKey]
        arr.push(o)
      })
      return arr
    },
    // 获取当天课程
    getCourseList(day) {
      request
        .getCourse(day)
        .then((res) => {
          this.courseList = res.value
        })
        .then((err) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Medium;
  background-color: #f5f5f5;
  padding: 0;
  .flag-dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #3182ce;
    margin-right: 0.5rem;
  }
  .make-up-dot {
    background-color: #dd6b20;
  }
  .calendar-wrap {
    background-color: #f5f5f5;
    padding-bottom: 1.5rem;
    .flag-bg-wrap {
      background-color: #4385ff;
      .flag-info {
        border-radius: 1rem 1rem 0 0;
        background-color: #ffffff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.45rem 5rem 0.25rem;
        // padding-bottom: 1.5rem;
        font-size: 1.2rem;
        line-height: 2.35rem;
        letter-spacing: 0.09rem;
        color: #697181;
        border-bottom: 1px solid #f5f5f5;
        .flag-item {
          display: flex;
          align-items: center;
        }
      }
    }
    .calendar {
      ::v-deep .vc-container {
        border: none;
      }
      ::v-deep .m-calendar {
        .m-months-container {
          height: 210px;
        }
        .m-toolbar {
          font-size: 14px;
          height: 30px;
        }
      }
      ::v-deep .m-calendar .m-months-container .m-months-wrapper .m-months .m-row {
        height: 35px;
        .m-day {
          line-height: 35px;
          .m-select {
            background: #9ec0ed;
          }
        }
      }
      .point-wrap {
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        // border: 1px solid red;
        right: 20%;
        .point-blue {
          width: 5px;
          height: 5px;
          background-color: #3182ce;
          border-radius: 50%;
          margin: 0 1px;
        }
        .point-red {
          width: 5px;
          height: 5px;
          background-color: #dd6b20;
          border-radius: 50%;
          margin: 0 1px;
        }
      }
    }
  }
  .course-wrap {
    // border: 1px solid red;
    margin: 0 0rem;
    border-radius: 1rem;
    box-sizing: border-box;
    width: calc(100% - 0rem);
    position: fixed;
    top: 37.5rem;
    bottom: 0;
    overflow-y: scroll;
    background-color: #fff;
    .course-list {
      .course-item:nth-child(2n) {
        background-color: #f7faff;
      }
      .course-item:nth-child(2n + 1) {
        background-color: #fff;
      }
      .course-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.4rem;
        font-weight: bold;
        line-height: 2.35rem;
        letter-spacing: 0.07rem;
        color: #333333;
        padding: 1.65rem 1rem;
        .class-wrap {
          display: flex;
          align-items: center;
          .class-name {
            width: 16rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .course-period {
          font-size: 1.4rem;
          line-height: 2.35rem;
          letter-spacing: 0.07rem;
          color: #697181;
        }
      }
    }
  }
}
</style>