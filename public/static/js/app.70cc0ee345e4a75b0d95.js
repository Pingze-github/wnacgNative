webpackJsonp([1],{"6LR+":function(t,i){},"8KlI":function(t,i){},NHnr:function(t,i,a){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e=a("7+uW"),n={render:function(){var t=this.$createElement,i=this._self._c||t;return i("div",{attrs:{id:"app"}},[i("router-view")],1)},staticRenderFns:[]},c=a("VU/8")({name:"app"},n,!1,function(t){a("6LR+")},null,null).exports,s=a("/ocq"),o={name:"Main",data:function(){return{allLoaded:!1,comicList:[],loading:!1,page:1,pagesize:6}},methods:{turnTo:function(t){this.$router.push({name:"Gallery",params:{aid:t}})},fullSrc:function(t){return"http://www.wnacg.org"+t},fullHref:function(t){return"/comic/"+t},timeFormat:function(t){return(t=new Date(t)).getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDay()},getComicList:function(t){var i=this;this.$http.get("/api/comic",{params:{page:this.page,pagesize:this.pagesize}}).then(function(a){0===a.data.code?i.comicList=i.comicList.concat(a.data.data):alert(a.data.msg),t&&t()}).catch(function(t){console.log(t)})},loadMore:function(){var t=this;this.loading=!0,this.page++,this.getComicList(function(){t.loading=!1})},loadBottom:function(){var t=this;this.loading=!0,this.page++,this.getComicList(function(){t.loading=!1}),this.$refs.loadmore.onBottomLoaded()}},mounted:function(){this.getComicList()}},r={render:function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",[a("mt-header",{attrs:{fixed:"",title:"Wnacg Native"}},[a("mt-button",{attrs:{slot:"right",icon:"more"},slot:"right"})],1),t._v(" "),a("div",{attrs:{id:"comics"}},[a("div",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:t.loadMore,expression:"loadMore"}],staticClass:"loading-container",attrs:{"infinite-scroll-disabled":"loading","infinite-scroll-distance":"50"}},t._l(t.comicList,function(i){return a("div",{staticClass:"comic",on:{click:function(a){t.turnTo(i.aid)}}},[a("div",{staticClass:"comic-left"},[a("img",{staticClass:"comic-cover",attrs:{alt:i.aid,src:t.fullSrc(i.coverPath)}})]),t._v(" "),a("div",{staticClass:"comic-right"},[a("div",{staticClass:"comic-title"},[t._v("\n            "+t._s(i.title)+"\n          ")]),t._v(" "),a("div",{staticClass:"comic-info"},[a("span",{staticClass:"comic-author"},[t._v("作者:\n              "),a("a",{attrs:{href:"/author/"+i.author}},[t._v(t._s(i.author))])]),t._v(" "),a("br"),t._v(" "),a("span",{staticClass:"comic-create-time"},[t._v("收录时间："+t._s(t.timeFormat(i.ctime)))]),t._v(" "),a("span",{staticClass:"comic-aid"},[t._v("编号：#"+t._s(i.aid))]),t._v(" "),a("span",{staticClass:"comic-page-num"},[t._v("页数："+t._s(i.pageNum))])])])])}))])],1)},staticRenderFns:[]},l=a("VU/8")(o,r,!1,function(t){a("8KlI")},"data-v-1650037d",null).exports,u={name:"Gallery",data:function(){return{aid:0,picList:[]}},methods:{fullSrc:function(t){return"http://www.wnacg.org"+t},getPicList:function(t){var i=this;this.$http.get("/api/picture",{params:{aid:this.aid}}).then(function(a){0===a.data.code?i.picList=a.data.data:alert(a.data.msg),t&&t()}).catch(function(t){console.log(t)})}},mounted:function(){this.aid=this.$route.params.aid,this.getPicList()}},d={render:function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",t._l(t.picList,function(i){return a("div",{staticClass:"picture"},[t._v("\n    正在获取\n    "),a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.fullSrc(i.url),expression:"fullSrc(pic.url)"}],staticClass:"pic",attrs:{alt:"pic.caption"}})])}))},staticRenderFns:[]},m=a("VU/8")(u,d,!1,function(t){a("bybn")},"data-v-e0d1cd70",null).exports;e.default.use(s.a);var p=new s.a({routes:[{path:"/",name:"Main",component:l},{path:"/gallery/:aid",name:"Gallery",component:m}]}),f=a("Au9i"),h=a.n(f),v=(a("d8/S"),a("mtWM")),g=a.n(v);e.default.prototype.$http=g.a,e.default.use(h.a),e.default.config.productionTip=!1,new e.default({el:"#app",router:p,template:"<App/>",components:{App:c}})},bybn:function(t,i){},"d8/S":function(t,i){}},["NHnr"]);
//# sourceMappingURL=app.70cc0ee345e4a75b0d95.js.map