<template>
  <div class="container">
    <van-toast id="van-toast"/>
  </div>
</template>

<script>
import Toast from "../../../static/vant/toast/toast";

export default {
  data() {
    return {};
  },
  methods: {},
  onShow() {
    Toast({
      duration: 0,
      message: "暂未开放"
    });
  },
  created() {}
};
</script>

<style scoped>
.container {
  vertical-align: middle;
}
</style>
