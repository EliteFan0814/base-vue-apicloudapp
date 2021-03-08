<template>
  <div class="container">
    <headerBetween leftText="比赛" color="#fff" bgColor="transparent" :leftType="true" class="headerBetween"/>
    <div class="info flex">
      <div class="info-left">
        <div class="title ellipsis_2">{{info.title}}</div>
        <div class="item">开赛时间：<span>{{info.contestDate}}</span></div>
        <div class="item">比赛地点：<span class="place">{{info.contestAddress}}</span></div>
      </div>
      <div class="info-right">{{info.isEndStr}}</div>
    </div>


    <div class="content">
      <baseTab @tabClick="tabClick" :tabs="tabs" class="tabs" />

      <matchDetails v-if="type == 0" :content="content"/>
      <teacher v-else-if="type == 1 " :info="info"/>
      <nameList v-else-if="type == 2 " :id="id"/>
      <result v-else :result="result"/>
    </div>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import baseTab from '@/components/baseTab'

import matchDetails from './components/details'
import teacher from './components/teacher'
import nameList from './components/nameList'
import result from './components/result'

import {matchInfo} from '@/api/matchManage'

export default {
  components:{
    headerBetween,
    baseTab,
    matchDetails,
    nameList,
    result,
    teacher,
  },
  data () {
    return {
      tabs: [{
        name: '比赛详情',
        value: 0
      },{
        name: '带队老师',
        value: 1
      },{
        name: '参赛名单',
        value: 2
      },{
        name: '比赛结果',
        value: 3
      }
      ],
      type: 0,
      id: '',
      info: {},
      result: '',
      content: '',
    }
  },
  created () {
    this.id = api.pageParam.data.id;
    console.log(this.id);
    this.matchInfo();
  },
  methods: {
    matchInfo(){
      matchInfo({contestId: this.id}).then(res => {
        this.info =  res.value;
        this.result = res.value.result ? res.value.result.replace(/\<img/, '<img style="max-width:100%;height:auto;display:block"') : '';
        this.content = res.value.content.replace(/\<img/, '<img style="max-width:100%;height:auto;display:block"');
        console.log(this.content);
      })
    }, 
    tabClick(type){
      this.type = type;
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: url('../../static/image/header-bg.png') no-repeat ;
  background-size: 100vw 16rem;
  padding-bottom: 0;
  .info{
    padding-top: 1.5rem;
    justify-content: space-between;
    &-left{
      flex: 1;
      .title{
        font-size: 1.5rem;
        font-weight: bold;
        letter-spacing: 0.12rem;
        color: #ffffff;
        width: 65vw;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
      .item{
        font-size: 1.2rem;
        color: #ffffff;
        margin-top: .25rem;
        span{
          margin-left: .5rem;
        }
        .place{
          width: 40vw;
          white-space: pre-wrap;
        }
      }
    }
    &-right{
      font-size: 1.5rem;
      font-weight: bold;
      letter-spacing: 0.12rem;
      color: #ffffff;
      width: 10rem;
      text-align: center;
    }
  }
  .content{
    width: 100vw;
    min-height: calc(100vh - 14.5rem);
    background: #fff;
    margin-left: -1.5rem;
    margin-top: 1rem;
    padding: 1.65rem 1.5rem;
    box-sizing: border-box;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    .tabs{
      margin-bottom: 2rem;
    }
  }
}
</style>