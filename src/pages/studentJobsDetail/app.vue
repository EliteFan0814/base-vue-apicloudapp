<template>
  <div class="container">
    <HeaderBetween leftText="艺企淘" leftType color="#fff" bgColor="transparent" :useHeight="false"></HeaderBetween>
    <div class="holder-block"></div>
    <div class="org-info">
      <div class="org-pic">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in bannerList" :key="index">
            <img class="img-style" :src="item" alt="" />
          </van-swipe-item>
        </van-swipe>
        <!-- <img :src="jobsDetail.orgLogoHost" alt=""> -->
      </div>
      <div class="org-text">
        <div class="org-name">
          <img :src="jobsDetail.orgLogoHost" alt="">
          <div class="name-text">
            <span>{{jobsDetail.orgName}}</span>
            <span>{{jobsDetail.orgMobile}}</span>
          </div>
        </div>
        <div class="org-address">
          地址：{{jobsDetail.orgAddress}}
        </div>
      </div>
    </div>
    <div class="job-content-wrap">
      <div class="title">{{jobsDetail.name}}</div>
      <div class="content-item">
        <div class="item-title">岗位职责</div>
        <div class="item-detail">
          <div v-for="(item,index) in jobsDetail.dutyArray" :key="index" class="single-item">{{item}}</div>
        </div>
      </div>
      <div class="content-item">
        <div class="item-title">任职要求</div>
        <div class="item-detail">
          <div v-for="(item,index) in jobsDetail.jobRequirementsArray" :key="index" class="mark">{{index+1}}.{{item}}
          </div>
        </div>
      </div>
    </div>
    <div class="btm-btn">
      <BaseButton @click="handleCall(callNum)" class="btn-style" name="联系应聘"></BaseButton>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import BaseButton from '@/components/BaseButton'
import request from '@/api/student'
export default {
  components: {
    HeaderBetween,
    BaseButton
  },
  data() {
    return {
      id: api.pageParam.data.id,
      callNum: undefined,
      jobsDetail: {},
      bannerList: []
    }
  },
  created() {
    this.getJobDetail()
    this.getCallInfo()
  },
  methods: {
    getJobDetail() {
      request.getJobsDetail(this.id).then(res => {
        this.jobsDetail = res.value
        this.bannerList = res.value.hostPics
      })
    },
    getCallInfo() {
      request.callForJob().then(res => {
        this.callNum = res.value.value
      })
    },
    handleCall(callNum) {
      api.call({
        type: 'tel_prompt',
        number: callNum
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Bold;
  padding: 0;
  background-color: #f5f5f5;
  padding-bottom: 7rem;
  .holder-block {
    height: 15rem;
    background-color: #fff;
    background-image: url("../../static/image/class/top-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .org-info {
    margin: -7rem 2rem 0;
    overflow: hidden;
    .org-pic {
      width: 100%;
      img {
        width: calc(100vw - 4rem);
        height: calc(100vw - 4rem * 4 / 3);
        object-fit: cover;
      }
    }
    .org-text {
      margin-top: 1rem;
      background-color: #fff;
      padding: 1rem 2rem;
    border-radius: 1rem;

      .org-name {
        display: flex;
        align-items: center;
        font-size: 1.4rem;
        line-height: 2rem;
        letter-spacing: 0rem;
        color: #697181;
        margin-bottom: 2rem;
        img {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          margin-right: 0.5rem;
          background-color: #ffca2a;
        }
        .name-text {
          display: flex;
          flex-direction: column;
        }
      }
      .org-address {
        font-size: 1.2rem;
        line-height: 2rem;
        letter-spacing: 0rem;
        color: #989fad;
      }
    }
  }
  .job-content-wrap {
    background-color: #ffffff;
    border-radius: 1rem;
    // position: fixed;
    box-sizing: border-box;
    width: calc(100% - 4rem);
    margin: 1rem auto;
    top: 50rem;
    left: 2rem;
    bottom: 8rem;
    overflow-y: scroll;
    padding: 3rem;
    font-size: 2rem;
    font-weight: bold;
    line-height: 2rem;
    letter-spacing: 0rem;
    color: #333333;
    .title {
      margin-bottom: 2rem;
    }
    .content-item {
      margin-bottom: 3rem;
      .item-title {
        font-size: 1.6rem;
        margin-bottom: 1.5rem;
      }
      .item-detail {
        font-size: 1.2rem;
        line-height: 1.5rem;
      }
      .mark-wrap {
        margin: 0.5rem 0;
        font-size: 1.4rem;
        .mark {
          padding: 0.2rem;
          margin: 0 0.2rem;
          color: #697181;
          background-color: #f5f5f5;
        }
      }
    }
  }
  .btm-btn {
    position: fixed;
    bottom: 2rem;
    width: calc(100% - 4rem);
    margin: 0 2rem;
    // border: 1px solid red;
    .btn-style {
      font-size: 1.6rem;
      padding: 1.5rem 0;
      display: block;
      border-radius: 0.5rem;
    }
  }
}
</style>