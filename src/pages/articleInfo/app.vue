<template>
  <div class="container">
    <headerBetween leftText="比赛公告" color="#fff" bgColor="transparent" :leftType="true" />
    <div class="info">
      <div class="title ellipsis_2">{{info.title}}</div>
      <div class="item">报名截止日期：<span>{{info.entriesEnd | shortDate}}</span></div>
      <div class="item">比赛地点：<span>{{info.address}}</span></div>
    </div>

    <div class="details">
      <div class="title">报名须知</div>
      <div class="content">{{info.notice}}</div>
    </div>

    <div class="details">
      <div class="title">详情</div>
      <div class="content" v-html="info.content"></div>
    </div>

  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'

import {articleInfo} from '@/api/matchManage'
export default {
  components:{
    headerBetween
  },
  data () {
    return {
      contestId: '',
      info: {}
    }
  },
  created(){
    this.contestId = api.pageParam.data.id;
    this.articleInfo();
  },
  methods:{
    articleInfo(){
      articleInfo({
        contestId: this.contestId
      }).then(res=>{
        res.value.content = res.value.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block" ')
        this.info = res.value;
      })
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
    .title{
      font-size: 1.5rem;
      font-weight: bold;
      letter-spacing: 0.12rem;
      color: #ffffff;
     
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

  .details{
    margin-top: 3rem;
    .title{
      font-size: 1.5rem;
      font-weight: bold;
      color: #333333;
      letter-spacing: 0.12rem;
    }
    .content{
      font-size: 1.3rem;
      letter-spacing: 0.1rem;
      color: #697181;
      margin-top: 1rem;
      text-indent: 2em;
    }
  }
}
</style>