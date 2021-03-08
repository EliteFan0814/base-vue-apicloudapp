<template>
  <div class="match-wrap">
    <div class="card flex" v-for="item in info.teachers" :key="item.teacherId">
      <div class="left flex">
        <img class="teacher-img" :src="item.hostHeader" alt="">
        <div class="name">{{item.name}}</div>
      </div>
      <div class="right">教龄：<span>3年</span></div>
    </div>
  </div>  
</template>

<script>
import baseButton from '@/components/BaseButton'
export default {
  components: {
    baseButton,
  },
  props:{
    info: {
      type: Object,
      default: ()=>({})
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


