<template>
  <div class="container">
    <HeaderBetween leftText="艺企淘" color="#fff" bgColor="transparent" :useHeight="false"></HeaderBetween>
    <div class="holder-block"></div>
    <div class="info-wrap">
      <div class="top-info">
        <div class="left-wrap" @click="openSelfInfo">
          <img :src="userInfo.hostHeader||require('@/static/image/personal/defualtHeader.png')" alt="">
          <div class="text-wrap">
            <span>{{userInfo.name}}</span>
            <span>{{userInfo.mobile}}</span>
          </div>
        </div>
        <img class="setting" src="@/static/image/personal/set.png" @click="openSelfInfo" alt="">
      </div>
      <div class="resume-wrap">
        <div class="title-wrap first-title">
          <span class="title"><span class="first-left">我的简历</span><img @click="openInfoDialog" class="edit"
              src="@/static/image/personal/edit.png" alt=""></span>
        </div>
        <div class="resume-list">
          <div class="resume-item">
            <div class="person-info-wrap">
              <div class="person-info">
                <span class="name">
                  姓名：{{resumeInfo.name}}
                  <span class="gender"
                    v-if="resumeInfo.gender &&resumeInfo.gender!='null'">({{resumeInfo.gender}})</span>
                  <!-- <img @click="openInfoDialog" class="edit" src="@/static/image/personal/edit.png" alt=""> -->
                </span>
                <!-- <span @click="checkCamera" class="other-info">生日：{{resumeInfo.birthdayDateStr}}</span> -->
                <span class="other-info">生日：{{resumeInfo.birthdayDateStr}}</span>
                <span class="other-info">身高：{{resumeInfo.height||"--"}}cm</span>
                <span class="other-info">体重：{{resumeInfo.kg||"--"}}kg</span>
                <span class="other-info">籍贯：{{resumeInfo.hometown}}</span>
                <span class="other-info">民族：{{resumeInfo.ethnic}}</span>
                <span class="other-info">专业：{{resumeInfo.specialty}}</span>
                <span class="other-info">学年：{{resumeInfo.schoolSystem||"--"}}年</span>
              </div>
              <div class="avatar-box" @click="changeResumeAvatar">
                <img class="avatar" :src="resumeInfo.photoHost|| require('@/static/image/personal/photo.png')" alt="">
                <div>简历照片 </div>
              </div>

            </div>
          </div>
          <div class="resume-item">
            <div class="title-wrap">
              <span class="title">视频简历</span>
              <img @click="upVideo" src="@/static/image/personal/edit.png" alt="">
            </div>
            <div class="video-wrap">
              <video v-if="video" controls controlsList="nodownload" poster="@/static/image/video.png" :src="video">

              </video>
            </div>
          </div>
          <div class="resume-item">
            <div class="title-wrap">
              <span class="title">教育经历</span>
              <img @click="openDialog('添加教育经历','eduList','EducationExperience')" src="@/static/image/personal/add.png"
                alt="">
            </div>
            <div class="common-wrap">
              <div v-for="(item,index) in eduList" :key="index" class="common-item">
                <span>{{item}}</span>
                <img @click="deleteItem('eduList','EducationExperience',index)" src="@/static/image/personal/delete.svg"
                  alt="">
              </div>
            </div>
          </div>
          <div class="resume-item">
            <div class="title-wrap">
              <span class="title">证书</span>
              <img @click="openDialog('添加证书','certList','Certificate')" src="@/static/image/personal/add.png" alt="">
            </div>
            <div class="common-wrap">
              <div v-for="(item,index) in certList" :key="index" class="common-item">
                <span>{{item}}</span>
                <img @click="deleteItem('certList','Certificate',index)" src="@/static/image/personal/delete.svg"
                  alt="">
              </div>
            </div>
          </div>
          <div class="resume-item">
            <div class="title-wrap">
              <span class="title">参演剧目</span>
              <img @click="openDialog('添加参演剧目','repeList','Repertoire')" src="@/static/image/personal/add.png" alt="">
            </div>
            <div class="common-wrap">
              <div v-for="(item,index) in repeList" :key="index" class="common-item">
                <span>{{item}}</span>
                <img @click="deleteItem('repeList','Repertoire',index)" src="@/static/image/personal/delete.svg" alt="">
              </div>
            </div>
          </div>
          <div class="resume-item">
            <div class="title-wrap">
              <span class="title">授课经验</span>
              <img @click="openDialog('添加授课经验','expeList','Experience')" src="@/static/image/personal/add.png" alt="">
            </div>
            <div class="common-wrap">
              <div v-for="(item,index) in expeList" :key="index" class="common-item">
                <span>{{item}}</span>
                <img @click="deleteItem('expeList','Experience',index)" src="@/static/image/personal/delete.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-wrap">
      <van-popup v-model="showAddForm" round closeable position="bottom" :style="{ height: '30%' }">
        <div class="add-form">
          <div class="title">{{dialogName}}</div>
          <div class="form">
            <van-cell-group>
              <van-field v-if="faildValue === 'eduList'" v-model="addValue" label="校名" clearable
                placeholder="请输入学校名称" />
              <van-field v-if="faildValue === 'certList'" v-model="addValue" label="证书" clearable
                placeholder="请输入证书名称" />
              <van-field v-if="faildValue === 'repeList'" v-model="addValue" label="参演剧目" clearable
                placeholder="请输入您的参演剧目" />
              <van-field v-if="faildValue === 'expeList'" v-model="addValue" label="授课经验" clearable
                placeholder="例如：在某地授过课" />
            </van-cell-group>
          </div>
          <div class="btn-wrap">
            <BaseButton @click="addItem(faildValue,faildPostValue,addValue)" :isPushing="isPushing" class="btn-style"
              name="确认添加">
            </BaseButton>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="showInfoForm" round closeable position="bottom" :style="{ height: '70%' }">
        <div class="add-form">
          <div class="title info-title">修改个人信息</div>
          <div class="form info-form">
            <van-cell-group>
              <van-field v-model="dialogResumeInfo.name" label="姓名" clearable placeholder="请输入您的姓名" />
              <van-field :name="dialogResumeInfo.gender" label="性别">
                <template #input>
                  <van-radio-group v-model="dialogResumeInfo.gender" direction="horizontal">
                    <van-radio name="男">男</van-radio>
                    <van-radio name="女">女</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
              <van-field v-model="dialogResumeInfo.birthdayDateStr" @click="showDatePicker = true" readonly label="生日"
                clearable placeholder="请输入您的生日" />
              <van-field v-model="dialogResumeInfo.height" type="number" label="身高cm" clearable placeholder="请输入您的身高" />
              <van-field v-model="dialogResumeInfo.kg" type="number" label="体重kg" clearable placeholder="请输入您的体重" />
              <van-field v-model="dialogResumeInfo.hometown" label="籍贯" clearable placeholder="请输入您的籍贯" />
              <van-field v-model="dialogResumeInfo.ethnic" maxlength="5" label="民族" clearable placeholder="请输入您的民族" />
              <van-field v-model="dialogResumeInfo.specialty" maxlength="20" label="专业" clearable
                placeholder="请输入您的专业" />
              <van-field v-model="dialogResumeInfo.schoolSystem" type="number" label="学年" clearable
                placeholder="请输入您的在该专业领域的年数" />
            </van-cell-group>
            <!-- 日期选择 -->
            <div class="date-picker">
              <van-popup v-model="showDatePicker" round position="bottom" :style="{ height: '40%' }">
                <div class="picker-content">
                  <van-datetime-picker v-model="pickDate" @confirm="confirmPickDate" @cancel="cancelPickDate"
                    type="date" title="选择出生年月日" :min-date="minDate" :max-date="maxDate" :formatter="formatter" />
                </div>
              </van-popup>
            </div>
          </div>
          <div class="btn-wrap">
            <BaseButton @click="handleChangeInfo" :isPushing="ischanging" class="btn-style" name="确认修改">
            </BaseButton>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="uploadShow" :closeable="false" :close-on-click-overlay="false">
        <van-circle v-model="currentRate" :rate="0" :clockwise="false" :speed="100">
          <div class="poup-center-text">
            视频上传中<br /> {{currentRate.toFixed(2)}}%
          </div>
        </van-circle>
      </van-popup>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import BaseButton from '@/components/BaseButton'
