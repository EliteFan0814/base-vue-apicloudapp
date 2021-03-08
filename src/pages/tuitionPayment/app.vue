<template>
  <div class="container">
    <div class="pub-header">
      <HeaderBetween leftType leftText="学费缴纳" rightText="缴纳记录" @rightClick="hanldeRightClick"></HeaderBetween>
    </div>
    <div class="content">
      <div class="form-item">
        <van-cell-group>
          <van-field v-model="studentName" label="学员姓名" readonly placeholder="请搜索学员姓名" @click="openSearch">
            <template #right-icon>
              <div><img src="@/static/image/icon/search.png" alt="" class="search"></div>
            </template>
          </van-field>
        </van-cell-group>
      </div>
      <div class="form-item">
        <van-cell-group>
          <van-cell title="选择产品" is-link :value="prodName" @click="handleShowSelect" />
          <van-action-sheet v-model="showSelect" :actions="options" @select="handleSelect" />

          <van-field v-model="dueMoney" label="应收金额(元)" readonly input-align="right" placeholder="请输入应收金额" />
          <van-field v-model="courseNum" label="课时数" readonly input-align="right" placeholder="请输入课时数" />
        </van-cell-group>
      </div>
      <div class="form-item">
        <van-cell-group>
          <van-field v-model="realMoney" label="实收金额(元)" type="number" input-align="right" placeholder="请输入实收金额" />
          <van-field v-model="realCourseNum" label="课时数" type="number" input-align="right" placeholder="请输入课时数" />
        </van-cell-group>
      </div>
      <div class="btn-wrap">
        <BaseButton name="提交收费信息" :isPushing="isPushing" @click="handlePushing" class="btn-style"></BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import { tuitionSearch, tuitionRecord } from '@/common/router'
import { openWin, openFrame } from '@/common/openPage.js'
import request from '@/api/tuition'
import BaseButton from '@/components/BaseButton'

export default {
  components: {
    HeaderBetween,
    BaseButton
  },
  data() {
    return {
      userInfo: $api.getStorage('user').userInfo || {},
      studentName: undefined,
      studentId: undefined,
      prodName: '请选择产品',
      prodValue: undefined,
      showSelect: false,
      dueMoney: undefined,
      courseNum: undefined,
      realMoney: undefined,
      realCourseNum: undefined,
      isPushing: false,
      options: []
    }
  },
  created() {
    this.getProdList()
  },
  mounted() {
    api.addEventListener(
      {
        name: 'selectStudent'
      },
      (res, err) => {
        const info = res.value.info
        this.studentName = info.name
        this.studentId = info.id
      }
    )
    // api.addEventListener(
    //   {
    //     name: 'viewappear'
    //   },
    //   (res, err) => {
    //     window.location.reload()
    //   }
    // )
  },
  methods: {
    hanldeRightClick() {
      openWin(tuitionRecord)
    },
    // 产品列表
    getProdList() {
      request
        .getProdList(1)
        .then((res) => {
          const flag = res.value.data.map((item) => {
            item.value = item.productId
            return item
          })
          this.options = flag
        })
        .catch((err) => {})
    },
    handleShowSelect() {
      this.showSelect = !this.showSelect
    },
    // 提交按钮
    handlePushing() {
      if (!this.studentId) return this.$toast.fail('请输入学员姓名')
      if (!this.prodValue) return this.$toast.fail('请选择产品')
      if (!this.realMoney) return this.$toast.fail('请输入实收金额')
      if (!this.realCourseNum) return this.$toast.fail('请输入课时数')
      this.isPushing = true
      request
        .submit(this.studentId, this.prodValue, this.realCourseNum, this.realMoney)
        .then((res) => {
          this.studentId = undefined
          this.studentName = undefined
          this.prodName = '请选择产品'
          this.prodValue = undefined
          this.dueMoney = undefined
          this.courseNum = undefined
          this.realMoney = undefined
          this.realCourseNum = undefined
          this.$toast.success('提交成功')
          setTimeout(() => {
            openWin(tuitionRecord)
          }, 500)
          this.isPushing = false
        })
        .catch((err) => {
          alert(JSON.stringify(err))
        })
    },
    // 产品选择
    handleSelect(item) {
      console.log(item)
      this.prodName = item.name
      this.prodValue = item.value
      this.dueMoney = item.totalMoney
      this.courseNum = item.totalClassHour
      this.showSelect = false
    },
    openSearch() {
      openWin(tuitionSearch)
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
    background-color: #f5f5f5;
    padding: 1rem;
    .form-item {
      // border: 1px solid green;
      margin-bottom: 1rem;
      background-color: #fff;
      border-radius: 1rem;
      overflow: hidden;
      .search {
        display: block;
        width: 2rem;
        height: 2rem;
      }
    }
    .btn-wrap {
      text-align: center;
      margin-top: 3rem;
      .btn-style {
        // width: 100%;
        font-size: 1.4rem;
        padding: 1rem 6rem;
      }
    }
  }
}
</style>