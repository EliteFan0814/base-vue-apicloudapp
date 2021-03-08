<template>
  <div class="container">
    <headerBetween leftText="数据统计" color="#fff" bgColor="transparent" :leftType="true" class="headerBetween" />
    <div class="bg">
      <img src="@/static/image/header-bg.png" alt="">
    </div>
    <div class="card flex">
      <div class="card-item">
        <div class="num">{{num.orgClassCount}}</div>
        <div class="text">任职班级数量</div>
      </div>
      <div class="card-item">
        <div class="num">{{num.studentCount}}</div>
        <div class="text">学生数量</div>
      </div>
    </div>

    <div class="list">
      <div class="list-title flex">
        <van-icon name="arrow-left" size="1.5rem" :color="leftArrowStop ? '#ccc' : '#697181'"
          @click="iconClick(false)" />
        <div class="text">{{year}}年{{month}}月</div>
        <van-icon name="arrow" size="1.5rem" :color="rightArrowStop ? '#ccc' : '#697181'" @click="iconClick(true)" />
      </div>

      <div class="list-item flex" :class="index == 0 && 'mt'" v-if="list.length > 0" v-for="(item, index) in list"
        :key="index">
        <div class="name">{{item.className}}</div>
        <div class="details flex">
          <div class="item">类型：{{item.refType}}&nbsp;</div>
          <div class="item">已用课时：{{item.useClassHours}}&nbsp;</div>
          <!-- <div class="item">补课：{{item.makeUpHours}}&nbsp;</div> -->
          <div class="item">出勤率：<span>{{item.classAttendance}}%</span></div>
        </div>
      </div>

      <noList v-if="list.length == 0" text="暂无数据" class="noList" />
    </div>

  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import noList from '@/components/noList'

import { classNum, classList } from '@/api/cencus'

export default {
  components: {
    headerBetween,
    noList
  },
  data() {
    return {
      tabs: ['比赛详情', '带队老师', '参赛名单', '比赛结果'],
      type: '比赛详情',
      page: 1,
      // maxYear: 2021,
      // maxMonth: 6,
      // year: 2021,
      // month: 3,
      maxYear: new Date().getFullYear(),
      maxMonth: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      num: {},
      list: [],
      leftArrowStop: false,
      rightArrowStop: true
    }
  },
  watch: {
    month(val) {
      if (this.year < this.maxYear) {
        this.rightArrowStop = false
      } else if (this.year === this.maxYear) {
        if (this.month < this.maxMonth) {
          this.rightArrowStop = false
        } else {
          this.rightArrowStop = true
        }
      } else {
        this.rightArrowStop = true
      }
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const [{ value: num }, { value: list }] = await Promise.all([
        classNum(),
        classList({
          page: this.page,
          pageSize: 10,
          year: this.year,
          month: this.month
        })
      ])
      this.num = num
      this.list = list.data
    },
    iconClick(key) {
      if (key) {
        // 如果是加日期
        if (!this.rightArrowStop) {
          if (this.month + 1 > 12) {
            this.year++
            this.month = 1
          } else {
            this.month++
          }
        }
      } else {
        // 如果是减日期
        if (!this.leftArrowStop) {
          if (this.month - 1 < 1) {
            this.year--
            this.month = 12
          } else {
            this.month--
          }
        }
      }
      // if ((this.month == 1 && !key) || (this.month > 11 && key)) return
      // this.leftArrowStop = false
      // this.rightArrowStop = false
      // this.month = key ? ++this.month : --this.month
      // this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // background: url('../../static/image/header-bg.png') no-repeat ;
  // border-bottom-left-radius: 10rem;
  // border-bottom-right-radius: 10rem;
  // background-size: 100vw 16rem;
  // padding-bottom: 0;
  position: relative;
  background: #f5f5f5;
  .headerBetween {
    position: absolute;
    z-index: 9;
  }
  .bg {
    width: 100vw;
    height: 18rem;
    margin-left: -1.5rem;
    position: absolute;
    img {
      width: 100%;
      height: 13rem;
      border-bottom-left-radius: 2.5rem;
      border-bottom-right-radius: 2.5rem;
    }
  }
  .card {
    position: relative;
    top: 7rem;
    padding: 3.15rem 0;
    text-align: center;
    background: #fff;
    box-shadow: 0rem 0.1rem 1rem 0rem rgba(67, 133, 255, 0.2);
    border-radius: 0.5rem;
    &-item {
      flex: 1;
      &:nth-child(n + 2) {
        border-left: 1px solid #ccc;
      }
      .num {
        font-size: 1.8rem;
        font-weight: bold;
        color: #4385ff;
      }
      .text {
        font-size: 1.4rem;
        color: #333;
      }
    }
  }
  .list {
    margin-top: 8.5rem;
    // box-shadow: 0rem 0.1rem 1rem 0rem rgba(67, 133, 255, 0.2);
    &-title {
      justify-content: space-between;
      padding: 1.5rem 2rem;
      background: #fff;
      border-radius: 1rem;
      .text {
        color: #4385ff;
        font-weight: bold;
        font-size: 1.8rem;
      }
    }
    .mt {
      margin-top: 1rem;
    }
    &-item {
      padding: 1.5rem;
      font-size: 1.4rem;
      border-radius: 1rem;
      justify-content: space-between;
      flex-wrap: wrap;
      &:nth-child(even) {
        background: #fff;
      }
      &:nth-child(odd) {
        background: #f0f0f0;
      }
      .name {
        font-size: 1.4rem;
        font-weight: bold;
        letter-spacing: 0.07rem;
        color: #333333;
        width: 100%;
      }
      .details {
        margin-top: 0.5rem;
        width: 100%;
        justify-content: space-between;
        .item {
          font-size: 1.4rem;
          letter-spacing: 0.07rem;
          color: #697181;
          &:nth-child(n + 2) {
            margin-left: 1rem;
          }
        }
      }
    }

    .noList {
      margin-top: 10rem;
    }
  }
}
</style>