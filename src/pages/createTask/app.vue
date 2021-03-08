<template>
  <div class="container">
    <headerBetween leftType leftText="发布作业" />

    <div class="content">
      <van-field v-model="name" label="作业名称" placeholder="请输入作业名称" input-align="right" />
      <van-cell title="作业类型" is-link :value="isContinuous ? '连续' : '单次'"
        @click="showActionSheet('isContinuousVisible')" />
      <van-action-sheet v-model="isContinuousVisible" :actions="options" @select="onSelect" />

      <van-cell title="开始日期" is-link :value="beginDate | commonDate" @click="showActionSheet('beginDateVisible')" />
      <van-popup v-model="beginDateVisible" round position="bottom" :style="{ height: '30%' }">
        <van-datetime-picker v-model="beginDate" type="date" @confirm="onBeginDateConfirm" @cancel="onBeginDateCancel"
          title="选择开始日期" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
      </van-popup>

      <van-cell title="结束日期" v-if="!isContinuous" is-link :value="endDate | commonDate"
        @click="showActionSheet('endDateVisible')" />
      <van-popup v-model="endDateVisible" round position="bottom" :style="{ height: '30%' }">
        <van-datetime-picker v-model="endDate" type="date" @confirm="onEndDateConfirm" @cancel="onEndDateCancel"
          title="选择结束日期" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
      </van-popup>

      <van-field v-if="isContinuous" v-model="continuousDays" label="连续天数" placeholder="请输入连续天数" input-align="right" />
      <van-field v-model="desc" label="内容描述" autosize type="textarea" maxlength="200" show-word-limit rows="3"
        placeholder="请输入内容描述" input-align="right" />
      <div class="up-media">
        <div class="top-operate">
          <div class="left">上传文件</div>
          <div class="right">
            <span @click="handleClick(index)" v-for="(item,index) in upList" :key="index" class="right-item"
              :class="{active:index===activeUpIndex}">{{item.name}}</span>
          </div>
        </div>
        <div class="operate-content">
          <div v-if="activeUpIndex===0" class="img-wrap">
            <!-- <van-uploader v-model="upFileList" accept="image/*" multiple :max-count="9" /> -->
            <!-- <input type="file"> -->
            <div v-for="(item,index) in upImgList" class="item-wrap">
              <div class="wrap">
                <img @click="deleteImg(index)" src="@/static/image/delete.svg" class="img-delete" alt="">
                <img @click="imagePreview(index)" :src="item" class="img-up" alt="">
                <!-- <img v-else @click="upImg(index)" src="@/static/image/upload.svg" class="holder-up" alt=""> -->
              </div>
            </div>
            <!-- 上传图片 -->
            <div v-if="upImgList.length<maxUpImgNum" class="item-wrap">
              <div class="wrap">
                <img @click="upImg" src="@/static/image/upload.svg" class="holder-up" alt="">
              </div>
            </div>
          </div>
          <div v-else class="video-wrap">
            <video v-if="video" controls controlsList="nodownload" poster="@/static/image/video.png" :src="video">
            </video>
            <div @click="upVideo" class="up-video-btn">
              <BaseButton @click="upVideo" :name="video?'重新上传':'上传视频'" class="btn-style"></BaseButton>
            </div>
          </div>
        </div>
      </div>

      <div class="button mar-top" @click="submit">发布作业</div>
    </div>
    <!-- 上传进度弹窗 -->
    <van-popup v-model="uploadShow" :closeable="false" :close-on-click-overlay="false">
      <van-circle v-model="currentRate" :rate="0" :clockwise="false" :speed="100">
        <div class="poup-center-text">
          视频上传中<br /> {{currentRate.toFixed(2)}}%
        </div>
      </van-circle>
    </van-popup>
  </div>
</template>
<script>
import moment from 'moment'
import CryptoJS from 'crypto-js'
import BaseButton from '@/components/BaseButton'
import { ImagePreview } from 'vant'
import headerBetween from '@/components/headerBetween'
import { teacherInfo } from '@/api/personal'
import { getVideoAuth } from '@/api/student'
import { createTask } from '@/api/task'

