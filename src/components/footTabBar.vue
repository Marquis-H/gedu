<template>
  <div class="foot">
    <van-tabbar :active="index" @change="onChange">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="completed">单词</van-tabbar-item>
      <van-tabbar-item icon="volume-o">音频</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: String,
      default: "0"
    }
  },
  methods: {
    onChange(event) {
      console.log(event.mp.detail);
    }
  }
};
</script>

<style>
</style>
