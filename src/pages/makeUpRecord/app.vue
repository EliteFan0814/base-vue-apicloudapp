<template>
  <div class="container">
    <headerBetween leftText="补课记录" :leftType="true"/>
    
    <div class="list"  :class="{'minh': list.length}" v-if="list.length">
      <div class="list-item" v-for="item in list" :key="item.id">
        <div class="title">
          <span>{{item.name}}</span>
        </div> 
        <div class="time-between flex"> 
          <div>
            <div class="time ">补课日期：<span>{{item.makeupDate | shortDate}}</span></div>
            <div class="time">上课时间：<span>{{item.beginTime | shortDate}}-{{item.endTime | shortDate}}</span></div>
            <!-- <div class="time ">补课类型：<span>{{item.refTypeStr}}</span></div> -->
            
            <div class="bottom flex">
              <div class="bottom-left flex">
                课时：<div>{{item.makeupHour}}</div>
              </div>
              <div class="bottom-right flex">
                补课学生：<div >{{item.makeupStudentCount}}人</div>
              </div>
            </div>
            <div class="bottom flex">
              <div class="bottom-left flex">
               总课时：<div>{{item.totalMakeupHour}}</div>
              </div>
              <!-- <div class="bottom-right flex">
                补课学生：<span >{{item.makeupStudentCount}}人</span>
              </div> -->
            </div>
          </div>

          <div class="right">
            <!-- <div class="img" @click="preview(item.photoHost)"><img :src="item.photoHost" alt=""></div>
            <van-image-preview v-if="showImage" v-model="showImage" :images="images" /> -->
            <div class="text" v-if="!item.isTollCall">{{item.isTollCallStr}}</div>
            <BaseButton v-else name="查看详情" @click="showInfo(item.id)"/>
          </div>
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

    <infoList v-if="showInfoVisible" :id="infoId" @close="close"/>

  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import BaseButton from '@/components/BaseButton'
import noList from '@/components/noList'
import BaseDropdown from '@/components/BaseDropdown'

import infoList from './components/list'

import {makeUpRecord } from '@/api/rollCall.js'
export default { 
  components:{
    headerBetween,
    BaseButton,
    noList,
    BaseDropdown,
    infoList
  },
  data () {
    return {
      id: '',
      page: 1,
      infiniteId: + new Date(),
      list: [],
      showInfoVisible: false,
      infoId: '',
      showImage: false,
      images: [],
      refType: '',
      dropdown: [],
    }
  },
  watch:{
    id(){
      this.resetData();
    }
  },
  methods:{
    getData($state) {
      const infinite = this.infiniteId
      if (infinite === this.infiniteId) {
        makeUpRecord({
          page: this.page,
          pageSize: 10,
        })
        .then(res => {
          console.log(res.value.data.length);
          if (res.value.data.length) {
            this.list.push(...res.value.data)
            this.page += 1
            $state.loaded()
          } else {
            $state.complete()
          }
        })
      }
    },
    preview(pic){
      this.images = [pic];
      this.showImage = true;
    },
    showInfo(id){
      this.infoId = id;
      this.showInfoVisible = true;
    },
    close(){
      this.showInfoVisible = false;
    },
    dropDownChange(val, type){
      this[type] = val;
      this.resetData();
    },
    resetData(){
      this.list = [];
      this.page = 1;
      this.infiniteId += 1;
    },
  }
}
</script>

<style lang="scss" scoped>
.container{
  .list{
    width: 100vw;
    margin-left: -1.5rem;
    color: #333;
    background: #f5f5f5;
    padding: 0;
    box-sizing: border-box;
    &-item{
      padding: 1.25rem 1.7rem;
      // padding-bottom: 2rem;
      background-color: #ffffff;
      border-radius: 0.5rem;
      &:nth-child(n+2){
        margin-top: 1.5rem;
      }
      .title{
        font-size: 1.4rem;
        color: #333;
        span{
          font-weight: bold;

        }
      }
      .time-between{
        color: #9a9a9b;
        justify-content: space-between;
        .right{
          font-size: 1.2rem;
          text-align: center;
          // color: #999;
        }
        .img{
          width: 10rem;
          height: 4rem;
          margin-bottom: 1rem;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .time{
        margin: .8rem 0;
        font-size: 1.2rem;
      }
      .time.flex{
        margin: 0 0 1.5rem;
      }

      .bottom{
        font-size: 1.2rem;
        &-right{
          margin-left: 1rem;          
        }
      }
      &:nth-child(n) .bottom{
        margin-top: .8rem;
      }
    }
  }
  .minh{
    min-height: calc(100vh - 50px);
    padding: 1.5rem;
  }
  .header{
    text-align: center;
    margin-top: -1.5rem;
    .text{
      width: 50%;
    }
  }
}
</style>