<template>
  <van-popup v-model="show" @close="close">
    <img src="@/static/image/icon/confirm-bg.png" alt="">
    <div class="content ">
      <div class="title">本次点名共<span class="blue">{{totalNum}}</span>人,缺勤<span class="red">{{notYet}}</span>人</div>
      <div class="btn-wrap">
        <div class="confirm" @click="submit">确认点名</div>
        <div class="cancel" @click="show = false">取消点名</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import BaseButton from '@/components/BaseButton'

import {rollCall,} from '@/api/rollCall.js'
export default {
  props:{
    params:{
      type: Object,
      default: ()=>({})
    },
    totalNum:{
      type: Number,
      default: 0
    },
    notYet:{
      type: Number,
      default: 0
    }
  },
  components:{
    BaseButton,
  },
  data () {
    return {
      show: true,
    }
  },
  created () {
  },
  methods:{
    submit(){
      console.log(JSON.stringify(this.params));
      
      rollCall(this.params).then(res=>{
        if(res.success){
          api.toast({msg: '点名成功', global: true})
          this.close(1);
        }
      })
    },
    close(val){
      this.$emit('close', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.van-popup{
  width: 31.8rem;
  border-radius: 0.5rem;
  img{
    width: 100%;
    height: 18rem;
  }
  .content{
    background: #fff;
    text-align: center;
    .title{
      font-size: 1.8rem;
      letter-spacing: 0.18rem;
      color: #333333;
      margin-top: 2.85rem;
      margin-bottom: 4rem;
      .blue{
        color: #4385FF;
        font-weight: bold;
        margin: 0 .5rem;
      }
      .red{
        color: #EB4848;
        font-weight: bold;
        margin: 0 .5rem;
      }
    }
    .btn-wrap{
      margin: 0 auto;
      display: inline-block;
      font-size: 1.5rem;
      .confirm{
        width: 24.95rem;
        padding: .95rem;
        background: #4385FF;
        border-radius: 1.78rem;
        color: #fff;
      }
      .cancel{
        color: #999;
        margin: 2.35rem 0;
      }
    }
  }
}
</style>


