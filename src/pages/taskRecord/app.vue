<template>
  <div class="record-wrap">
    <div class="header">
      <headerBetween leftText="作业记录" :leftType="true" />
      <div class="title flex">
        <div class="title-left">
          <div class="desc ellipsis_1">{{titleInfo.name}} </div>
          <div class="item">开始日期：<span>{{titleInfo.beginDate | shortDate}}</span></div>
          <div class="item">结束日期：<span>{{titleInfo.endDate | shortDate}}</span></div>
          <!-- <div class="item">作业描述：<span>{{titleInfo.desc}}</span></div> -->
          <div class="item">已提交：<span>{{titleInfo.submitCount}}</span></div>
        </div>
        <div class="title-right">
          <div class="type">{{!titleInfo.isContinuous ? '单次作业' : '连续作业'}}</div>
          <div class="num">{{titleInfo.studentCount}}人</div>
          <div @click="openDetail" class="open-detail">
            查看作业要求
            <!-- <BaseButton @click="openDetail" name="作业详情"></BaseButton> -->
          </div>
        </div>
        <!-- <div class="title-bottom ellipsis_2">
          作业描述：<span>{{titleInfo.desc}}</span>
        </div>
        <div class="title-bottom">
          已提交：<span>{{titleInfo.submitCount}}人</span>
        </div> -->
      </div>
      <div class="screen flex">
        <baseDropdown :option="assingmentWays" :defiaultValue="way" @change="dropDownChange" type="way"
          class="dropdown" />
        <!-- <baseDropdown :option="dropdown" :defaultValue="defaultValue" @change="dropDownChange" type="defaultValue"  class="dropdown"/> -->
        <baseDropdown :option="daysTypes" :defaultValue="date" @change="dropDownChange" type="date" class="dropdown" />
      </div>
    </div>

    <div class="list">
      <div class="list-item" v-for="(item, index) in list" :key="item.d">
        <div class="title flex">
          <div class="title-left flex">
            <img class="image student-img" :src="item.childHeaderHost" alt="">
            <div class="name">{{item.childName}}</div>
          </div>
          <div class="title-right">{{item.updateTime}}上传</div>
        </div>

        <div class="pic" v-if="item.imgArray.length" @click="preview(item.imgArray)">
          <template v-for="item2 in item.imgArray">
            <div class="pic-item">
              <img :src="item2" alt="">
            </div>
          </template>
          <!-- 大图预览 -->
          <van-image-preview v-model="showImage" :images="images">
            <!-- <template v-slot:index>第{{ index }}页</template> -->
          </van-image-preview>
        </div>

        <div class="video" v-else>
          <video controlsList="nodownload" poster="@/static/image/video.png" :src="item.video" controls width="100%"
            height="100%">您的浏览器不支持 video 标签。</video>
        </div>

        <div class="desc cont">
          <van-field class="field" v-model="'作业描述：'+item.content" :rows="1" readonly autosize type="textarea" />
          <van-field v-show="false" v-model="item.content" autosize type="textarea" placeholder="请输入用户名" />
        </div>

        <div class="desc " v-if="item.reviewsContent">
          <!-- <div class="text ellipsis_2">
            作业描述...
          </div> -->
          <van-field v-model="'点评内容：'+item.reviewsContent" :rows="3" autosize type="textarea" readonly
            placeholder="请输入点评内容" />
          <van-field v-show="false" v-model="desc" autosize type="textarea" placeholder="请输入用户名" />
        </div>
        <div class="bottom flex">
          <!-- 表扬按钮 -->
          <div class="icon-wrap">
            <img
              :src="item.isExcellent ? require('@/static/image/task/great-active.png') : require('@/static/image/task/great.png')"
              @click="setPraise(item, index)">
            <img v-if="!item.reviewsDate" :src="require('@/static/image/task/comment.png')"
              @click="commentClick(item, index)">
            <!-- == null ? (item.isComment ? false : true) : false -->
          </div>
          <div class="comment-info">
            <!-- == null ? (item.reviewsContent  ? true : false) : false -->
            <!-- <base-button v-if="!item.reviewsDate" name="提交" @click="submit(item, index)"/> -->
            <div class="teacher-info flex" v-if="item.reviewsDate">
              <img class="image teacher-img" :src="item.teacherHeaderHost" alt="">
              <div class="name">{{item.teacherName}}</div>
              <div class="time">{{item.reviewsDate | shortDate}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <infinite-loading @infinite="getData" :identifier="infiniteId" infinite-scroll-distance="10" direction="bottom">
      <div slot="spinner" class="whiteBg">读取中...</div>
      <div slot="no-more" class="whiteBg">已加载全部</div>
      <div slot="no-results" class="whiteBg">
        <noList text="暂无记录"></noList>
      </div>
    </infinite-loading>

    <van-overlay :show="dialog" class-name="dia">
      <div class="dialog">
        <van-field v-model="commentValue" clearable label="文本" placeholder="请输入点评内容" label-width="4rem" type="textarea"
          rows="5" autosize maxlength="200" show-word-limit />
        <div class="flex">
          <base-button name="取消" @click="dialog = false" class="btn cancel" />
          <base-button name="确定" @click="confirm" class="btn" />
        </div>
      </div>
    </van-overlay>
    <van-dialog v-model="showDetail" :showConfirmButton="false">
      <div slot="title" class="detail-title">
        <div></div>
        <div>作业详情</div>
        <div @click="closeDialog" class="right-delete"><img src="@/static/image/deleteGrey.svg" alt=""></div>
      </div>
      <div class="dialog-detail">
        <div class="desc-wrap">
          <div class="item-title">作业描述：</div>
          <div class="desc">{{taskDetailDesc}}</div>
        </div>
        <div v-if="taskDetailImgs.length" class="img-wrap">
          <!-- <div class="item-title">详情文件：</div> -->
          <div class="img-list">
            <div v-for="(item,index) in taskDetailImgs" :key="index" class="img-item-wrap">
              <div @click="imagePreview(index)" class="img-item">
                <img :src="item" alt="">
              </div>
            </div>
          </div>
        </div>
        <div v-if="taskDetailVideo" class="video-wrap">
          <!-- <div class="item-title">详情文件：</div> -->
          <div class="video-list">
            <video controls controlsList="nodownload" :src="taskDetailVideo" poster="@/static/image/video.png">不支持 video
              标签。
            </video>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import BaseDropdown from '@/components/BaseDropdown'
import BaseButton from '@/components/BaseButton'
import noList from '@/components/noList'
import { ImagePreview } from 'vant'

import { taskRecordList, setPraise, comment, getTaskDetail } from '@/api/task'

export default {
  components: {
    headerBetween,
    BaseDropdown,
    BaseButton,
    noList
  },
  data() {
    return {
      showDetail: false,
      dropdown: [
        {
          text: '单次作业',
          value: false
        },
        {
          text: '连续作业',
          value: true
        }
      ],
      defaultValue: false,
      desc: '',
      cont: '',
      id: '',
      way: '',
      date: '',
      page: 1,
      list: [],
      infiniteId: +new Date(),
      assingmentWays: [],
      daysTypes: [],
      showImage: false,
      images: [],
      titleInfo: {},
      dialog: false,
      commentValue: '', //评论内容
      taskDetailDesc: undefined,
      taskDetailImgs: [],
      taskDetailVideo: undefined
    }
  },
  created() {
    this.titleInfo = api.pageParam.data.item
    this.getTaskDetail()
  },
  methods: {
    getTaskDetail() {
      getTaskDetail(this.titleInfo.id)
        .then((res) => {
          this.taskDetailDesc = res.value.desc || ''
          this.taskDetailImgs = res.value.hostImgs || []
          this.taskDetailVideo = res.value.video || ''
        })
        .catch((err) => {})
    },
    // 预览照片
    imagePreview(index) {
      ImagePreview({ images: this.taskDetailImgs, startPosition: index })
    },
    // 打开作业详情
    openDetail() {
      this.showDetail = true
    },
    getData($state) {
      const infinite = this.infiniteId
      if (infinite === this.infiniteId) {
        taskRecordList({
          page: this.page,
          pageSize: 10,
          schoolAssignmentId: this.titleInfo.id,
          way: this.way,
          date: this.date
        }).then((res) => {
          const { value } = res
          if (this.assingmentWays.length <= 0) {
            value.assingmentWays.forEach((item) => {
              item.text = item.name
            })
            this.assingmentWays = value.assingmentWays
            console.log(JSON.stringify(this.assingmentWays))
            value.daysTypes.forEach((item) => {
              item.text = item.name
            })
            this.daysTypes = value.daysTypes
          }
          if (value.value.data.length) {
            this.list.push(...value.value.data)
            this.page += 1
            $state.loaded()
          } else {
            $state.complete()
          }
        })
      }
    },
    resetData() {
      this.list = []
      this.page = 1
      this.infiniteId += 1
    },
    preview(arr) {
      this.images = arr
      this.showImage = true
    },
    dropDownChange(val, type) {
      this[type] = val
      this.resetData()
    },
    setPraise(item, index) {
      //表扬
      setPraise({ assignmentId: item.id, status: !item.isExcellent }).then((res) => {
        if (res.success) {
          item.isExcellent = !item.isExcellent
          this.list.splice(index, 1, item)
          // this.resetData();
        }
      })
    },
    submit(item, index) {
      //提交
      if (!item.reviewsContent) return this.$toast.fail('请输入点评内容')
      comment({ assignmentId: item.id, reviewsContent: item.reviewsContent }).then((res) => {
        if (res.success) {
          this.list = []
          this.page = 1
          this.infiniteId += 1
          api.toast({ msg: '点评成功' })
          // let list = this.list;
          // list[index]['isComment'] = this.commentValue;
          // this.list = list;
        }
      })
    },
    commentClick(item, index) {
      this.commentValue = item.reviewsContent
      this.dialog = true
      this.index = index
      this.id = item.id
    },
    //
    closeDialog() {
      this.showDetail = false
    },
    confirm() {
      //弹出框确定
      if (!this.commentValue) return this.$toast.fail('请输入点评内容')
      comment({ assignmentId: this.id, reviewsContent: this.commentValue }).then((res) => {
        if (res.success) {
          this.list = []
          this.page = 1
          this.infiniteId += 1
          api.toast({ msg: '点评成功' })
          this.dialog = false
          this.commentValue = ''
          api.sendEvent({ name: 'changeTodoNum' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.record-wrap {
  background: #f5f5f5;
  .header {
    padding: 0 1.5rem;
    background: #fff;
    .title {
      color: #999;
      justify-content: space-between;
      border: 1px solid #f1f1f1;
      padding: 1rem 0;
      border-left-style: none;
      border-right-style: none;
      &-left {
        .desc {
          width: 60vw;
          color: #333;
          font-size: 1.6rem;
          margin-bottom: 0.3rem;
        }
        .item {
          font-size: 1.2rem;
        }
      }
      &-right {
        text-align: center;
        .type {
          font-size: 1.4rem;
        }
        .num {
          font-size: 1.8rem;
          font-weight: bold;
          color: #4385ff;
          margin-top: 0.5rem;
        }
        .open-detail {
          color: #4385ff;
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
      &-bottom {
        font-size: 1.2rem;
        width: 60vw;
      }
      span {
        margin-left: 0.2rem;
      }
    }
    .screen {
      justify-content: space-between;
    }
  }

  .list {
    padding: 1.5rem;
    &-item {
      background: #fff;
      border-radius: 1rem;
      padding: 0.5rem 1.5rem;
      &:nth-child(n + 2) {
        margin-top: 1.5rem;
      }
      .title {
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        img {
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 50%;
        }
        .name {
          margin-left: 1.55rem;
          font-size: 1.4rem;
          letter-spacing: 0.11rem;
          color: #333333;
        }
      }
      .pic {
        display: flex;
        flex-wrap: wrap;
        &-item {
          width: 31%;
          height: 6rem;
          border: 1px solid #f6f6f6;
          margin-right: 0.5rem;
          &:nth-child(n + 4) {
            border: 1px solid #f6f6f6;
            margin-top: 0.5rem;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .video {
        width: 100%;
        height: 20rem;
        video {
        }
      }
      .cont {
        .van-field {
          padding-bottom: 1rem !important;
        }
      }
      .desc {
        margin-top: 1rem;
        font-size: 1.2rem;
        position: relative;
        .text {
          letter-spacing: 0.09rem;
          color: #697181;
          width: 31rem.5;
        }
        .van-field {
          padding: 0.5rem 0.25rem 0;
          &::after {
            left: 0;
            right: 0;
            width: 100%;
          }
          .field {
            height: auto;
          }
        }
      }
      .bottom {
        margin: 1.5rem 0;
        justify-content: space-between;
        // .icon-wrap{
        //   width: 10rem;
        //   background: skyblue;
        // }
        img {
          width: 2rem;
        }
        :nth-child(n + 2) {
          margin-left: 3.55rem;
        }

        .teacher-info {
          font-size: 1.2rem;
          letter-spacing: 0.09rem;
          color: #697181;
          justify-content: center;
          img {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
          }
          .name {
            margin: 0 0.5rem;
          }
          .time {
            margin-left: 0;
          }
        }
      }
    }
  }
  ::v-deep input:placeholder {
    font-size: 1.2rem;
  }
  .detail-title {
    margin-top: -1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      width: 33.33%;
      text-align: center;
    }
    .right-delete {
      display: flex;
      justify-content: flex-end;
      padding-right: 1rem;
      img {
        display: block;
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }
  .dialog-detail {
    margin: 0 0.3rem;
    padding: 0.3rem 0;
    height: 30rem;
    overflow-y: scroll;
    .item-title {
      color: #000;
      margin: 0 0.3rem 0.3rem;
      // border-bottom: 1px solid #ccc;
    }
    .desc-wrap {
      color: #777;
      margin-bottom: 0.5rem;
      .desc {
        margin: 0 0.3rem;
      }
    }
    .img-wrap {
      .img-list {
        display: flex;
        flex-wrap: wrap;
        .img-item-wrap {
          margin-bottom: 0.5rem;
          width: 33.33%;
          display: flex;
          justify-content: center;
          align-items: center;
          .img-item {
            background-color: #f5f5f5;
            width: 8rem;
            height: 8rem;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              max-width: 8rem;
              max-height: 8rem;
            }
          }
        }
      }
    }
    .video-wrap {
      .video-list {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      video {
        width: 100%;
        height: 20rem;
      }
    }
  }
}

.dia {
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  width: 100%;
  background: #fff;
  margin: 1rem;
  padding: 1rem 0;
  border-radius: 0.5rem;
  text-align: right;
  .flex {
    justify-content: flex-end;
  }
  .btn {
    margin-top: 1rem;
    margin-right: 1rem;
  }
  .cancel {
    color: #f2f2f2;
    background: #ccc;
  }
}
</style>