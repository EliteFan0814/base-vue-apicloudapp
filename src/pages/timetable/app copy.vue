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
        <calendar />
        <inlineCalendar />

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
export default {
  components: {
    headerBetween,
    noList
  },
  data() {
    return {
      show: true,
      selectedDate: new Date(),
      dataLoaded: false,
      courseList: [],
      attrs: [
        {
          dot: 'blue',
          dates: [],
        },
        {
          dot: 'orange',
          dates: [],
        },
      ],
    }
  },
  computed: {
    // 返回年月日（以下四个值只在进入页面创建时使用一次）
    nowYear() {
      return this.selectedDate.getFullYear()
    },
    nowMonth() {
      return this.selectedDate.getMonth() + 1
    },
    nowDay() {
      return this.selectedDate.getDate()
    },
    nowDate() {
      return `${this.nowYear}-${this.nowMonth}-${this.nowDay}`
    }
  },
  methods: {
    // 滑动日历事件 注意此函数在页面创建的时候会自动触发一次
    slideTimetable(e) {
      this.getTimetable(e.year, e.month) // 获取当月日历所有课程
      this.getCourseList(this.nowDate) // 获取当天具体课程
    },
    // 点击日历某一天
    onDayClick(dayInfo) {
      this.getCourseList(dayInfo.id)
    },
    // 获取当年第一天
    currentYearFirstDate() {
      return new Date(new Date().getFullYear(), 0, 1);
    },
    // 获取日期课程表
    getTimetable(year, month) {
      request.getTimetable(year, month).then(res => {
        let attrs = [
          {
            dot: 'blue',
            dates: [],
          },
          {
            dot: 'orange',
            dates: [],
          }
        ]
        const temp = this.objTransToArray(res.value)
        temp.map((item, index) => {
          if (item.value.isClass) {
            attrs[0].dates.push(new Date(item.name))
          }
          if (item.value.isMakeUp) {
            attrs[1].dates.push(new Date(item.name))
          }
        })
        this.attrs = attrs
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
      request.getCourse(day).then(res => {
        this.courseList = res.value
        // alert(JSON.stringify(res))
      }).then(err => { })
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
        padding: 1.45rem 5rem 1.25rem;
        padding-bottom: 1.5rem;
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
    }
  }
  .course-wrap {
    // border: 1px solid red;
    margin: 0 2rem;
    border-radius: 1rem;
    box-sizing: border-box;
    width: calc(100% - 4rem);
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