<template>
  <div>
    <div class="match-wrap" v-html="content">
    
  </div>  
  </div>
</template>

<script>
export default {
  props:{
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.match-wrap{
  font-size: 1.3rem;
  color: #697181;
}
</style>


