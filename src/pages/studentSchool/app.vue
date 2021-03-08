<template>
  <div class="container">
    <HeaderBetween leftText="艺企淘"></HeaderBetween>
    <div class="content-wrap">
      <BaseTab @tabClick="handleTab" :tabs="tabbarList"></BaseTab>
      <div class="list-wrap">
        <TrainList v-if="tabValue === 0"></TrainList>
      </div>
    </div>

  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import BaseTab from '@/components/baseTab'
import BaseButton from '@/components/BaseButton'
import TrainList from './components/TrainList'
export default {
  components: {
    HeaderBetween,
    BaseTab,
    BaseButton,
    TrainList
  },
  data() {
    return {
      tabValue: 0,
      tabbarList: [
        { name: '师资培训', value: 0 },
        { name: '学历提升', value: undefined, noUse: '暂未开通，敬请期待！' },
        { name: '小视频', value: undefined, noUse: '暂未开通，敬请期待！' },
      ]
    }
  },
  methods: {
    handleTab(value) {
      // if (value === undefined) {
      //   this.$toast('暂未开通，敬请期待！')
      // }
    }
  }

}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f5f5f5;
  padding: 0 2rem;
  .content-wrap {
    padding: 2rem 0;
    .list-wrap {
      box-sizing: border-box;
      position: absolute;
      width: calc(100% - 4rem);
      top: 12.2rem;
      bottom: 0;
      overflow-y: scroll;
    }
  }
}
</style>