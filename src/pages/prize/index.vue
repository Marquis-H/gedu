<template>
  <div class="container">
    <div class="header">
      <div class="top">
        <van-row>
          <van-col span="20">
            <div @click="toProfile">
              <p class="nickname">{{profile.nickname}}</p>
              <p class="des">可兑换积分：{{profile.static.integral}}</p>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="prize" v-for="(value, index) in prize" :key="index">
      <div class="title">{{index}}</div>
      <div class="list">
        <van-row>
          <van-col span="6" v-for="(item, idx) in value" :key="idx">
            <div class="item">
              <img :src="item.photo">
              <p class="label">{{item.title}}</p>
              <p class="num">{{item.num}}积分</p>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_PRIZE_LIST, GET_PROFILE } from "../../constants/api.js";
import { callApi } from "../../libs/api.js";
import { OPEN_ID } from "../../constants/storage.js";

export default {
  data() {
    return {
      prize: [],
      profile: {
        nickname: "-",
        static: {
          integral: "-"
        }
      }
    };
  },
  methods: {},
  onReady() {
    var openId = wx.getStorageSync(OPEN_ID);
    // 获取个人信息
    callApi(GET_PROFILE, "get", {}, res => {
      this.profile = res.data;
    });
    // 获取prize list
    callApi(GET_PRIZE_LIST, "get", {
      openId: openId
    }, res => {
      this.prize = res.data;
    });
  },
  created() {}
};
</script>

<style>
.top {
  background-color: #6416a6;
}
.header .top {
  padding: 10px 20px;
}
.top p {
  color: #ffffff;
}
.top .nickname {
  padding-top: 3px;
  font-size: 15px;
}
.top .des {
  padding-top: 3px;
  font-size: 12px;
}
.prize {
  background-color: #ffffff;
  padding: 12px 20px;
  margin: 10px 0;
}
.prize .title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: #455a64;
}
.prize .item {
  text-align: center;
  margin: 5px 0;
}
.prize .item img {
  width: 60px;
  height: 60px;
}
.prize .list {
  padding: 10px 0 0 0;
}
.prize .item .label {
  font-size: 14px;
  color: #455a64;
}
.prize .item .num {
  font-size: 12px;
  color: #6416a6;
}
</style>
