<template>
  <div class="container">
    <div class="content">
      <div class="swiper">
        <swiper
          :indicator-dots="banner.indicatorDots"
          :vertical="banner.vertical"
          :autoplay="banner.autoplay"
          :interval="banner.interval"
          :duration="banner.duration"
        >
          <swiper-item v-for="(item, index) in banner.url" :key="index">
            <img :src="item" class="slide-image">
          </swiper-item>
        </swiper>
      </div>
      <div class="tabs">
        <van-tabs @change="onTabChange" color="#6416a6">
          <van-tab v-for="tab in tabs" :title="tab.title" :key="tab.id">
            <van-card
              custom-class="tab-content"
              v-for="(item, idx) in tab.contents"
              :key="idx"
              :title="item.title"
              :thumb="item.thumb"
              @click="toContent(item.id, tab.slug)"
            >
              <view slot="title">
                <div class="van-multi-ellipsis--l2">{{item.title}}</div>
              </view>
              <view slot="desc">
                <view class="van-multi-ellipsis--l3">{{item.desc}}</view>
              </view>
            </van-card>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_BANNER, GET_CONTENT_CAT } from "../../constants/api.js";
import { callApi } from "../../libs/api.js";
import { OPEN_ID } from "../../constants/storage.js";

export default {
  data() {
    return {
      banner: {
        url: [],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1000
      },
      tabActive: 0,
      tabs: []
    };
  },
  methods: {
    toContent(id, type) {
      wx.navigateTo({
        url: `/pages/content/main?id=${id}&type=${type}`
      });
    }
  },
  onShow() {
    var that = this;
    var openId = wx.getStorageSync(OPEN_ID);
    // 获取banner
    callApi(GET_BANNER, "GET", {
      type: 'home',
      openId: openId
    }, res => {
      this.banner.url = res.data;
    });
    var openId = wx.getStorageSync(OPEN_ID);
    // 获取内容分类\内容
    callApi(GET_CONTENT_CAT, "GET", {
      openId: openId
    }, res => {
      this.tabs = res.data;
    });
  }
};
</script>

<style scoped>
.swiper {
  width: 100%;
  margin: 0rpx;
}
.swiper swiper {
  height: 360rpx;
}
.slide-image {
  height: 100%;
  width: 100%;
}
</style>
