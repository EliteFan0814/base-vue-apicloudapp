<template>
  <div class="record-wrap">
    <div class="header">
      <headerBetween leftText="我的点评" leftType/>
    </div>
    
    <div class="list">
      <div class="list-item" v-for="item in list" :key="item.id">
        <div class="title flex">
          <div class="title-left">
            <div class="name">{{item.name}}</div>
            <div class="className">{{item.className}}</div>
          </div>
          <div class="title-right flex">
            <img class="student-img" :src="item.childHeaderHost" alt="">
            <div class="name">{{item.childName}}</div>
          </div>
        </div>

        <div class="pic" v-if="item.imgArray.length" @click="preview(item.imgArray)">
          <template v-for="pic in item.imgArray">
            <div class="pic-item">
              <img :src="pic" alt="" >
            </div>
          </template>
          <!-- 大图预览 -->
        <van-image-preview v-model="showImage" :images="images" >
          <!-- <template v-slot:index>第{{ index }}页</template> -->
        </van-image-preview>
        </div>
        
        <div class="video" v-else>
          <video :src="item.video" controls width="100%" height="100%">您的浏览器不支持 video 标签。</video>
        </div>

        <div class="desc ">
          <van-field v-model="item.desc" :rows="2" readonly autosize type="textarea" />
          <van-field v-show="false" v-model="item.desc"  autosize type="textarea" placeholder="请输入用户名" />
        </div>

        <div class="desc " >
          <van-field v-model="item.reviewsContent" :rows="5" autosize type="textarea" :readonly="item.reviewsContent && true" placeholder="请输入点评内容" />
          <van-field v-show="false" v-model="item.reviewsContent"  autosize type="textarea" placeholder="请输入用户名" />
          <div class="teacher-info flex" v-if="item.reviewsDate">
            <div class="time">{{item.reviewsDate | shortDate}}</div>
          </div>
        </div>
        <div class="bottom flex" >
          <img :src="item.isExcellent ? require('@/static/image/task/great-active.png') : require('@/static/image/task/great.png')" alt="">
        </div>
      </div>
    </div>

    <infinite-loading @infinite="getData"
      :identifier="infiniteId"
      infinite-scroll-distance="10"
      direction="bottom">
      <div slot="spinner"
        class="whiteBg">读取中...</div>
      <div slot="no-more"
        class="whiteBg">已加载全部</div>
      <div slot="no-results"
        class="whiteBg">
        <noList text="暂无记录"></noList>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import noList from '@/components/noList'

import {commentList} from '@/api/task'

export default {
  components:{
    headerBetween,
    noList
  },
  data () {
    return {
      classId: '',
      page: 1,
      list: [],
      infiniteId: + new Date(),
      showImage: false,
      images: [],
      info: {}
    }
  },
  created(){
    this.classId = api.pageParam.data.id;
  },
  methods:{
    getData($state) {
      const infinite = this.infiniteId
      if (infinite === this.infiniteId) {
        commentList({
          page: this.page,
          pageSize: 10,
          classId: this.classId,
        })
        .then(res => {
          const {value} = res;
          if (value.data.length) {
            this.list.push(...value.data);
            this.page += 1;
            $state.loaded();
          } else {
            $state.complete()
          }
        })
      }
    },
    preview(arr){
      this.images = arr;
      this.showImage = true;
    },
  }
}
</script>

<style lang="scss" scoped>
.record-wrap{
  background: #F5F5F5;
  .header{
    padding: 0 1.5rem;
    background: #fff;
    .screen{
      justify-content: space-between;
    }
  }

  .list{
    padding: 1.5rem;
    &-item{
      background: #fff;
      border-radius: 1rem;
      padding: .5rem 1.5rem;
      &:nth-child(n+2){
        margin-top: 1.5rem;
      }
      .title{
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        font-size: 1.4rem;
        color: #333;
        &-left{
          .name{
          }
          .className{
            font-size: 1.2rem;
            margin-top: .3rem;
            color: #999;
          }
        }
        &-right{
          img{
            width: 3rem;
            height: 3rem;
            display: inline-block;
            margin-right: .5rem;
            border-radius: 50%;
          }
          .name{
          }
        }
      }
      .pic{
        display: flex;
        flex-wrap: wrap;
        &-item{
          width: 31%;
          height: 6rem;
          border: 1px solid #f6f6f6;
          margin-right: .5rem;
          &:nth-child(n+4){
            border: 1px solid #f6f6f6;
            margin-top: .5rem;
          }
          // &:nth-child(3n){
          //   margin-right: 0;
          // }
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .video{
        width: 100%;
        height: 30rem;
        video{
          
        }
      }
      .desc{
        margin-top: 1rem;
        font-size: 1.2rem;
        position: relative;
        .text{
          letter-spacing: 0.09rem;
          color: #697181;
          width: 31rem.5;
        }
        .van-cell{
          padding: 1rem .25rem 0;
          &::after{
            left: 0;
            right: 0;
            width: 100%;
          }
        }
        .teacher-info{
          position: absolute;
          right: 0;
          bottom: 1rem;
          font-size: 1.2rem;
          letter-spacing: 0.09rem;
          color: #697181;
          img{
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
          }
          .name{
            margin-left: .75rem;
            margin-right: 1.7rem;
          }
        }
      }
      .bottom{
        margin: 1.5rem 0;
        justify-content: space-between;
        img{
          width: 2rem;
        }
        :nth-child(n+2){
          margin-left: 3.55rem;
        }
      }
    }
  }
  ::v-deep input:placeholder{
    font-size: 1.2rem;
  }
}
</style>