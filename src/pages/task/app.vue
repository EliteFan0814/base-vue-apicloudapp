<template>
  <div class="container">
    <headerBetween leftText="作业" rightText="我的点评" @rightClick="rightClick" />

    <div class="screen flex">
      <baseTab @tabClick="tabClick" :tabs="tabs" class="tabs" />

      <baseDropdown :option="dropdown" :defaultValue="classId" @change="dropDownChange" type="classId"
        class="dropdown" />
    </div>

    <div class="list">
      <div class="list-item" v-for="item in list" :key="item.id" @click="open(item)">
        <div class="title flex">
          <div class="title-left">{{item.name}}</div>
          <div class="title-right flex">查看记录
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="time">
          开始日期：<span>{{item.beginDate | shortDate}}</span>
        </div>
        <div class="time flex">
          <div>结束日期：<span>{{item.endDate | shortDate}}</span></div>
          <div class="num">{{item.studentCount}}人</div>
        </div>
        <div class="bottom flex">
          <div class="bottom-left flex">
            已提交：<span>{{item.submitCount}}人</span>
          </div>
          <div class="bottom-right flex">
            已完成<span class="complete">{{item.submitCount}}</span>/{{item.totalCount}}
          </div>
        </div>
      </div>
    </div>

    <div class="release" @click="releaseClick">
      <img src="@/static/image/task/task.png" alt="">
    </div>

    <infinite-loading @infinite="getData" :identifier="infiniteId" infinite-scroll-distance="10" direction="bottom">
      <div slot="spinner" class="whiteBg">读取中...</div>
      <div slot="no-more" class="whiteBg">已加载全部</div>
      <div slot="no-results" class="whiteBg">
        <noList :text="classId ? '暂无作业' : '请选择班级'"></noList>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import baseTab from '@/components/baseTab'
import BaseDropdown from '@/components/BaseDropdown'
import noList from '@/components/noList'

import { openWin } from '@/common/openPage.js'
import { winPageIndex, createTask, taskRecord, comment } from '@/common/router.js'
import { taskList } from '@/api/task'
import { classList } from '@/api/class'
export default {
  components: {
    headerBetween,
    baseTab,
    BaseDropdown,
    noList
  },
  data() {
    return {
      dropdown: [],
      tabs: [
        {
          name: '单次作业',
          value: false
        },
        {
          name: '连续作业',
          value: true
        }
      ],
      isContinous: false,
      classId: '',
      page: 1,
      list: [],
      infiniteId: +new Date()
    }
  },
  created() {
    this.classList()
  },
  mounted() {
    const self = this
    api.addEventListener(
      {
        name: 'createTask'
      },
      function (ret, err) {
        self.resetData()
      }
    )
  },
  watch: {
    classId() {}
  },
  methods: {
    resetData() {
      this.list = []
      this.page = 1
      this.infiniteId += 1
    },
    async classList() {
      try {
        const classRes = await classList()
        let arr = classRes.value.data.map((item) => ({
          text: item.className,
          value: item.id
        }))
        this.classId = arr[0]['value']
        this.dropdown = arr
      } catch (err) {
        console.log(err)
      }
      // classList().then((res) => {
      //   let arr = res.value.data.map((item) => ({
      //     text: item.className,
      //     value: item.id
      //   }))
      //   this.classId = arr[0]['value']
      //   this.dropdown = arr
      // })
    },
    getData($state) {
      if (this.page === 1) {
        this.classList()
      }
      if (this.classId) {
        const infinite = this.infiniteId
        if (infinite === this.infiniteId) {
          taskList({
            page: this.page,
            pageSize: 10,
            classId: this.classId,
            isContinous: this.isContinous
          }).then((res) => {
            if (res.value.data.length) {
              this.list.push(...res.value.data)
              this.page += 1
              $state.loaded()
            } else {
              $state.complete()
            }
          })
        }
      } else {
        $state.complete()
      }
    },
    dropDownChange(val, type) {
      this[type] = val
      this.resetData()
    },
    releaseClick() {
      openWin(createTask, { id: this.classId })
    },
    rightClick() {
      openWin(comment, { id: this.classId })
    },
    open(item) {
      openWin(taskRecord, { item })
    },
    tabClick(type) {
      this.isContinous = type
      this.resetData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .screen {
    display: flex;
    padding-top: 1.5rem;
    .tabs {
      width: 70%;
    }
    .dropdown {
      width: 30%;
    }
  }

  .list {
    margin-top: 1.7rem;
    width: 100vw;
    margin-left: -1.5rem;
    padding: 0;
    color: #333;
    &-item {
      padding: 1.5rem;
      border-bottom: solid 1px #f5f5f5;
      padding-bottom: 2rem;
      .title {
        justify-content: space-between;
        &-left {
          font-size: 1.4rem;
          font-weight: bold;
        }
        &-right {
          font-size: 1.2rem;
          color: #666;
        }
      }

      .time {
        color: #697181;
        margin: 0.8rem 0;
      }
      .time.flex {
        justify-content: space-between;
        margin: 0 1.6rem 1.5rem 0;
        letter-spacing: 0.07rem;
        .num {
          color: #4385ff;
          font-size: 1.4rem;
        }
      }

      .bottom {
        justify-content: space-between;
        font-size: 1.2rem;
        &-right {
          .complete {
            margin-left: 0.3rem;
            color: #ffbea4;
          }
        }
      }

      &:nth-child(n + 2) {
        margin-top: 2rem;
      }
    }
  }

  .release {
    position: fixed;
    bottom: 6.5rem;
    right: 0rem;
    width: 10rem;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>