<template>
  <div class="match-wrap">
    <div class="card flex" v-for="item in list" :key="item.id">
        <div class="left flex">
        <img class="student-img" :src="item.hostHeader" alt="">
        <div class="name">{{item.name}}</div>
      </div>
      <div class="right">{{item.className}}</div>
    </div>
  </div>  
</template>

<script>
import baseButton from '@/components/BaseButton'

import {nameList} from '@/api/matchManage'
export default {
  components: {
    baseButton,
  },
  props:{
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      list: [],  
    }
  },
  created () {
    this.nameList();
  },
  methods:{
    nameList(){
      console.log(this.id);
      nameList({contestId: this.id}).then(res=>{
        this.list = res.value;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.match-wrap{
  width: 100vw;
  margin-left: -1.5rem;
  font-size: 1.4rem;
  .card{
    padding: 1.5rem;
    justify-content: space-between; 
    &:nth-child(ODD){
      background: #f5f5f5;   
    }
    .left{
      img{
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
      .name{
        margin-left: 1.15rem;
        color: #333;
      }
    }
    .right{
      color: #697181;
    }
  }
}
</style>


