!function(t){function e(e){for(var n,r,o=e[0],l=e[1],c=e[2],f=0,d=[];f<o.length;f++)r=o[f],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&d.push(i[r][0]),i[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(t[n]=l[n]);for(u&&u(e);d.length;)d.shift()();return s.push.apply(s,c||[]),a()}function a(){for(var t,e=0;e<s.length;e++){for(var a=s[e],n=!0,o=1;o<a.length;o++){var l=a[o];0!==i[l]&&(n=!1)}n&&(s.splice(e--,1),t=r(r.s=a[0]))}return t}var n={},i={27:0},s=[];function r(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=t,r.c=n,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(a,n,function(e){return t[e]}.bind(null,n));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var o=window.webpackJsonp=window.webpackJsonp||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var u=l;s.push([25,1,0]),a()}({25:function(t,e,a){t.exports=a("582e")},"582e":function(t,e,a){"use strict";a.r(e),a("cadf"),a("551c"),a("f751"),a("097d");var n=a("22b4"),i=a("b681"),s=a("82ea"),r=a("49e5"),o={components:{HeaderBetween:i.a,BaseButton:s.a},data:function(){return{id:api.pageParam.data.id,callNum:void 0,jobsDetail:{},bannerList:[]}},created:function(){this.getJobDetail(),this.getCallInfo()},methods:{getJobDetail:function(){var t=this;r.b.getJobsDetail(this.id).then((function(e){t.jobsDetail=e.value,t.bannerList=e.value.hostPics}))},getCallInfo:function(){var t=this;r.b.callForJob().then((function(e){t.callNum=e.value.value}))},handleCall:function(t){api.call({type:"tel_prompt",number:t})}}},l=(a("a58e"),a("2877")),c=Object(l.a)(o,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container"},[a("HeaderBetween",{attrs:{leftText:"艺企淘",leftType:"",color:"#fff",bgColor:"transparent",useHeight:!1}}),a("div",{staticClass:"holder-block"}),a("div",{staticClass:"org-info"},[a("div",{staticClass:"org-pic"},[a("van-swipe",{staticClass:"my-swipe",attrs:{autoplay:3e3,"indicator-color":"white"}},t._l(t.bannerList,(function(t,e){return a("van-swipe-item",{key:e},[a("img",{staticClass:"img-style",attrs:{src:t,alt:""}})])})),1)],1),a("div",{staticClass:"org-text"},[a("div",{staticClass:"org-name"},[a("img",{attrs:{src:t.jobsDetail.orgLogoHost,alt:""}}),a("div",{staticClass:"name-text"},[a("span",[t._v(t._s(t.jobsDetail.orgName))]),a("span",[t._v(t._s(t.jobsDetail.orgMobile))])])]),a("div",{staticClass:"org-address"},[t._v("\n        地址："+t._s(t.jobsDetail.orgAddress)+"\n      ")])])]),a("div",{staticClass:"job-content-wrap"},[a("div",{staticClass:"title"},[t._v(t._s(t.jobsDetail.name))]),a("div",{staticClass:"content-item"},[a("div",{staticClass:"item-title"},[t._v("岗位职责")]),a("div",{staticClass:"item-detail"},t._l(t.jobsDetail.dutyArray,(function(e,n){return a("div",{key:n,staticClass:"single-item"},[t._v(t._s(e))])})),0)]),a("div",{staticClass:"content-item"},[a("div",{staticClass:"item-title"},[t._v("任职要求")]),a("div",{staticClass:"item-detail"},t._l(t.jobsDetail.jobRequirementsArray,(function(e,n){return a("div",{key:n,staticClass:"mark"},[t._v(t._s(n+1)+"."+t._s(e)+"\n        ")])})),0)])]),a("div",{staticClass:"btm-btn"},[a("BaseButton",{staticClass:"btn-style",attrs:{name:"联系应聘"},on:{click:function(e){return t.handleCall(t.callNum)}}})],1)],1)}),[],!1,null,"9f980a00",null).exports;new n.a({el:"#app",render:function(t){return t(c)}})},"7ca4":function(t,e,a){},a58e:function(t,e,a){"use strict";var n=a("7ca4");a.n(n).a}});