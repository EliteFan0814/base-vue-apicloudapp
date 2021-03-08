<template>
  <div class="article-wrap" v-html="result">
  </div>
</template>

<script>
import baseButton from '@/components/BaseButton'
export default {
  components: {
    baseButton,
  },
  props:{
    result: {
      type: String,
      default: ''
    }
  },
}
</script>

<style lang="scss" scoped>
.article-wrap{
  margin-top: 1rem;
  padding: 0 1.5rem;
  .card{
    background: #fff;
    padding: 1.3rem 1.55rem 2.05rem 1.15rem;
    border-radius: 1rem;
    &:nth-child(n+2){
      margin-top: 1.5rem;
    }
    .title{
      font-size: 1.5rem;
    }
    .flex{
      margin-top: 1rem;
      font-size: 1.2rem;
      justify-content: space-between;
      color: #666;
      .left{
        &-item{
          &:nth-child(n+2){
            margin-top: .5rem;
          }
        }
      }
      .right{
        margin-bottom: .5rem;
      }
    }
  }
}
</style>


