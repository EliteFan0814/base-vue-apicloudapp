<template>
  <van-popup v-model="show" round position="bottom" 
    :style="{ height: '50%' }" closeable
    @close="close" >
    <div class="title">名单</div>
    
    <div class="list">
      <div class="list-item flex" v-for="item in list" :key="item.id">
        <div class="left flex">
          <img class="student-img" :src="item.headerHost" alt="">
          <div class="name">{{item.name}}</div>
        </div>
        <div class="right" :class="item.status ? 'blue' : 'orange'">{{item.statusStr}}</div>
      </div>
    </div>

  </van-popup>  
</template>

<script>
import {rollCallRecordList } from '@/api/rollCall.js'

export default {
  props:{
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      show: true,
      list: []
    }
  },
  created () {
    this.rollCallRecordList();
  }, 
  methods:{
    rollCallRecordList(){
      rollCallRecordList({tollCallId: this.id}).then(res => {
        this.list = res.value;
      })
    },
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.van-popup{
  padding: 4rem 1.5rem 0;
  box-sizing: border-box;
  overflow-y: auto;
  .title{
    font-size: 1.6rem;
    position: absolute;
    top: 2rem;
    left: 1.5rem;
  }
  .list{
    margin-top: 1rem;
    &-item{
      font-size: 1.4rem;
      justify-content: space-between;
      &:nth-child(n+2){
        margin-top: .5rem;
      }
      .left{
        color: #333;
        img{
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          margin-right: 1rem;
        }
      }
      .right{
        
      }
      .orange{
        color: #ffad5c;
      }
      .blue{
        color: #4385ff;
      }
    }
  }
}
</style>


