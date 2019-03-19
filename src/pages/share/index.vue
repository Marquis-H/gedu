<template>
  <div class="container">
    <div class="top">
      <div class="back" :style="'padding-top:'+statusBarHeight+'px'" @click="backHome()">
        <van-icon name="home-o" size="25px" color="#fff"/>
      </div>
      <img :src="banner" class="banner">
    </div>
    <div class="content" v-if="isBind">
      <p class="label">分享邀请，获取积分</p>
      <van-button round type="danger" class="btn" open-type="share">邀请好友</van-button>
      <p class="tips">
        <van-icon name="question-o"/>
        <span>活动规则</span>
      </p>
    </div>
    <div class="content" v-else>
      <div class="item">
        <van-button round type="primary" class="btn" @click="backHome()">去首页</van-button>
      </div>
      <div class="item">
        <van-button round type="warning" class="btn" @click="toBind()">去绑定</van-button>
      </div>
    </div>
    <van-toast id="van-toast"/>
  </div>
</template>

<script>
import { GET_BANNER, UPDATE_INTEGRAL_SHARE } from "../../constants/api.js";
import { callApi } from "../../libs/api.js";
import { OPEN_ID } from "../../constants/storage.js";
import Toast from "../../../static/vant/toast/toast";

export default {
  data() {
    return {
      banner: "http://iph.href.lu/375x480",
      shareBanner: "http://iph.href.lu/150x120",
      isBind: true,
      code: "",
      statusBarHeight: 20
    };
  },
  onLoad(options) {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.statusBarHeight = res.statusBarHeight + 10;
      }
    });
    // 分享数据
    const code = options.code;
    const openId = wx.getStorageSync(OPEN_ID);
    Toast.loading({
      duration: 0,
      mask: true,
      message: "加载中..."
    });
    // 判断
    callApi(
      UPDATE_INTEGRAL_SHARE,
      "post",
      { code: code, openId: openId },
      res => {
        this.code = res.data.code;
        this.isBind = res.data.isBind;
        // 获取banner
        callApi(
          GET_BANNER,
          "GET",
          {
            type: "share",
            openId: openId,
            code: this.code
          },
          res => {
            this.banner = res.data[0] ? res.data[0] : "http://iph.href.lu/375x480";
          }
        );
        Toast.clear();
      }
    );
  },
  onReady() {
    wx.hideShareMenu(); // 隐藏分享按钮
    var that = this;
    var openId = wx.getStorageSync(OPEN_ID);
    // 获取share banner
    callApi(
      GET_BANNER,
      "GET",
      {
        type: "share_m",
        openId: openId
      },
      res => {
        this.shareBanner = res.data[0] ? res.data[0] : "http://iph.href.lu/375x480";
      }
    );
  },
  onShareAppMessage(res) {
    return {
      title: '单词学习利器',
      path: "/pages/share/main?code=" + this.code,
      imageUrl: this.shareBanner
    };
  },
  methods: {
    backHome() {
      wx.reLaunch({
        url: "/pages/index/main"
      });
    },
    toBind() {
      wx.reLaunch({
        url: "/pages/bind/main?code=" + this.code
      });
    }
  },

  created() {}
};
</script>

<style>
.top {
  height: 70vh;
}
.banner {
  height: 100%;
  width: 100%;
}
.content {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 10px;
}
.content .item {
  padding: 10px 0;
}
.label {
  margin: 20px 0;
  font-size: 16px;
}
.btn {
  margin: 20px 0;
  width: 80%;
}
.van-button--normal {
  width: 50%;
}
.tips {
  margin: 30px 0;
  font-size: 12px;
}
.van-icon {
  vertical-align: middle;
  margin-top: -2px;
}
.back {
  box-sizing: border-box;
  display: flex;
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 20px;
}
</style>
