<template>
  <div class="container">
    <div class="pub-header">
      <HeaderBetween leftType leftText="学员搜索"></HeaderBetween>
    </div>
    <div class="content">
      <div class="form-item top-search ">
        <div class="search-wrap">
          <div class="left">
            <BaseDropdown :option="option" :defaultValue="defaultValue" :overlay="false" @change="handleChange"
              class="drop-style">
            </BaseDropdown>
          </div>
          <div class="right">
            <van-field v-model="studentName" placeholder="请输入学员姓名">
              <template #right-icon>
                <div @click="handleSearch"><img src="@/static/image/icon/search.png" alt="" class="search"></div>
              </template>
            </van-field>
          </div>
        </div>
      </div>
      <div class="holder"></div>
      <div v-if="resultList.length" class="list-wrap">
        <div v-for="(item,index) in resultList" :key="index" class="list-item" @click="handleSelect(item)">
          <div class="top item">
            <span class="name">{{item.name||'暂无'}}</span>
            <span :class="['state']"></span>
          </div>
          <div class="bottom item">
            <span class="text">性别：{{item.gender}}</span>
            <span class="text">身份证号：{{item.cardId}}</span>
          </div>
        </div>
      </div>
      <noList v-else text="暂无学员信息"></noList>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import { tuitionPayment } from '@/common/router'
import { openWin, openFrame } from '@/common/openPage.js'
import request from '@/api/tuition'
import { getGradeList } from '@/api/index'
import BaseDropdown from '@/components/BaseDropdown'
import noList from '@/components/noList'

export default {
  components: {
    HeaderBetween,
    BaseDropdown,
    noList
  },
  data() {
    return {
      studentName: undefined,
      classId: 'all',
      defaultValue: undefined,
      resultList: [],
      option: []
    }
  },
  created() {
    this.getGradeList()
  },
  mounted() {
    api.addEventListener(
      {
        name: 'changeTodoNum'
      },
      (res, err) => {
        // this.getTodoInfo()
      }
    )
  },
  methods: {
    getGradeList() {
      getGradeList(1)
        .then((res) => {
          const list = [{ text: '全部学员', value: 'all' }]
          // const list = []
          res.value.data.map((item) => {
            const flag = {}
            flag.text = item.className
            flag.value = item.id
            list.push(flag)
          })
          this.option = list
          this.defaultValue = list[0].value
        })
        .catch((err) => {})
    },
    hanldeRightClick() {},
    handleShowSelect() {
      this.showSelect = !this.showSelect
    },
    handlePushing() {},
    handleSelect(item) {
      console.log(item)
      api.closeWin()
      api.sendEvent({
        name: 'selectStudent',
        extra: {
          info: item
        }
      })
    },
    // 改变过滤类别
    handleChange(item) {
      this.classId = item
      if (this.studentName) {
        this.handleSearch()
      }
    },
    handleSearch() {
      if (!this.studentName) return this.$toast.fail('请输入学员姓名')
      request
        .search(this.studentName, this.classId === 'all' ? '' : this.classId)
        .then((res) => {
          // this.$toast(JSON.stringify(res))
          this.resultList = res.value
        })
        .catch((err) => {
          alert(1)
        })
    }
    // handleOpen(url) {
    //   if (url) {
    //     openWin(url, { type: 'MakeUp' })
    //   } else {
    //     this.$toast('暂未开通，敬请期待！')
    //   }
    // },
    // 获取代办
    // getTodoInfo() {
    //   request
    //     .getTodoInfo()
    //     .then((res) => {
    //       this.benchList[1].todoNumber = res.value.studentLeave
    //     })
    //     .catch((err) => {})
    // }
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
  .content {
    // border: 1px solid red;
    position: relative;
    background-color: #f5f5f5;
    .form-item {
      box-sizing: border-box;
      position: fixed;
      top: 60px;
      width: 100%;
      padding: 1rem 1rem 0.5rem ;
      background-color: #f5f5f5;
      .search-wrap {
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0rem 0.06rem 0.63rem 0rem rgba(67, 133, 255, 0.2);
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .right {
          .search {
            display: block;
            width: 2rem;
            height: 2rem;
          }
        }
      }
    }
    .top-search {
      font-size: 1.5rem;
      .drop-style {
        box-sizing: border-box;
        ::v-deep .van-dropdown-item {
          left: 50%;
          transform: translateX(-50%);
          width: calc(100vw - 2rem);
        }
      }
    }
    .holder {
      height: 65px;
    }
    .list-wrap {
        padding:0 1rem;
      .list-item {
        background-color: #fff;
        border-radius: 1rem;
        overflow: hidden;
        padding: 1rem;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        // &:nth-child(2n) {
        //   background-color: #f5f5f5;
        // }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .text {
            color: #989fad;
          }
        }
        .top {
          margin-bottom: 1rem;
          .name {
            font-weight: bolder;
            color: #697181;
          }
          .state {
            color: #4385ff;
          }
          .success {
            color: #697181;
          }
          .failed {
            color: #ff5c5c;
          }
        }
      }
    }
  }
}
</style>