import request from '@/api/student'
// import COS from "cos-js-sdk-v5";
import CryptoJS from 'crypto-js'

import { openWin } from '@/common/openPage'
import { studentChangeInfo } from '@/common/router.js'
export default {
  components: {
    HeaderBetween,
    BaseButton
  },
  data() {
    return {
      video: '',
      // video:"https://yiqitao-video-1303909371.cos.ap-nanjing.myqcloud.com/ec09348253254520b07410d0b39cf14d.mp4",
      isPushing: false,
      ischanging: false,
      showAddForm: false,
      showInfoForm: false,
      showDatePicker: false,
      uploadShow: false,
      currentRate: 0,
      pickDate: new Date(),
      minDate: this.getMinDate(),
      maxDate: this.getCurrentDate(),
      addValue: undefined,
      dialogName: undefined,
      faildValue: undefined, // 本地数组名
      faildPostValue: undefined, // post请求名
      // userInfo: $api.getStorage('user').userInfo || {},
      userInfo: {},
      resumeInfo: {},
      dialogResumeInfo: {
        name: '',
        gender: '',
        birthdayDateStr: '',
        height: '',
        kg: '',
        hometown: '',
        ethnic: '',
        specialty: '',
        schoolSystem: ''
      },
      eduList: [],
      certList: [],
      repeList: [],
      expeList: []
    }
  },
  created() {
    this.getInfo()
    this.getResume()
  },
  mounted() {
    const self = this
    api.addEventListener(
      {
        name: 'changeInfo'
      },
      function (ret, err) {
        self.getInfo()
      }
    )
  },
  methods: {
    checkCamera() {
      this.$checkSystemAccessMulti(['camera', 'microphone'], '相机')
        .then((res) => {})
        .catch((err) => {})
    },
    // 初始化cos授权
    async initCosSync() {
      try {
        const authRes = await request.getVideoAuth()
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
                // alert(JSON.stringify(ret));
              } else {
                api.toast({
                  msg: JSON.stringify(err),
                  duration: 2000,
                  location: 'bottom'
                })
              }
            }
          )
      } catch (err) {
        console.log(err)
      }
    },
    // 获取个人信息
    getInfo() {
      request.getInfo().then((res) => {
        this.userInfo = res.value
        //cos授权
        request.getVideoAuth().then((authRes) => {
          let decrypted = CryptoJS.AES.decrypt(authRes.value, CryptoJS.enc.Utf8.parse(this.userInfo.id), {
            iv: CryptoJS.enc.Utf8.parse(''),
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          })
          var obj = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
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
                // alert(JSON.stringify(ret));
              } else {
                api.toast({
                  msg: JSON.stringify(err),
                  duration: 2000,
                  location: 'bottom'
                })
              }
            }
          )
        })
      })
    },
    // 获取简历信息
    getResume() {
      request.getResumeInfo().then((res) => {
        this.resumeInfo = res.value
        Object.keys(this.dialogResumeInfo).map((item, index) => {
          this.dialogResumeInfo[item] = this.resumeInfo[item]
        })
        this.video = this.resumeInfo.resumeVideo
        this.handleParse(this.resumeInfo.educationExperience, 'eduList')
        this.handleParse(this.resumeInfo.certificate, 'certList')
        this.handleParse(this.resumeInfo.repertoire, 'repeList')
        this.handleParse(this.resumeInfo.educationExperience, 'expeList')
      })
    },
    // 上传照片
    async changeResumeAvatar() {
      const accessResult = await this.$checkSystemAccess('photos', '相册')
      if (accessResult) {
        let res = await this.$getPic()
        // let res = await this.$getCamera();
        let fiel = await this.$fileUpload(res.data)
        if (fiel.success) {
          request
            .editResumeInfoSingle('Photo', fiel.pathList[0])
            .then((res) => {
              if (res.success) {
                this.$toast.success('修改简历头像成功！')
                this.resumeInfo.photoHost = fiel.hostPath[0]
              } else {
                this.$toast.fail('修改失败，请重新上传！')
              }
            })
            .catch((err) => {
              // this.$toast.fail('修改失败，请重新上传！')
            })
        }
      }
      // this.checkSystemAccess('camera', '相机').then(result => {
      // })
    },
    // 打开编辑个人信息
    openSelfInfo() {
      const { header, hostHeader, name, mobile } = this.userInfo
      openWin(studentChangeInfo, { header, hostHeader, name, mobile })
    },
    // 字符串转数组
    handleParse(stringValue, arrName) {
      const temp = JSON.parse(stringValue)
      if (this.checkType(temp, 'Array')) {
        this[arrName] = temp.map((item, index) => {
          return item
        })
      } else {
        this[arrName] = []
      }
    },
    // 数组转字符串
    handleStringify(arrValue) {
      return JSON.stringify(arrValue)
      // this.resumeInfo[stringName] = JSON.stringify(arrValue)
    },
    // 判断数据类型
    checkType(yourData, dataType) {
      const type = Object.prototype.toString.call(yourData).slice(8, -1)
      return type === dataType
    },
    // 确认添加
    addItem(arrName, stringName, addValue) {
      if (!addValue) {
        return this.$toast.fail('请输入内容')
      }
      this.isPushing = true
      // 使用备份做添加操作
      let temp = JSON.parse(JSON.stringify(this[arrName]))
      // 添加
      temp.push(addValue)
      // 请求修改
      request
        .editResumeInfoSingle(stringName, this.handleStringify(temp))
        .then((res) => {
          // 如果成功则将结果存入data用来显示
          if (res.success) {
            this.$toast.success('添加成功！')
            this[arrName] = temp
            this.showAddForm = false
          } else {
            // 如果不成功，则报错，什么也不做
            this.$toast.fail('添加失败，请重试！')
          }
          this.isPushing = false
        })
        .catch((err) => {
          this.isPushing = false
          // 如果不成功则报错什么也不做
        })
    },
    // 删除数组中的指定某一个,并请求修改接口，成功后将删除后的结果存入 data
    deleteItem(arrName, stringName, index) {
      this.$dialog
        .confirm({
          title: '确认删除',
          message: `确认删除该记录？`
        })
        .then(() => {
          // 使用备份做删除操作
          let temp = JSON.parse(JSON.stringify(this[arrName]))
          // 删除指定属性
          temp.splice(index, 1)
          // 请求修改
          request
            .editResumeInfoSingle(stringName, this.handleStringify(temp))
            .then((res) => {
              // 如果成功则将结果存入data用来显示
              if (res.success) {
                this.$toast.success('删除成功！')
                this[arrName] = temp
              } else {
                // 如果不成功，则报错，什么也不做
                this.$toast.fail('修改失败，请重试！')
              }
            })
            .catch((err) => {
              // 如果不成功则报错什么也不做
            })
        })
        .catch(() => {})
    },
    // 打开添加框
    openDialog(dialogName, arrName, stringName) {
      this.addValue = ''
      this.showAddForm = true
      // 配置弹框名称
      this.dialogName = dialogName
      // 配置输入框名称
      this.faildValue = arrName
      //配置post请求时的key值
      this.faildPostValue = stringName
    },
    openInfoDialog() {
      Object.keys(this.dialogResumeInfo).map((item, index) => {
        this.dialogResumeInfo[item] = this.resumeInfo[item]
      })
      this.showInfoForm = true
    },
    // 修改简历个人信息
    handleChangeInfo() {
      const height = this.dialogResumeInfo.height,
        kg = this.dialogResumeInfo.kg
      // const flag = height >= 100 && height <= 300 && kg >= 10 && kg <= 99
      if (!(height >= 100 && height <= 300)) return this.$toast.fail('身高范围应在100~300cm！')
      if (!(kg >= 10 && kg <= 99)) return this.$toast.fail('体重范围应在10~99kg！')
      this.ischanging = true
      request
        .editResumeInfo(this.dialogResumeInfo)
        .then((res) => {
          if (res.success) {
            this.$toast.success('个人信息修改成功')
            this.getResume()
            this.showInfoForm = false
          } else {
          }
          this.ischanging = false
        })
        .catch((err) => {
          this.ischanging = false
        })
    },
    // 确认选择时间
    confirmPickDate(value) {
      const temp = value.toLocaleDateString()
      this.dialogResumeInfo.birthdayDateStr = temp
      this.handleDatePickerShow()
    },
    // 取消选择时间
    cancelPickDate() {
      this.handleDatePickerShow()
    },
    // 处理dialog显示
    handleDatePickerShow() {
      this.showDatePicker = !this.showDatePicker
    },
    // 格式化日期选择显示
    formatter(type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
    },
    // 获取当前年
    getCurrentDate() {
      return new Date(new Date().getFullYear(), 11, 31)
    },
    //获取最小年
    getMinDate() {
      return new Date(new Date().getFullYear() - 100, 0, 1)
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
                        request.editResumeInfoSingle('resumeVideo', this.video).then((res) => {
                          this.$toast.success('上传成功')
                        })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Bold;
  padding: 0;
  background-color: #f5f5f5;
  .holder-block {
    height: 15rem;
    // background-color: #4385ff;
    background-color: #fff;
    background-image: url('../../static/image/class/top-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .info-wrap {
    // border: 1px solid red;
    // height: 100rem;
    margin: -8rem 2rem 0;
    .top-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem 1rem 0;
      .left-wrap {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 2rem;
        letter-spacing: 0rem;
        color: #ffffff;
        img {
          width: 5rem;
          height: 5rem;
          margin-right: 0.5rem;
          border-radius: 50%;
        }
        .text-wrap {
          display: flex;
          flex-direction: column;
        }
      }
      .setting {
        width: 2rem;
        height: 2.2rem;
      }
    }
    .resume-wrap {
      position: fixed;
      box-sizing: border-box;
      width: calc(100% - 4rem);
      top: 12.5rem;
      bottom: 0;
      background-color: #ffffff;
      border-radius: 1rem;
      padding: 1rem 2rem;
      .title-wrap {
        padding-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 2rem;
        font-weight: bold;
        line-height: 2rem;
        letter-spacing: 0rem;
        color: #333333;
        img {
          width: 2rem;
          height: 2rem;
        }
      }
      .first-title {
        .title {
          display: flex;
          align-items: center;
          .first-left {
            margin-right: 1rem;
          }
          video::-internal-media-controls-download-button {
            display: none;
          }

          video::-webkit-media-controls-enclosure {
            overflow: hidden;
          }

          video::-webkit-media-controls-panel {
            width: calc(100% + 30px); /* Adjust as needed */
          }
        }
      }
      .resume-list {
        box-sizing: border-box;
        position: absolute;
        width: calc(100% - 4rem);
        top: 4rem;
        bottom: 0;
        overflow-y: scroll;
        .resume-item {
          padding-right: 1px;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #f5f5f5;
          .person-info-wrap {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            .person-info {
              display: flex;
              flex-direction: column;
              .name {
                padding-bottom: 0.5rem;
                display: flex;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                line-height: 2rem;
                letter-spacing: 0rem;
                color: #333333;
                .gender {
                  font-size: 1.4rem;
                  color: #999999;
                  padding: 0 0.5rem;
                }
                .edit {
                  width: 1.5rem;
                  height: 1.5rem;
                }
              }
              .other-info {
                font-size: 1.2rem;
                line-height: 2rem;
                letter-spacing: 0rem;
                color: #999999;
              }
            }
            .avatar-box {
              text-align: center;
              .avatar {
                border-radius: 5px;
                box-shadow: 1px 1px 0px #999999;
                width: 6rem;
                height: 7.2rem;
              }
            }
          }
          .video-wrap {
            video {
              width: 100%;
              height: 20rem;
            }
          }
          .common-wrap {
            .common-item {
              color: #999999;
              margin-bottom: 1rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 1.2rem;
              img {
                width: 2rem;
                height: 2rem;
              }
            }
          }
        }
      }
    }
  }
  .add-wrap {
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
.van-popup--center {
  background: transparent;
  .poup-center-text {
    color: #f5f5f5;
    padding: 35px 0;
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>
