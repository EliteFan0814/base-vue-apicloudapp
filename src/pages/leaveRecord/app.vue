<template>
  <div class="container">
    <HeaderBetween leftType leftText="请假记录"></HeaderBetween>
    <div class="tabs-wrap">
      <BaseTab @tabClick="exchangeTab" :tabs="tabList"></BaseTab>
    </div>
    <div class="record-list">
      <div v-for="(item,index) in formList" :key="index" class="record-item">
        <div class="top-info">
          <div class="left-wrap">
            <div class="avatar-wrap">
              <img :src="item.studentPhotoHost" alt="">
            </div>
            <div class="info-content">
              <span class="name">{{item.studentName}}</span>
              <span>请假时间：<span class="value">{{item.leaveDate?item.leaveDate.split(' ')[0]:''}}</span></span>
              <span>请假时间段： <span class="value">{{item.time | shortDate}}</span></span>
              <span v-if="item.auditStatus">审核时间：<span
                  class="value">{{item.auditDate?item.auditDate.split(' ')[0]:''}}</span></span>
              <span>请假原因：<span class="value">{{item.reason}}</span></span>
              <span>请假类型：<span class="value">{{item.leaveType}}</span></span>
              <span v-if="item.auditStatus == -1">拒绝原因：<span class="value">{{item.auditReason}}</span></span>
            </div>
          </div>
          <div class="btn-wrap">
            <template v-if="!tabValue">
              <span v-if="item.auditStatus == 1 " class="apply-pass">{{item.auditStatusStr}}</span>
              <span v-else class="apply-forbid">{{item.auditStatusStr}}</span>
            </template>
            <template v-else>
              <BaseButton @click="handlePass(true,item.studentName,item.id)" class="btn-style" name="通过"></BaseButton>
              <BaseButton @click="handlePass(false,item.studentName,item.id)" class="btn-style" name="拒绝"
                :isRefuse="true"></BaseButton>
            </template>
          </div>
        </div>
        <div class="btm-info">
          <div class="user-item">
            <span class="left-info">
              <span>{{item.relation}}</span>
              <span class="user-text">
                <img :src="item.wxHeaderHost" alt="">
                <span>{{item.wxName}}</span>
              </span>
            </span>
            <span @click="handleCall(item.mobile)">{{item.mobile}}</span>
          </div>
        </div>
      </div>
      <!-- <div class="record-item">
        <div class="top-info">
          <div class="avatar-wrap">
            <img src="" alt="">
          </div>
          <div class="info-content">
            <span class="name">李明亮</span>
            <span>请假时间：<span class="value">2020.10.24</span></span>
            <span>请假类型：<span class="value">病假</span></span>
          </div>
          <div class="btn-wrap">
            <span class="apply-pass">已通过</span>
          </div>
        </div>
        <div class="btm-info">
          <div class="user-item">
            <span class="left-info">
              <span>父亲</span>
              <span class="user-text">
                <img src="@/static/image/task/name-list.png" alt="">
                <span>李先生</span>
              </span>
            </span>
            <span>15245784445</span>
          </div>
        </div>
      </div> -->
      <!-- <div class="record-item">
        <div class="top-info">
          <div class="avatar-wrap">
            <img src="" alt="">
          </div>
          <div class="info-content">
            <span class="name">李明亮</span>
            <span>请假时间：<span class="value">2020.10.24</span></span>
            <span>请假类型：<span class="value">病假</span></span>
          </div>
          <div class="btn-wrap">
            <span class="apply-forbid">已过期</span>
          </div>
        </div>
        <div class="btm-info">
          <div class="user-item">
            <span class="left-info">
              <span>父亲</span>
              <span class="user-text">
                <img src="@/static/image/task/name-list.png" alt="">
                <span>李先生</span>
              </span>
            </span>
            <span>15245784445</span>
          </div>
        </div>
      </div> -->
      <infinite-loading @infinite="getData" :identifier="infiniteId" direction="bottom">
        <div slot="spinner" class="state-style">读取中...</div>
        <div slot="no-more" class="state-style">已加载全部</div>
        <div slot="no-results" class="state-style">
          <no-list text="暂无记录"></no-list>
        </div>
      </infinite-loading>
    </div>
    <div class="dialog-wrap">
      <van-popup @close="closeDialog" v-model="showReasonForm" round closeable position="bottom"
        :style="{ height: '40%' }">
        <div class="add-form">
          <div class="title">拒绝原因</div>
          <div class="form">
            <van-cell-group>
              <van-field v-model="reasonValue" clearable placeholder="请输入拒绝原因" />
            </van-cell-group>
          </div>
          <div class="btn-wrap">
            <BaseButton @click="handleRefuse" :isPushing="isPushing" class="btn-style" name="确认拒绝">
            </BaseButton>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import noList from '@/components/noList'
