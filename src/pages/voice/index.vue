<template>
  <div class="container">
    <van-tabs animated :active="active" @change="onChange" color="#6416a6">
      <van-tab v-for="tab in tabs" :title="tab.title" :key="tab.id">
        <div class="cell" v-for="(item, idx) in tab.data" :key="idx">
          <span>{{item.title}}</span>
          <van-cell-group>
            <van-cell
              v-for="(section, i) in item.section"
              :key="section.id"
              :title="section.title"
              is-link
              :url="'/pages/voiceLearn/main?id='+section.id"
            />
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <van-toast id="van-toast"/>
  </div>
</template>

<script>
import Toast from "../../../static/vant/toast/toast";
import { callApi } from "../../libs/api.js";
import { VOICE_LIST } from "../../constants/api";
import { SELECT_VOICE } from "../../constants/storage.js";

export default {
  data() {
    return {
      active: 0,
      tabs: []
    };
  },
  methods: {
    getList() {
      Toast.loading({
        duration: 0,
        mask: true,
        message: "加载中..."
      });
      callApi(VOICE_LIST, "GET", {}, res => {
        Toast.clear();
        this.tabs = res.data;
      });
    },
    onChange(event) {
      wx.setStorageSync(SELECT_VOICE, event.mp.detail.index);
    },
    download(url, id) {
      // 跳转到播放页面
      wx.navigateTo({
        url: "/pages/voiceLearn/main?id=" + id
      });
    }
  },
  onShow() {
    this.getList();
    // 获取是否有缓存选择的tab
    var tab = wx.getStorageSync(SELECT_VOICE);
    if(tab){
      this.active = tab;
    }
  },
  created() {}
};
</script>

<style scoped>
.container {
  vertical-align: middle;
}
.cell span {
  font-size: 14px;
  padding-left: 15px;
  color: #455a64;
}
</style>
