<template>
  <div>
    <div class="picture" v-for="pic in picList">
      <img v-lazy="fullSrc(pic.url)" alt="pic.caption" class="pic">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Gallery',
    data () {
      return {
        aid: 0,
        picList: []
      }
    },
    methods: {
      fullSrc (path) {
        return 'http://www.wnacg.org' + path
      },
      getPicList (cb) {
        let _this = this
        this.$http.get('/api/picture', {
          params: {
            aid: this.aid
          }
        })
          .then(function (response) {
            if (response.data.code === 0) {
              _this.picList = response.data.data
            } else alert(response.data.msg)
            if (cb) cb()
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    mounted () {
      this.aid = this.$route.params.aid
      this.getPicList()
      document.onscroll = function () {
        console.log(document.body.scrollTop, document.body.scrollTop + document.body.clientHeight)
      }
    }
  }
</script>

<style scoped>
  image[lazy=loading] {
    width: 100%;
    max-width: 100%;
    margin: auto;
  }
  div.picture img {
    width: 100%;
  }
</style>
