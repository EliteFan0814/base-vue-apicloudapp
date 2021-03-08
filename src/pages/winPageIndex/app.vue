<template>
  <div class="container">
    <!-- <div v-if="isGetting" class="is-getting">
      正在获取用户信息
    </div> -->
    <div v-if="!isGetting">
      <div v-if="isLogin">
        <!-- 老师角色的tabbar -->
        <van-tabbar v-if="role == 1" v-model="active">
          <van-tabbar-item v-for="(item, index ) in menuList" :badge="item.todoNumber?item.todoNumber:''" :key="index">
            <span>{{item.title}}</span>
            <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal">
          </van-tabbar-item>
        </van-tabbar>
        <!-- 学员角色的tabbar -->
        <van-tabbar v-else v-model="active">
          <van-tabbar-item v-for="(item, index ) in menuListStudent" :key="index">
            <span>{{item.title}}</span>
            <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal">
          </van-tabbar-item>
        </van-tabbar>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrlName, MyGlobal } from '@/common/util.js'
import {
  index,
  workbench,
  task,
  personal,
  studentIndex,
  studentPersonal,
  studentSchool,
  login
} from '@/common/router.js'
import { openWin } from '@/common/openPage.js'
import { checkPermision } from '@/common/checkPermision.js'
import { isBoolean } from 'util'
import request from '@/api/index'

export default {
  data() {
    return {
      isGetting: true,
      isLogin: undefined,
      // db_user: {},
      // db_key: 'user',
      role: undefined,
      todoNumber: undefined,
      active: 0,
      nowActiveIndex: 0,
      params: {}, //tab切换传递的page参数,每次使用后会清空
      // 学员端
      menuListStudent: [
        {
          title: '首页',
          active: require('@/static/image/menu/index-active.png'),
          normal: require('@/static/image/menu/index.png'),
          router: studentIndex
        },
        {
          title: '艺企淘学院',
          active: require('@/static/image/menu/school-active.png'),
          normal: require('@/static/image/menu/school.png'),
          router: studentSchool
        },
        {
          title: '我的',
          active: require('@/static/image/menu/personal-active.png'),
          normal: require('@/static/image/menu/personal.png'),
          router: studentPersonal
        }
      ],
      framesStudent: [
        {
          name: getUrlName(studentIndex),
          url: studentIndex,
          type: 'frames',
          reload: false
        },
        {
          name: getUrlName(studentSchool),
          url: studentSchool,
          type: 'frames',
          reload: false
        },
        {
          name: getUrlName(studentPersonal),
          url: studentPersonal,
          type: 'frames',
          reload: true
        }
      ],
      // 老师端
      menuList: [
        {
          title: '首页',
          active: require('@/static/image/menu/index-active.png'),
          normal: require('@/static/image/menu/index.png'),
          router: index
        },
        {
          title: '工作台',
          active: require('@/static/image/menu/workbench-active.png'),
          normal: require('@/static/image/menu/workbench.png'),
          router: workbench,
          todoNumber: undefined
        },
        {
          title: '作业',
          active: require('@/static/image/menu/task-active.png'),
          normal: require('@/static/image/menu/task.png'),
          router: task,
          todoNumber: undefined
        },
        {
          title: '我的',
          active: require('@/static/image/menu/personal-active.png'),
          normal: require('@/static/image/menu/personal.png'),
          router: personal
        }
      ],
      frames: [
        {
          name: getUrlName(index),
          url: index,
          type: 'frames',
          reload: false
        },
        {
          name: getUrlName(workbench),
          url: workbench,
          type: 'frames',
          reload: false
        },
        {
          name: getUrlName(task),
          url: task,
          type: 'frames',
          reload: false
        },
        {
          name: getUrlName(personal),
          url: personal,
          type: 'frames',
          reload: true
        }
      ],
      loginFrame: {
        name: getUrlName(login),
        url: login,
        type: 'frames'
      }
    }
  },
  watch: {
    active(val) {
      let useParams = { ...this.params }
      this.params = {}
      this.changeFrame(val, useParams)
    }
  },
  created() {
    this.role = Number($api.getStorage('roleValue'))
    this.$checkSystemAccess('photos', '相册', '应用需要访问您的相册才能正常使用')
    this.checkLogin()
  },
  mounted() {
    const that = this
    api.addEventListener(
      {
        name: 'viewappear'
      },
      function () {
        that.role = Number($api.getStorage('roleValue'))
      }
    )
    // 监听小红点数据改变
    api.addEventListener(
      {
        name: 'changeTodoNum'
      },
      function () {
        that.getTodoInfo()
      }
    )
    // 监听到登录或注册后提示登录成功
    api.addEventListener(
      {
        name: 'loginSuccess'
      },
      (res, err) => {
        that.role = Number($api.getStorage('roleValue'))
        this.active = 0
        that.checkLogin()
        api.toast({
          msg: res.value.msg
        })
      }
    )
    // 监听退出登录
    api.addEventListener({ name: 'quit' }, (res, err) => {
      that.frames.map((item) => {
        api.closeFrame({ name: item.name })
      })
      that.framesStudent.map((item) => {
        api.closeFrame({ name: item.name })
      })
      // this.nowActiveIndex = res.value.index
      that.checkLogin()
    })
    // 监听 页面上的 tabbar 点击
    api.addEventListener(
      {
        name: 'ClickTabbarInPage'
      },
      (res, err) => {
        that.active = res.value.index
      }
    )
  },
  methods: {
    // 检查是否登录
    checkLogin(index = 0) {
      const loginInfo = $api.getStorage('user') || {}
      if (loginInfo && loginInfo.mytoken && loginInfo.islogin) {
        this.isGetting = false
        //token没过期处于正常登录状态，则打开 tabbar 的首页
        this.isLogin = true
        api.closeFrame({
          name: this.loginFrame.name
        })
        this.changeFrame(index)
        this.getTodoInfo()
      } else {
        this.openLoginFrame()
        this.isGetting = true
        this.isLogin = false
      }
    },
    // 打开登录的frame
    openLoginFrame() {
      api.openFrame({
        name: this.loginFrame.name,
        url: this.loginFrame.url,
        reload: this.loginFrame.reload,
        bgColor: '#fff',
        rect: {
          x: 0,
          y: 0,
          w: api.winWidth,
          h: api.winHeight
        }
      })
    },
    // 点击tab切换 frame
    changeFrame(index, datas = {}) {
      let temp = ''
      if (this.role == 1) {
        temp = 'frames'
      } else {
        temp = 'framesStudent'
      }
      if (this[temp][index].eventName) {
        api.sendEvent({
          name: this[temp][index].eventName,
          extra: {}
        })
      }
      api.openFrame({
        name: this[temp][index].name,
        url: this[temp][index].url,
        reload: this[temp][index].reload,
        pageParam: datas,
        rect: {
          x: 0,
          y: 0,
          w: api.winWidth,
          h: api.winHeight - (50 + Number(api.safeArea.bottom))
        }
      })
    },
    // 获取代办
    getTodoInfo() {
      if (this.role) {
        request
          .getTodoInfo()
          .then((res) => {
            this.menuList[1].todoNumber = res.value.studentLeave
            this.menuList[2].todoNumber = res.value.assignment
          })
          .catch((err) => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.xxx {
  border: 1px solid red;
  padding-bottom: 10px;
}
</style>

