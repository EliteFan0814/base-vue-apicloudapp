<template>
  <div class="container">
    <headerBetween leftText="点名记录" :leftType="true"/>

    <div class="screen flex">
      <baseTab @tabClick="tabClick" :tabs="tabs" class="tabs"/>

      <!-- <baseDropdown :option="dropdown" :defaultValue="orgClassId"  @change="dropDownChange" type="id"  class="dropdown"/> -->
    </div> 

    <div class="list" :class="{'minh': list.length}" v-if="list.length">
      <div class="list-item"  v-for="item in list" :key="item.id">
        <div class="title">
          <!-- 班级{{type == 'OrgClass' ? '点名' : '补课'}}<span>{{item.className}}</span> -->
          {{item.className}}
        </div> 
        <div class="time-between flex"> 
          <div>
            <div class="time">创建时间：<span>{{item.createDate | shortDate}}</span></div>
            <div class="time ">点名日期：<span>{{item.courseDate | shortDate}}</span></div>
            <!-- <div class="time ">点名类型：<span>{{item.refTypeStr}}</span></div> -->
            
            <div class="bottom flex">
              <div class="bottom-left flex">
                应到：<span>{{item.calssStudentCount}}人</span>
              </div>
              <div class="bottom-right flex">
                实到：<span >{{item.studentCount}}人</span>
              </div>
            </div>
          </div>

          <div class="right">
            <div class="img" @click="preview(item.photoHost)"><img :src="item.photoHost" alt=""></div>
            <van-image-preview v-if="showImage" v-model="showImage" :images="images" />

            <BaseButton name="查看详情" @click="showInfo(item.id)"/>
          </div>
        </div>
        
      </div>
    </div>

    <infoList v-if="showInfoVisible" :id="infoId" @close="close"/>

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
import BaseButton from '@/components/BaseButton'
import noList from '@/components/noList'
import baseTab from '@/components/baseTab'
import BaseDropdown from '@/components/BaseDropdown'

import infoList from './components/list'

import { openFrame } from '@/common/openPage.js'
// import {rollCallRecord} from '@/common/router.js'
import {rollCallRecord } from '@/api/rollCall.js'
import {getGradeList } from '@/api/index.js'
export default {
  components:{
    headerBetween,
    BaseButton,
    noList,
    baseTab,
    BaseDropdown,
    infoList,
  },
  data () {
    return {
      type: 'OrgClass',
      page: 1,
      infiniteId: + new Date(),
      list: [],
      showInfoVisible: false,
      infoId: '',
      id: '',
      showImage: false,
      images: [],
      tabs: [{
        name: '班级',
        value: 'OrgClass',
      },{
        name: '补课',
        value: 'MakeUp',
      }],
      dropdown: [],
      orgClassId: '',
    }
  },
  created(){
    // let {id} = api.pageParam.data;
    // if(id) this.id = id;
    // this.getGradeList();
  },
  watch:{
    type(){
      this.infiniteId += 1;
    }
  }, 
  methods:{
    getData($state) {
      if(!this.type) return $state.complete();
      const infinite = this.infiniteId
      if (infinite === this.infiniteId) {
        rollCallRecord({
          page: this.page,
          pageSize: 10,
          orgClassId: this.id,
          type: this.type,
        })
        .then(res => {
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
    // getGradeList(){
    //   getGradeList().then(res=>{
    //     let arr = res.value.data.map( item => ({
    //       text: item.className,
    //       value: item.id,
    //     }));
    //     let index = arr.findIndex(item=>item.value == this.id);
    //     this.orgClassId = arr[index]['value'];
    //     this.dropdown = arr;
    //     console.log(this.id);
    //     // this.id = arr[0]['value'];
    //   })
    // },
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
    tabClick(type){
      this.type = type;
      this.page = 1;
      this.list = [];
      this.infiniteId += 1;
    },
    dropDownChange(val, type){
      this[type] = val;
      this.list = [];
      this.page = 1;
      this.infiniteId += 1;
    },
  }
}
</script>

<style lang="scss" scoped>
.container{
  .screen{
    .tabs{
      width: 100%;
      position: fixed;
      top: 6.5rem;
      z-index: 99;
      background: #fff;
    }
    // .dropdown{
    //   width: 30%;
    // }
  }
  .list{
    margin-top: 4rem;
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
        font-weight: bold;
        span{
          font-size: 1.2rem;
          margin-left: 1rem;
        }
      }
      .time-between{
        justify-content: space-between;
        .right{
          text-align: center;
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
    }
  }
  .minh{
    min-height: calc(100vh - 50px);
    padding: 1.5rem;
  }
}
</style>