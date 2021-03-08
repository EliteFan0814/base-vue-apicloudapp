<template>
  <div class="container">
    <headerBetween leftText="点名" :leftType="true" bgColor="#fff" rightText="点名记录" @rightClick="rightClick" />

    <div class="content">
      <div @click="upload" class="photo flex">
        <div v-if="!photo" class="img-frame">
          <span>点击拍摄合影</span>
        </div>
        <!-- <img v-if="!photo" src="@/static/image/icon/upload.png" @click="upload" alt=""> -->
        <img v-else :src="photo" alt="">
      </div>

      <div class="card">
        <van-cell title="点名类型" is-link :value="refType" @click="showActionSheet('rollCallVisible')" />
        <van-action-sheet description="请选择点名类型" className="class-action" v-model="rollCallVisible"
          :actions="refTypeAction" @select="onRollCallSelect" />

        <van-cell title="班级" is-link :value="className" @click="showActionSheet('classVisible')" />
        <van-action-sheet description="请选择班级" className="class-action" v-model="classVisible" :actions="classList"
          @select="onClassSelect" />

        <van-cell title="日期" is-link :value="dateType" @click="showActionSheet('dateVisible')" />
        <van-popup v-model="dateVisible" round position="bottom" :style="{ height: '30%' }">
          <van-datetime-picker v-model="currentDate" type="date" @confirm="onDateConfirm" @cancel="onDateCancel"
            title="选择日期" :max-date="maxDate" />
        </van-popup>
        <!-- <van-cell title="课时" :value="preHours" @click="showActionSheet('hoursVisible')"/> -->
        <van-field v-model="preHours" label="课时" readonly clearable placeholder="请输入课时" input-align="right" />
        <!-- <van-action-sheet v-model="hoursVisible" :actions="actions" @select="onHoursSelect" /> -->
      </div>

      <div class="name-list">
        <div class="title flex">
          <div class="name">学生名单</div>
          <van-radio @click="allClick">
            <div :class="{'label': allSelect}">选择全部</div>
            <template #icon="props">
              <div class="icon flex">
                <div class="round" v-if="allSelect"></div>
              </div>
            </template>
          </van-radio>
        </div>
        <div class="list " v-if="studentList.length">
          <div class="list-item" v-for="item in studentList" :key="item.id" @click="selectClick(item)">
            <img class="icon student-img" :src="item.hostHeader" alt="">
            <div class="name">{{item.name}}</div>
            <img class="select" v-if="item.isCheck" src="@/static/image/icon/select.png" alt="">
          </div>
        </div>
        <div class="no-list" v-else>
          暂无学生名单
        </div>
      </div>
    </div>

    <div class="btn" @click="btnClick">点名</div>
    <confirm :params="params" :totalNum="totalNum" :notYet="notYet" v-if="dialog" @close="close" />
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import BaseDropdown from '@/components/BaseDropdown'

import confirm from './components/confirm'

import moment from 'moment'

import { openWin } from '@/common/openPage.js'
import { rollCallRecord } from '@/common/router.js'
import { getClassList, getStudentList, getMakeUpClassList, getMakeUpStudentList } from '@/api/rollCall.js'

