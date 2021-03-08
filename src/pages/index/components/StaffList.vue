<template>
  <div class="tabbar-content">
    <div v-for="(item,index) in formList" :key="index" class="tabbar-item">
      <!-- 班级管理 -->
      <template v-if="formType === 'gradeform'">
        <div class="bar-top">
          <div class="left-info">
            <span class="first">{{item.className}}</span>
            <span class="second">学员数：{{item.studentCount}}</span>
          </div>
          <BaseButton @click="openGradeDetail(item.id)" name="进入班级"></BaseButton>
        </div>
        <!-- <div class="bar-btm">
          <span></span>
          <span>创建时间：{{item.createDate?item.createDate.split(' ')[0]:''}}</span>
        </div> -->
      </template>
      <!-- 师资培训 -->
      <template v-if="formType === 'teacherform'">
        <div class="bar-top">
          <div class="left-info">
            <span class="first">{{item.title}}</span>
            <span v-if="item.trainingTypeName" class="second"><van-tag plain type="primary">{{item.trainingTypeName}}</van-tag></span>
          </div>
          <BaseButton @click="openJoinDetail(item.id)" name="前往报名"></BaseButton>
        </div>
        <div class="bar-btm">
          <span>开始时间：{{item.createDate?item.createDate.split(' ')[0]:''}}</span>
          <span>结束时间：{{item.endDate?item.endDate.split(' ')[0]:''}}</span>
        </div>
      </template>
    </div>
    <infinite-loading @infinite="getData" :identifier="infiniteId" direction="bottom">
      <div slot="spinner" class="state-style">读取中...</div>
      <div slot="no-more" class="state-style">已加载全部</div>
      <div slot="no-results" class="state-style">
        <no-list text="暂无信息"></no-list>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton'
import noList from '@/components/noList'
import request from '@/api/index'
import { gradeDetail, teacherTrain } from '@/common/router.js'
import { openWin } from '@/common/openPage.js'

export default {
  components: {
    BaseButton,
    noList
  },
  props: {
    formType: {
      type: String,
    },
    refresh: {
      type: Number
    }
  },
  watch: {
    formType() {
      this.resetData();
    },
    refresh() {
      this.resetData();
    }
  },
  data() {
    return {
      page: 1,
      row: 10,
      formList: [],
      infiniteId: +new Date(),
    }
  },
  mounted() {
    const that = this
    api.addEventListener({
      name: 'applySuccess'
    },
      (res, err) => {
        that.resetData()
      })
    // api.addEventListener({
    //   name: 'pullRefresh'
    // },
    //   (res, err) => {
    //     that.resetData()
    //   })
  },
  methods: {
    resetData() {
      this.page = 1;
      this.formList = [];
      this.infiniteId += 1;
    },
    getData($state) {
      let url = ''
      if (this.formType === 'gradeform') {
        url = 'getGradeList'
      } else if (this.formType === 'teacherform') {
        url = 'getTeacherList'
      }
      request[url](this.page, this.row).then(({ value: { data } }) => {
        if (data.length) {
          this.page += 1;
          this.formList.push(...data);
          $state.loaded();
        } else {
          $state.complete();
        }
        this.$emit('stopPullDown');
      }).catch(err => { })
    },
    // 打开班级
    openGradeDetail(id) {
      openWin(gradeDetail, { id })
    },
    // 打开报名
    openJoinDetail(id) {
      openWin(teacherTrain, { id })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabbar-content {
  padding: 0 2rem 1rem;
  // box-sizing: border-box;
  // position: absolute;
  // width: calc(100% - 4rem);
  // top: 6rem;
  // bottom: 0;
  // overflow-y: scroll;
  font-size: 1.4rem;
  font-weight: bold;
  line-height: 2.35rem;
  letter-spacing: 0.07rem;
  color: #333333;
  .tabbar-item {
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem 1rem;
    margin-bottom: 1rem;
    .bar-top {
      // margin-bottom: 1rem;
      &,
      .left-info {
        display: flex;
        .first{
          font-size: 1.6rem;
          color: #222e46;
          font-weight: bold;
        }
        .second{
          color: #697181;
        }
      }
      align-items: center;
      justify-content: space-between;
      .left-info {
        flex-direction: column;
      }
    }
    .bar-btm {
      margin-top: 1rem;

      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      line-height: 1.8rem;
      letter-spacing: 0rem;
      color: #9ca8be;
    }
  }
  .state-style {
    padding: 1rem 0;
  }
}
</style>