export default {
  components: {
    headerBetween,
    BaseButton
  },
  data() {
    return {
      name: '',
      classId: '',
      isContinuous: true,
      continuousDays: '',
      beginDate: new Date(),
      endDate: new Date(),
      desc: '',
      options: [
        {
          name: '连续',
          value: true
        },
        {
          name: '单次',
          value: false
        }
      ],
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2030, 12, 31),
      currentDate: null,
      dateType: '',
      isContinuousVisible: false,
      beginDateVisible: false,
      endDateVisible: false,
      activeUpIndex: 0,
      upList: [
        { name: '图片', value: 'img' },
        { name: '视频', value: 'video' }
      ],
      upFileList: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' }],
      cos: undefined,
      userInfo: undefined,
      uploadShow: false,
      currentRate: 0,
      video: '',
      maxUpImgNum: 9,
      upImgList: []
    }
  },
  created() {
    this.classId = api.pageParam.data.id
    this.getUserInfo()
  },
  methods: {
    // 初始化cos授权
    async initCosSync() {
      try {
        const authRes = await getVideoAuth()
        let decrypted = CryptoJS.AES.decrypt(authRes.value, CryptoJS.enc.Utf8.parse(this.userInfo.id), {
          iv: CryptoJS.enc.Utf8.parse(''),
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        const obj = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
        this.cos = api.require('tencentCos')
        this.cos.init(
          {
            appId: obj.a,
            secretId: obj.k,
            secretKey: obj.s,
            regionName: 'ap-nanjing'
          },
          (ret, err) => {
            if (ret) {
            } else {
              api.toast({
                msg: JSON.stringify(err),
                duration: 2000,
                location: 'bottom'
              })
            }
          }
        )
      } catch (err) {}
    },
    // 预览照片
    imagePreview(index) {
      ImagePreview({ images: this.upImgList, startPosition: index })
    },
    // 上传照片
    async upImg() {
      const accessResult = await this.$checkSystemAccess('photos', '相册')
      if (accessResult) {
        let res = await this.$getPic()
        const imgClass = '.' + res.data.split('.').pop().toLowerCase()
        const imgKey = this.userInfo.id + new Date().getTime()
        if (this.cos) {
          this.cos.uploadObject(
            {
              bucket: 'yiqitao-video-1303909371',
              key: 'imgs/' + imgKey + imgClass,
              path: res.data
            },
            (upret, err) => {
              if (upret.eventType && upret.eventType == 'onProgress') {
                this.currentRate = (upret.currentSize / upret.totalSize) * 100
              }
              if (upret.status) {
                this.uploadShow = false
                const tempList = this.upImgList
                if (tempList.length < this.maxUpImgNum) {
                  this.upImgList.push(`https://yiqitao-video-1303909371.cos.ap-nanjing.myqcloud.com/${upret.key}`)
                  this.upImgList = tempList
                  // this.$toast.success('上传成功')
                }
              }
              // alert(JSON.stringify(upret))

              if (err) {
                this.uploadShow = false
                this.$toast.fail('上传失败')
              }
            }
          )
        }
        // let res = await this.$getCamera();
        // let fiel = await this.$fileUpload(res.data)
        // if (fiel.success) {
        //   alert(JSON.stringify(fiel))
        // }
      }
    },
    // 删除照片
    deleteImg(index) {
      this.$dialog
        .confirm({
          title: '确认删除',
          message: `确认删除该图片？`
        })
        .then((res) => {
          this.upImgList.splice(index, 1)
        })
        .catch((err) => {})
    },
    // 获取老师信息
    getUserInfo() {
      teacherInfo()
        .then((res) => {
          this.userInfo = res.value
          console.log(JSON.stringify(res))
          this.initCosSync()
        })
        .catch((err) => {})
    },
    // 上传视频
    async upVideo() {
      const accessResult = await this.$checkSystemAccess('photos', '相册和多媒体')
      if (accessResult) {
        api.getPicture(
          {
            sourceType: 'album',
            mediaValue: 'video',
            destinationType: 'base64',
            allowEdit: true,
            quality: 50,
            videoQuality: '',
            targetWidth: 100,
            targetHeight: 100,
            saveToPhotoAlbum: false
          },
          (ret, err) => {
            if (ret) {
              if (ret.data) {
                this.uploadShow = true
                this.currentRate = 0
                // var filename = ret.data.substr(ret.data.lastIndexOf('/') + 1)
                // var data = api.readFile({
                //   sync: true,
                //   path: ret.data,
                // });
                if (this.cos) {
                  this.cos.uploadObject(
                    {
                      bucket: 'yiqitao-video-1303909371',
                      key: 'video/' + this.userInfo.id + '.mp4',
                      path: ret.data
                    },
                    (upret, err) => {
                      if (upret.eventType && upret.eventType == 'onProgress') {
                        this.currentRate = (upret.currentSize / upret.totalSize) * 100
                      }
                      if (upret.status) {
                        this.uploadShow = false

                        this.video = `https://yiqitao-video-1303909371.cos.ap-nanjing.myqcloud.com/${
                          upret.key
                        }?flag=${Math.random()}`
                        this.$toast.success('上传成功')
                        // editResumeInfoSingle('resumeVideo', this.video).then((res) => {
                        // })
                      }
                      console.log(JSON.stringify(upret))

                      if (err) {
                        this.uploadShow = false
                        this.$toast.fail('上传失败')
                      }
                    }
                  )
                }
              } else {
                api.toast({
                  msg: '未选择文件',
                  duration: 2000,
                  location: 'bottom'
                })
              }
            } else {
              alert(JSON.stringify(err))
            }
          }
        )
      }
    },
    showActionSheet(type) {
      this[type] = true
    },
    onSelect(item) {
      //是否连续作业
      this.isContinuous = item.value
      this.isContinuousVisible = false
    },
    onBeginDateConfirm(date) {
      //日期选中

      this.beginDate = date
      this.beginDateVisible = false
    },
    onBeginDateCancel() {
      this.beginDateVisible = false
    },
    onEndDateConfirm(date) {
      //日期选中
      this.endDate = date
      this.endDateVisible = false
      let begin = moment(this.beginDate).format('YYYY-MM-DD').toString().substr(8)
      let end = moment(date).format('YYYY-MM-DD').toString().substr(8)
      let res = end - begin + 1
      console.log(res)
      this.continuousDays = res
    },
    onEndDateCancel() {
      this.endDateVisible = false
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else {
        return `${val}日`
      }
    },
    async submit() {
      let { name, classId, isContinuous, continuousDays, beginDate, endDate, desc } = this
      if (!name) {
        this.$toast.fail('请输入作业名称')
      } else if (!continuousDays && isContinuous) {
        this.$toast.fail('请输入连续天数')
      } else if (!desc) {
        this.$toast.fail('请输入内容描述')
      } else {
        beginDate = moment(beginDate).format('YYYY-MM-DD')
        let params = { name, classId, isContinuous, continuousDays, beginDate, desc }
        !isContinuous && (params.endDate = endDate)
        if (this.activeUpIndex === 0) {
          params.imgs = this.upImgList.toString()
        } else {
          params.video = this.video
        }
        try {
          const { success } = await createTask(params)
          if (!success) return
          api.toast({ msg: '发布成功', global: true })
          api.sendEvent({
            name: 'createTask'
          })
          api.closeWin()
        } catch (err) {
        }
      }
    },
    handleClick(index) {
      this.activeUpIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  min-height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
  .van-popup--center {
    background: transparent;
    .poup-center-text {
      color: #f5f5f5;
      padding: 35px 0;
      font-size: 1.2rem;
      text-align: center;
    }
  }
  .content {
    margin-top: 1.5rem;
    background: #fff;
    padding: 2rem 0;
    border-radius: 0.5rem;
    .van-field {
      ::v-deep .van-field__label {
      }
    }
    &:nth-child(n + 2) {
      margin-top: 1.5rem;
    }

    .button {
      background: #4385ff;
      border-radius: 1.87rem;
      padding: 1.1rem;
      color: #fff;
      font-size: 1.5rem;
      text-align: center;
      margin: 0 2.5rem;
      margin-top: 2.85rem;
    }
    .up-media {
      margin-top: 1.5rem;
      padding: 0 1.5rem;
      .top-operate {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.5rem;
        .right {
          .right-item {
            margin-left: 1rem;
            color: #999;
          }
          .active {
            color: #4385ff;
            font-weight: bolder;
          }
        }
      }
      .operate-content {
        border-bottom: 0.5px solid #f5f5f5;
        padding: 0.5rem 0 1rem;
        .img-wrap {
          display: flex;
          flex-wrap: wrap;
          .item-wrap {
            margin-bottom: 0.8rem;
            // border: 1px solid red;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 33.33%;
            height: 8rem;
            .wrap {
              position: relative;
              background-color: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 8rem;
              height: 8rem;
              img {
                display: block;
              }
              .img-delete {
                // border: 1px solid red;
                position: absolute;
                width: 2.5rem;
                height: 2.5rem;
                top: -1.2rem;
                right: -1.2rem;
              }
              .img-up {
                max-width: 8rem;
                max-height: 8rem;
              }
              .holder-up {
                width: 2rem;
                height: 2rem;
              }
            }
          }
        }
        .video-wrap {
          video {
            width: 100%;
            height: 15rem;
          }
          .up-video-btn {
            text-align: center;
            .btn-style {
              margin-top: 0;
            }
          }
        }
      }
    }
  }
}
</style>
