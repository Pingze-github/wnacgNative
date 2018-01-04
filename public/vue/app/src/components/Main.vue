<template>
  <div>
    <mt-header fixed title="Wnacg Native">
      <!--<router-link to="/" slot="left">-->
        <!--<mt-button icon="back"></mt-button>-->
      <!--</router-link>-->
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <div id="comics">
      <!--<mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">-->

      <!--</mt-loadmore>-->
      <div
        class="loading-container"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50">
        <div class="comic" v-for="comic in comicList" v-on:click="turnTo(comic.aid)">
          <div class="comic-left">
            <img class="comic-cover" :alt="comic.aid" :src="fullSrc(comic.coverPath)">
          </div>
          <div class="comic-right">
            <div class="comic-title">
              {{ comic.title }}
            </div>
            <div class="comic-info">
              <span class="comic-author">作者:
                <a :href="'/author/' + comic.author">{{ comic.author }}</a>
              </span>
              <br>
              <span class="comic-create-time">收录时间：{{ timeFormat(comic.ctime) }}</span>
              <span class="comic-aid">编号：#{{ comic.aid }}</span>
              <span class="comic-page-num">页数：{{ comic.pageNum }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data () {
      return {
        allLoaded: false,
        comicList: [],
        loading: false,
        page: 1,
        pagesize: 6
      }
    },
    methods: {
      turnTo (aid) {
        this.$router.push({name: 'Gallery', params: {aid: aid}})
      },
      fullSrc (path) {
        return 'http://www.wnacg.org' + path
      },
      fullHref (aid) {
        return '/comic/' + aid
      },
      timeFormat (date) {
        date = new Date(date)
        return date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate()
      },
      getComicList (cb) {
        let _this = this
        this.$http.get('/api/comic', {
          params: {
            page: this.page,
            pagesize: this.pagesize
          }
        })
          .then(function (response) {
            if (response.data.code === 0) {
              _this.comicList = _this.comicList.concat(response.data.data)
            } else alert(response.data.msg)
            if (cb) cb()
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      loadMore () {
        this.loading = true
        this.page ++
        this.getComicList(() => {
          this.loading = false
        })
      },
      loadBottom () {
        this.loading = true
        this.page ++
        this.getComicList(() => {
          this.loading = false
        })
        this.$refs.loadmore.onBottomLoaded()
      }
    },
    mounted () {
      this.getComicList()
    }
  }
</script>

<style scoped>
.loading-container{
  overflow: visible;
}
.comic {
  width: 100%;
  min-height: 120px;
  background: #F2F6FC;
  margin-top: 3px;
  font-size: 13px;
}
.comic-left{
  float: left;
  width: 80px;
  padding-top: 10px;
  padding-left: 8px;
}
.comic-cover {
  width: 75px;
  height: 100px;
}
.comic-right {
  margin-left: 80px;
  padding: 8px 0 0 10px;
  text-align: left;
}
.comic-info {
  margin-top: 5px;
  overflow: hidden;
}
.comic-info span {
  float: left;
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
