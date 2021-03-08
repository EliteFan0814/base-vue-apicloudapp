<template>
  <div class="container">
    <headerBetween leftText="个人中心" />
    <h2 class="welcome">欢迎回来！</h2>

    <div class="info flex" @click="open(changeInfo)">
      <img class="info-img teacher-img" :src="info.hostPhoto" alt="">
      <div class="info-name">{{info.name}}</div>
    </div>

    <div class="card">
      <div class="content-wrap">
        <img src="@/static/image/personal/triangle.png" alt="" class="triangle">
        <div class="left">
          <div class="card-info flex">
            <div class="left">
              <img class="img" :src="info.hostOrgLogo" alt="">
            </div>
            <div class="right">
              <div class="name">{{info.orgName}}</div>
              <div class="phone">{{info.orgMobile}}</div>
            </div>
          </div>
          <div class="place">
            地址：<span>{{info.orgAddress}}</span>
          </div>
        </div>
        <div class="right-qr">
          <div class="img-wrap">
            <img :src="qrImg" alt="" @click="previewImg">
            <span>微信扫一扫</span>
          </div>
        </div>
      </div>
    </div>

    <div class="list">
      <div class="list-title">基础功能</div>
      <div class="list-item flex" v-for="item in list" :key="item.text" @click="open(item.name)">
        <img class="icon" :src="item.icon" alt="">
        <div class="text">{{item.text}}</div>
      </div>
    </div>

    <div class="submit" @click="quit">退出登录</div>

  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'

import { openFrame, openWin } from '@/common/openPage.js'
import { noticeList, changePwd, changeInfo, login } from '@/common/router.js'
import { teacherInfo, getQrImg } from '@/api/personal'
import { ImagePreview } from 'vant'
export default {
  components: {
    headerBetween
  },
  data() {
    return {
      list: [
        {
          icon: require('@/static/image/personal/gg.png'),
          text: '机构公告',
          name: noticeList
        },
        {
          icon: require('@/static/image/personal/aq.png'),
          text: '修改密码',
          name: changePwd
        }
      ],
      changeInfo,
      info: {},
      arInfo: {},
      qrImg: ''
    }
  },
  created() {
    this.teacherInfo()
    this.getQrImg()
  },
  mounted() {
    const self = this
    api.addEventListener(
      {
        name: 'changeInfo'
      },
      function (ret, err) {
        self.teacherInfo()
      }
    )
  },
  methods: {
    teacherInfo() {
      teacherInfo().then((res) => {
        this.info = res.value
      })
    },
    open(name) {
      openWin(name, { photo: this.info.hostPhoto, desc: this.info.desc })
    },
    quit() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否要退出登录'
        })
        .then(() => {
          $api.clearStorage()
          api.sendEvent({
            name: 'quit'
          })
        })
        .catch(() => {})
    },
    getQrImg() {
      getQrImg()
        .then((res) => {
          this.qrImg = res.value
        })
        .catch((err) => {})
    },
    previewImg() {
      ImagePreview([this.qrImg])
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin size-bold {
  color: #333;
  font-weight: bold;
}
@mixin img {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
}
@mixin dir {
  display: block;
  position: absolute;
  width: 100vw;
  left: -1.5rem;
  content: '';
  height: 0.5rem;
  background-color: #f5f5f5;
}

.container {
  padding: 0;
  .welcome {
    padding: 0 1.5rem;
    padding-top: 1.5rem;
    margin-bottom: 1.9rem;
    font-size: 2.4rem;
    @include size-bold();
  }
  .info {
    padding: 0 1.5rem 1rem;

    &-img {
      @include img();
    }
    &-name {
      margin-left: 1.3rem;
      font-size: 1.8rem;
      @include size-bold();
    }
  }

  .card {
    background-color: #f5f5f5;
    padding: 0.5rem 0;
    position: relative;
    color: #333;

    .content-wrap {
      position: relative;
      background-color: #fff;
      display: flex;
      align-items: center;
      .triangle {
        position: absolute;
        width: 6rem;
        top: 0rem;
        right: 0;
      }
      .left {
        .card-info {
          padding: 1.5rem;
          .left {
            margin-right: 1rem;
            font-size: 1.5rem;
            .img {
              width: 5rem;
              height: 5rem;
              border-radius: 50%;
            }
          }
          .right {
            .name {
              font-size: 1.5rem;
              font-weight: bolder;
              margin-top: 0.2rem;
            }
            .phone {
              font-size: 1rem;
              margin-top: 1rem;
              color: #697181;
            }
          }
        }
        .place {
          padding: 0 2rem 2rem;
          font-size: 1.2rem;
          color: #9ca8be;
        }
      }
      .right-qr {
        // border: 1px solid red;
        flex-grow: 1;
        .img-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            display: block;
            width: 7.5rem;
            margin-bottom: 0.5rem;
          }
        }
      }
    }
  }

  .list {
    padding: 0 1.5rem;

    margin-top: 2.35rem;
    &-title {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 2rem;
    }
    &-item {
      margin-bottom: 3rem;
      img {
        width: 1.5rem;
        height: 1.5rem;
      }
      .text {
        margin-left: 0.8rem;
        font-size: 1.4rem;
        color: #666;
      }
    }
  }

  .submit {
    margin: 0 1.5rem;
    background: #4385ff;
    border-radius: 1.87rem;
    padding: 1.1rem;
    color: #fff;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 2.85rem;
  }
}
</style>