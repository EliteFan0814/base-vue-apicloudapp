<template>
  <div class="container">
    <HeaderBetween leftType leftText="师资培训" color="#fff" bgColor="#4385ff"></HeaderBetween>
    <div class="train-wrap">
      <div class="train-title">
        {{joinDetail.title}} 
        <div class="title-wrap">
          <span class="title"><van-tag plain type="primary">{{joinDetail.trainingTypeName}}</van-tag></span>
          <span class="time">发布时间：{{joinDetail.createDate}}</span>
        </div>
      </div>
      <div class="richtext-wrap">
        <!-- <div class="title-wrap">
          <span class="title"><van-tag plain type="primary">{{joinDetail.trainingTypeName}}</van-tag></span>
          <span class="time">发布时间：{{joinDetail.createDate}}</span>
        </div> -->
        <div v-html="joinDetail.content" class="richtext"></div>
         
      </div>
    </div>
    <div @click="openDialog" :class="['btm-btn',canJoin?'':'unclick']">
      {{canJoin?'立即报名':'已报名'}}
    </div>
    <div class="join-wrap">
      <van-popup v-model="showJoinForm" round closeable position="bottom" :style="{ height: '40%' }">
        <div class="join-form">
          <div class="title">联系方式</div>
          <div class="form">
            <van-cell-group>
              <van-field v-model="name" label="姓名" clearable placeholder="请输入姓名" />
              <van-field v-model="mobile" type="tel" label="手机号" clearable placeholder="请输入手机号" />
            </van-cell-group>
          </div>
          <div class="btn-wrap">
            <BaseButton @click="confirmJoin" :isPushing="isPushing" class="btn-style" name="确认报名"></BaseButton>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import BaseButton from '@/components/BaseButton'
import request from '@/api/index'

export default {
  components: {
    HeaderBetween,
    BaseButton
  },

  data() {
    return {
      isPushing: false,
      joinId: api.pageParam.data.id,
      showJoinForm: false,
      joinDetail: {},
      canJoin: undefined,
      name: $api.getStorage('user').userInfo.name || '',
      mobile: $api.getStorage('user').userInfo.mobile || ''
    }
  },
  created() {
    this.getJoinDetail(this.joinId)
    this.getJoinStatus(this.joinId)
    // alert(JSON.stringify($api.getStorage('user')))
  },
  mounted() {
    const that = this
    api.addEventListener({
      name: 'applySuccess'
    },
      (res, err) => {
        that.getJoinStatus(that.joinId)
        that.$toast.success(res.value.msg)
      })
  },
  methods: {
    getJoinDetail(id) {
      request.getJoinDetail(id).then(res => {
        res.value.content = res.value.content.replace(/\<img/, '<img style="max-width:100%;height:auto;display:block"')

        this.joinDetail = res.value
      }).catch(err => { }) 
    },
    getJoinStatus(id) {
      request.getJoinStatus(id).then(res => {
        this.canJoin = res.value
      }).catch(err => { })
    },
    openDialog() {
      if (this.canJoin) {
        this.showJoinForm = true
      }
    },
    // 确认报名
    confirmJoin() {
      this.isPushing = true
      request.confirmJoin(this.joinId, this.name, this.mobile).then(res => {
        this.isPushing = false
        api.sendEvent({
          name: 'applySuccess',
          extra: {
            msg: '报名成功！'
          }
        })
        this.showJoinForm = false
      }).catch(err => {
        this.isPushing = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: AdobeHeitiStd-Regular;
  padding: 0;
  .train-wrap {
    position: absolute;
    top: 4.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    // border: 1px solid red;
    background-color: #4385ff;
    .train-title {
    
      padding: 1.5rem 2rem;
      font-size: 1.8rem;
      font-weight: bold;
      // line-height: 2.35rem;
      letter-spacing: 0.12rem;
      color: #ffffff;
       .title-wrap {
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 2.35rem;
        letter-spacing: 0.12rem;
        color: #333333;
        display: flex;
        justify-content: space-between;
        // flex-direction: column;
        .time {
          font-size: 1.2rem;
          line-height: 2.35rem;
          letter-spacing: 0.09rem;
          color: #ddd;
        }
      }
    }
    .richtext-wrap {
       
      // position: fixed;
      // box-sizing: border-box;
      // top: 12rem;
      // bottom: 0;
      // width: 100%;
      flex-grow: 1;
      overflow: auto;
      
      padding:0.5rem 1rem 8rem ;
      background-color: #ffffff;
      box-shadow: 0rem 0.1rem 1rem 0rem rgba(67, 133, 255, 0.2);
      border-radius: 0.5rem;
       
     
      .richtext {
      
     
        width: calc(100% - 4.1rem);
        overflow-y: scroll;
        font-size: 1.4rem;
        ::v-deep img {
          max-width: 100%;
        }
      }
    }
  }
  .btm-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #4385ff;
    font-size: 1.8rem;
    font-weight: bold;
    line-height: 2.35rem;
    letter-spacing: 0.14rem;
    color: #ffffff;
    text-align: center;
    padding: 1.6rem 0;
  }
  .unclick {
    background-color: #d0d0d0;
    color: #fff;
  }
  .join-wrap {
    .join-form {
      .title {
        padding: 1rem 0 1.5rem;
        text-align: center;
        font-size: 1.8rem;
      }
      .form {
        margin-bottom: 4rem;
      }
      .btn-wrap {
        text-align: center;
        .btn-style {
          font-size: 1.4rem;
          padding: 0.9rem 2rem;
        }
      }
    }
  }
}
</style>