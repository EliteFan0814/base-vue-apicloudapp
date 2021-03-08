<template>
  <div class="match-wrap">
    <headerBetween leftText="比赛管理" :leftType="true" class="headerBetween"/>
    
    <baseTab @tabClick="tabClick" :tabs="tabs" class="tabs"/>

    <div class="contnet">
      <articleList v-if="type == 0"/>
      <matchList v-else/>
    </div>
  </div>
</template>

<script>
import headerBetween from '@/components/headerBetween'
import baseTab from '@/components/baseTab'

import articleList from './components/articleList'
import matchList from './components/matchList'

export default {
  components:{
    headerBetween,
    baseTab,
    articleList,
    matchList
  },
  data () {
    return {
      tabs: [{
        name: '比赛公告',
        value: 0
      },{
        name: '比赛',
        value: 1
      }
      ],
      type: 0,
    }
  },
  methods: {
    tabClick(type){
      this.type = type;
      console.log(type);
    }
  }
}
</script>

<style lang="scss" scoped>
.match-wrap{
  padding-bottom: 2rem;
  .headerBetween{
    background: #fff;
    padding-left:1.5rem;
  }
  .tabs{
    padding: 0 1.5rem;
    padding-top: 1.5rem;
    box-sizing: border-box;
  }
  .content{
    background: #f5f5f5;
  }
}
</style>