export default {
  components: {
    headerBetween,
    BaseDropdown,
    confirm
  },
  data() {
    return {
      dropdown: [
        { text: '全部商品', value: 2 },
        { text: '新款商品', value: 1 }
      ],
      allSelect: false,
      dialog: false,
      dateVisible: false,
      hoursVisible: false,
      rollCallVisible: false,
      minDate: new Date(),
      maxDate: new Date(),
      currentDate: null,
      page: 1,
      className: '',
      preHours: '',
      classId: '',
      photo: '',
      refType: '上课',
      refTypeAction: [
        {
          name: '上课',
          value: 'OrgClass'
        },
        {
          name: '补课',
          value: 'MakeUp'
        }
      ],
      dateInfo: {
        year: null,
        month: null,
        day: null
      },
      dateType: '',
      totalNum: 0,
      notYet: 0,
      classVisible: false,
      classList: [],
      studentList: [],
      params: {}
    }
  },
  created() {
    this.currentDate = new Date()
    this.getClassList()
  },
  watch: {
    classId() {
      if (this.refType == '上课') {
        this.getStudentList()
      } else {
        this.getMakeUpStudentList()
      }
    },
    currentDate(val) {
      this.dateInfo.year = this.currentDate.getFullYear()
      this.dateInfo.month = this.currentDate.getMonth() + 1
      this.dateInfo.day = this.currentDate.getDate()
      const { year, month, day } = this.dateInfo
      this.dateType = `${year}年${month}月${day}日`
    },
    refType(val) {
      if (val == '上课') {
        this.getClassList()
      } else {
        this.getMakeUpClassList()
      }
    }
  },
  methods: {
    getClassList() {
      getClassList({ page: this.page, pageSize: 10 }).then((res) => {
        res.value.data.forEach((item) => {
          item.name = item.className
        })
        this.classList = res.value.data
        if (res.value.data.length) {
          this.classId = this.classList[0]['id']
          this.className = this.classList[0]['className']
          this.preHours = this.classList[0]['courseHours']
        }
      })
    },
    getStudentList() {
      getStudentList({ classId: this.classId }).then((res) => {
        if (res.value && res.value.length) {
          res.value.forEach((item) => {
            item.isCheck = false
          })
          this.studentList = res.value
        } else {
          this.studentList = []
        }
      })
    },
    getMakeUpClassList() {
      //补课班级列表
      getMakeUpClassList().then((res) => {
        this.classList = res.value
        if (res.value.length) {
          this.classId = res.value[0]['id']
          this.className = res.value[0]['name']
          this.preHours = res.value[0]['makeupHour']
        } else {
          this.classId = ''
          this.className = '暂无需要补课的班级'
          this.preHours = '0'
        }
      })
    },
    getMakeUpStudentList() {
      //补课班级学生
      getMakeUpStudentList({ makeUpId: this.classId }).then((res) => {
        // console.log(JSON.stringify(res));
        if (res.value && res.value.length) {
          res.value.forEach((item) => {
            item.isCheck = false
          })
          this.studentList = res.value
        } else {
          this.studentList = []
        }
      })
    },
    allClick() {
      //选中全部
      let allSelect = this.allSelect
      this.studentList.forEach((item) => {
        item.isCheck = !allSelect
      })
      this.allSelect = !allSelect
    },
    selectClick(item) {
      //选中学生名单
      item.isCheck = !item.isCheck
      if (!item.isCheck) this.allSelect = false
      else {
        let index = this.studentList.findIndex((item) => !item.isCheck)
        if (index === -1) this.allSelect = true
      }
    },
    showActionSheet(type) {
      this[type] = true
    },
    onClassSelect(item) {
      //班级选中
      this.preHours = item.courseHours
      this.className = item.name
      this.classId = item.id
      this.classVisible = false
    },
    onRollCallSelect(item) {
      //点名类型选中
      this.refType = item.name
      this.rollCallVisible = false
    },
    onDateConfirm(date) {
      //日期选中
      console.log(date)
      this.dateVisible = false
    },
    onDateCancel() {
      this.dateVisible = false
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    async upload() {
      //上传图片
      const accessResult = await this.$checkSystemAccess('camera', '相机')
      if (!accessResult) return
      let res = await this.$getCamera()
      let fiel = await this.$fileUpload(res.data)
      // console.log(JSON.stringify(res));
      // console.log(JSON.stringify(fiel));
      if (fiel.success) {
        this.photo = fiel.hostPath[0]
      }
    },
    btnClick() {
      //点名按钮
      let { classId, refType, currentDate, preHours, photo, dateInfo, studentList } = this
      let params = {}
      params.refId = classId
      params.refType = refType == '上课' || refType == 'OrgClass' ? 'OrgClass' : 'MakeUp'
      params.courseDate = moment(currentDate).format('YYYY-MM-DD')
      params.preHours = preHours
      params.photo = photo
      params.year = dateInfo.year
      params.month = dateInfo.month
      let arr = studentList.filter((item) => {
        if (item.isCheck) return item.id
      })
      params.studentId = arr.map((item) => item.id)
      // console.log(JSON.stringify(params));
      if (!params.photo) {
        return this.$toast.fail('请拍摄合影')
      } else if (!params.preHours) {
        return this.$toast.fail('请输入课时')
      } else if (params.studentId.length <= 0) {
        return this.$toast.fail('请选择学生')
      }
      this.params = params
      this.totalNum = studentList.length //应到人数
      this.notYet = this.totalNum - arr.length //未到人数
      this.dialog = true
    },
    rightClick() {
      openWin(rollCallRecord)
    },
    close(val) {
      if (val) {
        this.photo = ''
        this.allSelect = false
        this.rightClick()
        if (this.refType == '上课') {
          this.getClassList()
        } else {
          this.getMakeUpClassList()
        }
      }
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .screen {
    justify-content: space-between;
  }
  .content {
    width: 100vw;
    min-height: calc(100vh - 4.8rem - 9.6rem);
    background-color: #f5f5f5;
    margin-left: -1.5rem;
    padding: 1.5rem;
    padding-top: 1.5rem;
    box-sizing: border-box;
    .photo {
      height: 12rem;
      border: 1px #4385ff;
      border-style: dashed;
      justify-content: center;
      .img-frame {
        color: #999;
        font-size: 1.5rem;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .card {
      margin-top: 1.5rem;
    }
  }

  .name-list {
    margin-top: 1.5rem;
    background: #fff;
    border-radius: 0.5rem;
    min-height: 43.05rem;
    padding: 1.5rem 1.75rem;
    margin-bottom: 5rem;
    .title {
      justify-content: space-between;
      margin-bottom: 1.65rem;
      .name {
        font-size: 1.4rem;
        font-weight: bold;
      }
      .van-radio {
        // padding: 1.5rem 0;
        display: flex;
        align-items: center;
        ::v-deep .van-radio__icon {
          height: 100%;
        }
        .label {
          color: #4385ff;
        }
      }
      .icon {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        border: 1px solid #999;
        justify-content: center;
        .round {
          width: 1rem;
          height: 1rem;
          background: #4385ff;
          border-radius: 50%;
        }
      }
    }
    .list {
      justify-content: space-between;
      &::after {
        content: '';
        display: inline-block;
        clear: both;
      }
      .list-item {
        float: left;
        width: 6rem;
        text-align: center;
        position: relative;
        &:nth-child(n + 6) {
          margin-top: 2rem;
        }
        img {
          width: 3rem;
          height: 3rem;
          display: inline-block;
          border-radius: 50%;
        }
        .name {
          font-size: 1.2rem;
          color: #333;
        }
        .select {
          position: absolute;
          top: 2.2rem;
          left: 3.5rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }
    .no-list {
      text-align: center;
      margin-top: 3rem;
    }
  }
  .btn {
    width: 100vw;
    bottom: 0;
    margin-left: -1.5rem;
    padding: 1.5rem 0;
    text-align: center;
    position: fixed;
    background: #4385ff;
    font-size: 1.8rem;
    font-weight: bold;
    letter-spacing: 0.14rem;
    color: #ffffff;
  }
}
.van-action-sheet {
  padding-bottom: 1rem;
}
</style>