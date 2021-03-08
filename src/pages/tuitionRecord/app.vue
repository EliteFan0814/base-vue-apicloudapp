<template>
  <div class="container">
    <div class="pub-header">
      <HeaderBetween leftType leftText="缴纳记录"></HeaderBetween>
    </div>
    <div class="content">
      <div class="form-item top-search ">
        <div class="search-wrap">
          <div class="left">审核状态</div>
          <div class="right">
            <BaseDropdown :option="option" :defaultValue="defaultValue" :overlay="false" class="drop-style"
              @change="handleSelect">
            </BaseDropdown>
          </div>
        </div>
      </div>
      <div class="holder"></div>
      <div v-if="recordList.length" class="list-wrap">
        <div v-for="(item,index) in recordList" :key="index" class="list-item">
          <div class="top item">
            <span class="name">{{item.studentName}}</span>
            <span v-if="item.auditStatus === 0" class="state">{{item.auditStatusStr}}</span>
            <span v-if="item.auditStatus === 10" class="success">{{item.auditStatusStr}}</span>
            <span v-if="item.auditStatus === -10" class="failed">{{item.auditStatusStr}}</span>
          </div>
          <div class="bottom item">
            <span class="text">课时：{{item.totalClassHours}}</span>
            <span class="text">费用：{{item.totalPayMoney}} 元</span>
          </div>
          <div v-if="item.auditStatus === -10" class="bottom item">
            <span class="text">驳回原因：{{item.remark || '暂无'}}</span>
            <span class="text"></span>
          </div>
        </div>
      </div>
      <infinite-loading @infinite="getData" :identifier="infiniteId" infinite-scroll-distance="10" direction="bottom">
        <div slot="spinner" class="whiteBg">读取中...</div>
        <div slot="no-more" class="whiteBg">已加载全部</div>
        <div slot="no-results" class="whiteBg">
          <noList text="暂无记录"></noList>
        </div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import HeaderBetween from '@/components/headerBetween'
import { tuitionSearch } from '@/common/router'
import { openWin, openFrame } from '@/common/openPage.js'
import request from '@/api/tuition'
import BaseDropdown from '@/components/BaseDropdown'
import noList from '@/components/noList'

export default {
  components: {
    HeaderBetween,
    BaseDropdown,
    noList
  },
  data() {
    return {
      defaultValue: undefined,
      page: 1,
      row: 10,
      infiniteId: +new Date(),
      recordList: [],
      tabType: 'all',
      option: []
    }
  },
  created() {
    // this.getTodoInfo()
  },
  mounted() {
    api.addEventListener(
      {
        name: 'changeTodoNum'
      },
      (res, err) => {
        this.getTodoInfo()
      }
    )
  },
  methods: {
    hanldeRightClick() {},
    handleSelect(item) {
      console.log(item)
      this.tabType = item
      this.page = 1
      this.recordList = []
      this.infiniteId += 1
    },
    // getRecordList() {
    //   request.payRecord
    // },
    getData($state) {
      request
        .payRecord(this.page, this.row, this.tabType === 'all' ? '' : this.tabType)
        .then(({ exValue: { OrgProductAuditStatusObj }, value: { data } }) => {
          let tempObj = [{ text: '全部', value: 'all' }]
          OrgProductAuditStatusObj.map((item) => {
            item.text = item.name
            tempObj.push(item)
          })
          this.option = tempObj
          if (this.page === 1) {
            // this.tabType = this.option[0].value
            this.defaultValue = this.option[0].value
          }
          if (data.length) {
            this.page += 1
            this.recordList.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
          // this.$emit('stopPullDown')
        })
        .catch((err) => {})
    }
    // handleOpen(url) {
    //   if (url) {
    //     openWin(url, { type: 'MakeUp' })
    //   } else {
    //     this.$toast('暂未开通，敬请期待！')
    //   }
    // },
    // 获取代办
    // getTodoInfo() {
    //   request
    //     .getTodoInfo()
    //     .then((res) => {
    //       this.benchList[1].todoNumber = res.value.studentLeave
    //     })
    //     .catch((err) => {})
    // }
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-family: PingFang-SC-Bold;
  background-color: #f5f5f5;
  padding: 0;
  .pub-header {
    .header-wrap {
      background-color: #fff;
      padding: 1.75rem 2rem;
    }
  }
  .content {
    // border: 1px solid red;
    background-color: #f5f5f5;
    .form-item {
      position: fixed;
      box-sizing: border-box;
      width: 100%;
      top: 60px;
      padding: 1rem;
      background-color: #f5f5f5;
      margin-bottom: 1rem;
      border-radius: 1rem;
      overflow: hidden;
      .search-wrap {
        box-shadow: 0rem 0.06rem 0.63rem 0rem rgba(67, 133, 255, 0.2);
        border-radius: 0.31rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
      }
    }
    .holder {
      height: 6rem;
    }
    .top-search {
      font-size: 1.5rem;
      .drop-style {
        box-sizing: border-box;
        ::v-deep .van-dropdown-item {
          left: 50%;
          transform: translateX(-50%);
          width: calc(100vw - 2rem);
        }
      }
    }
    .list-wrap {
      padding: 1rem;
      .list-item {
        background-color: #fff;
        border-radius: 1rem;
        overflow: hidden;
        padding: 1rem;
        font-size: 1.5rem;
        &:nth-child(2n) {
          background-color: #f5f5f5;
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .text {
            color: #989fad;
          }
        }
        .top {
          margin-bottom: 1rem;
          .name {
            font-weight: bolder;
            color: #697181;
          }
          .state {
            color: #4385ff;
          }
          .success {
            color: #697181;
          }
          .failed {
            color: #ff5c5c;
          }
        }
      }
    }
  }
}
</style>