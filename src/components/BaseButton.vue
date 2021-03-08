<template>
  <div @click="handleClick" class="button" :class="[isPushing?'is-pushing':'',isRefuse?'is-refuse':'']">
    {{name}}
  </div>
</template>

<script>
//  name 按钮名字
// isPushing 判断请求是否正在处理中

export default {
  props: {
    name: {
      type: String,
      default: '按钮'
    },
    isRefuse: {
      type: Boolean,
      default: false
    },
    isPushing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleClick() {
      if (!this.isPushing) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: inline-block;
  background-color: #4385ff;
  box-shadow: 0rem 0.15rem 0.4rem 0rem rgba(24, 80, 184, 0.3);
  border-radius: 1.45rem;
  font-size: 1.2rem;
  line-height: 1.2rem;
  color: #ffffff;
  padding: 0.9rem 2.35rem;
  text-align: center;
  transition: all 0.1s;
  white-space: nowrap;
}
.is-refuse {
  background-color: #ff4343;
}
.is-pushing {
  background-color: #d0d0d0;
  color: #fff;
}
</style>