!function(e){function t(t){for(var o,i,s=t[0],c=t[1],u=t[2],f=0,h=[];f<s.length;f++)i=s[f],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&h.push(a[i][0]),a[i]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);for(l&&l(t);h.length;)h.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,s=1;s<n.length;s++){var c=n[s];0!==a[c]&&(o=!1)}o&&(r.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},a={23:0},r=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var s=window.webpackJsonp=window.webpackJsonp||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var l=c;r.push([21,1,0]),n()}({21:function(e,t,n){e.exports=n("e548")},"44ab":function(e,t,n){},"808c":function(e,t,n){"use strict";var o=n("44ab");n.n(o).a},e548:function(e,t,n){"use strict";n.r(t),n("cadf"),n("551c"),n("f751"),n("097d");var o=n("22b4"),a=(n("96cf"),n("1da1")),r=(n("7f7f"),n("b681")),i=n("4505"),s=n("5780"),c=n("49e5"),u={components:{headerBetween:r.a},data:function(){var e=api.pageParam.data;return{name:e.name,header:e.header,photo:e.photo,hostHeader:e.hostHeader,mobile:e.mobile,studentFindPwd:s.x,changePwd:s.d,studentCheckPhone:s.w,show:!1}},created:function(){},methods:{upload:function(){var e=Object(a.a)(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.$checkSystemAccess("photos","相册");case 2:if(!e.sent){e.next=12;break}return e.next=6,this.$getPic();case 6:return t=e.sent,e.next=9,this.$fileUpload(t.data);case 9:(n=e.sent).success&&(this.photo=n.pathList[0],this.hostHeader=n.hostPath[0],this.changeInfo("photo"));case 12:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),showName:function(){this.show=!0},close:function(){this.show=!1},submit:function(){var e=this.name;this.photo,e?this.changeInfo("name"):this.$toast.fail("请输入名字")},changeInfo:function(e){var t={};t[e]=this[e],Object(c.a)(t).then((function(e){e.success&&(api.sendEvent({name:"changeInfo"}),api.toast({msg:"修改成功"}))}))},openWin:function(e){Object(i.b)(e,{role:"student",mobile:this.mobile})},quit:function(){this.$dialog.confirm({title:"提示",message:"是否要退出登录"}).then((function(){$api.clearStorage(),api.closeWin(),api.sendEvent({name:"quit"})})).catch((function(){}))}}},l=(n("808c"),n("2877")),f=Object(l.a)(u,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container"},[n("headerBetween",{staticClass:"headerBetween",attrs:{leftText:"修改信息",leftType:""}}),n("div",{staticClass:"content"},[n("van-cell",{attrs:{center:"",title:"头像","is-link":""},on:{click:e.upload},scopedSlots:e._u([{key:"right-icon",fn:function(){return[n("img",{staticClass:"image student-img",attrs:{src:e.hostHeader,alt:""}})]},proxy:!0}])}),n("van-cell",{attrs:{title:"名字",value:e.name,"is-link":""},on:{click:e.showName}}),n("van-dialog",{attrs:{"use-slot":"",title:"修改名字","show-cancel-button":""},on:{confirm:e.submit,close:e.close},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],staticClass:"input-name",attrs:{type:"text",placeholder:"请输入昵称"},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}})]),n("van-cell",{attrs:{center:"",title:"修改密码","is-link":""},on:{click:function(t){return e.openWin(e.changePwd)}}}),n("van-cell",{attrs:{center:"",title:"修改手机号","is-link":""},on:{click:function(t){return e.openWin(e.studentCheckPhone)}}}),n("div",{staticClass:"submit",on:{click:e.quit}},[e._v("退出登录")])],1)],1)}),[],!1,null,"141da078",null).exports;new o.a({el:"#app",render:function(e){return e(f)}})}});