import BaseTab from '@/components/baseTab'
import BaseButton from '@/components/BaseButton'
import request from '@/api/index'

export default {
  components: {
    HeaderBetween,
    noList,
    BaseTab,
    BaseButton
  },
  data() {
    return {
      showReasonForm: false,
      reasonValue: '',
      isPushing: false,
      leaveId: undefined,
      page: 1,
      row: 10,
      formList: [],
      infiniteId: +new Date(),
      gradeId: api.pageParam.data.id,
      tabValue: true,
      tabList: [
        { name: '待审核', value: true },
        { name: '已审核', value: false }
      ]
    }
  },
  methods: {
    //
    handleCall(callNum) {
      api.call({
        type: 'tel_prompt',
        number: callNum
      })
    },
    //
    getData($state) {
      console.log(typeof this.tabValue)
      request
        .getLeaveRecord(this.page, this.row, this.gradeId, this.tabValue)
        .then(({ value: { data } }) => {
          if (data.length) {
            this.page += 1
            this.formList.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch((err) => {})
    },
    //
    exchangeTab(value) {
      this.tabValue = value
      this.page = 1
      this.formList = []
      this.infiniteId += 1
    },
    //
    handlePass(flag, name, id) {
      if (flag) {
        this.$dialog
          .confirm({
            title: '请假审核',
            message: `确认批准${name}的假条？`
          })
          .then(() => {
            request
              .checkLeave(id, 1)
              .then((res) => {
                this.$toast.success('批准成功')
                this.page = 1
                this.formList = []
                this.infiniteId += 1
                api.sendEvent({
                  name: 'changeTodoNum'
                })
              })
              .catch((err) => {})
          })
          .catch(() => {
            // on cancel
          })
      } else {
        this.showReasonForm = true
        this.leaveId = id
      }
    },
    // 处理拒绝
    handleRefuse() {
      if (!this.reasonValue) {
        return this.$toast.fail('请输入拒绝原因')
      } else {
        this.isPushing = true
        request
          .checkLeave(this.leaveId, 0, this.reasonValue)
          .then((res) => {
            this.$toast.success('拒绝成功')
            this.isPushing = false
            this.showReasonForm = false
            this.page = 1
            this.formList = []
            this.infiniteId += 1
            api.sendEvent({
              name: 'changeTodoNum'
            })
          })
          .catch((err) => {
            this.isPushing = false
          })
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.reasonValue = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Bold;
  background-color: #f5f5f5;
  .tabs-wrap {
    padding: 1rem 0;
  }
  .record-list {
    .record-item {
      // border: 1px solid red;
      background-color: #ffffff;
      font-size: 1.2rem;
      line-height: 2.35rem;
      letter-spacing: 0.09rem;
      color: #697181;
      padding: 0.7rem 1rem;
      margin-bottom: 1.15rem;
      border-radius: 0.5rem;
      .top-info {
        border-bottom: 1px solid #f5f5f5;
        margin-bottom: 1.25rem;
        padding-bottom: 0.8rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .left-wrap {
          display: flex;
          .avatar-wrap {
            display: flex;
            margin-right: 1rem;
            img {
              width: 3.2rem;
              height: 3.25rem;
              border-radius: 50%;
              background-color: #c6daff;
            }
          }
          .info-content {
            display: flex;
            flex-direction: column;
            .name {
              font-size: 1.4rem;
              line-height: 2.35rem;
              letter-spacing: 0.11rem;
              color: #333333;
            }
            .value {
              color: #4385ff;
            }
          }
        }
        .btn-wrap {
          // border: 1px solid green;
          // width: 100%;
          flex-grow: 1;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          width: 12rem;
          .btn-style {
            padding: 0.5rem 1.7rem;
            &:last-child {
              margin-left: 1.5rem;
            }
          }
          .apply-pass {
            color: #4385ff;
          }
          .apply-forbid {
            color: #ffad5c;
          }
        }
      }
      .btm-info {
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
              border-radius: 50%;
              margin-right: 0.7rem;
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
  }
  .dialog-wrap {
    .add-form {
      .title {
        padding: 1rem 0 3.5rem;
        text-align: center;
        font-size: 1.8rem;
      }
      .info-title {
        padding: 1rem 0 1.5rem;
      }
      .form {
        margin-bottom: 4rem;
      }
      .info-form {
        margin-bottom: 2rem;
      }
      .btn-wrap {
        text-align: center;
        .btn-style {
          font-size: 1.4rem;
          padding: 1.2rem 2rem;
        }
      }
    }
  }
}
</style>