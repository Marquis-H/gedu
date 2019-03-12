<template>
  <div class="content">
    <div class="header">
      <div class="title">身份绑定</div>
      <div class="desc">我们需要一些信息来确认您的身份，若无法确定您的账号信息，请联系我们</div>
    </div>
    <div class="form">
      <div class="title">选择校区</div>
      <van-radio-group :value="campus" @change="onChangeCampus">
        <van-cell-group>
          <van-cell
            v-for="item in campusList"
            :title="item.label"
            :key="item.value"
            clickable
            :data-name="item.value"
          >
            <van-radio :name="item.value"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="title">输入相关信息</div>
      <van-cell-group>
        <van-field :value="phone" placeholder="请输入手机号" :border="false" @change="onChangePhone"/>
        <van-field
          :value="code"
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码"
          :border="false"
          use-button-slot
          @change="onChangeCode"
        >
          <van-button
            v-if="SMSTime == 0"
            slot="button"
            size="small"
            type="primary"
            @click="sendSMS()"
          >发送验证码</van-button>
          <van-button v-else slot="button" size="small" type="primary" disabled>已发送（{{SMSTime}}）</van-button>
        </van-field>
      </van-cell-group>
    </div>
    <div class="btn">
      <van-button size="large" @click="submit" class="bind">绑定</van-button>
    </div>
    <van-dialog id="van-dialog" @getuserinfo="getUserInfo"/>
    <van-toast id="van-toast"/>
  </div>
</template>

<script>
import Dialog from "../../../static/vant/dialog/dialog";
import Toast from "../../../static/vant/toast/toast";
import { setTimeout } from "timers";
import { BIND_REQUEST, GET_COMPUS, BIND } from "../../constants/api.js";
import { callApi } from "../../libs/api.js";
import { OPEN_ID } from "../../constants/storage.js";

export default {
  data() {
    return {
      campusList: [],
      campus: "1",
      phone: "",
      code: "",
      avatar: "",
      nickname: "",
      SMSTime: 0,
      inviteCode: ""
    };
  },
  onLoad(options) {
    var that = this;
    this.inviteCode = options.code ? options.code : null;
    wx.getUserInfo({
      success: function(response) {
        that.nickname = response.userInfo.nickName;
        that.avatar = response.userInfo.avatarUrl;
      },
      fail: function() {
        Dialog.alert({
          message: "获取用户信息",
          confirmButtonOpenType: "getUserInfo"
        });
      }
    });
    // 获取校区
    callApi(GET_COMPUS, "GET", {}, res => {
      this.campusList = res.data;
      this.campus = 1;
    });
  },
  created() {},
  methods: {
    getUserInfo(userInfo) {
      if (userInfo.target.errMsg == "getUserInfo:ok") {
        this.nickname = userInfo.target.userInfo.nickName;
        this.avatar = userInfo.target.userInfo.avatarUrl;
      } else {
        Dialog.alert({
          message: "获取用户信息",
          confirmButtonOpenType: "getUserInfo"
        });
      }
    },
    onChangeCampus(value) {
      this.campus = parseInt(value.mp.detail);
    },
    onChangePhone(value) {
      this.phone = value.mp.detail;
    },
    onChangeCode(value) {
      this.code = value.mp.detail;
    },
    // 发送验证码
    sendSMS() {
      // 检查手机号是否输入
      if (this.phone == "") {
        Toast("请输入手机号");
        return;
      }
      callApi(
        BIND_REQUEST,
        "POST",
        {
          campusId: this.campus,
          mobile: this.phone
        },
        res => {
          Toast(res.message);
          this.SMSTime = 60;
          this.countdown();
        },
        error => {
          Toast(error.message);
        }
      );
    },
    countdown() {
      let SMSTime = this.SMSTime;
      if (SMSTime == 0) {
        this.SMSTime = 0;
        return;
      }
      setTimeout(() => {
        this.SMSTime = SMSTime - 1;
        this.countdown();
      }, 1000);
    },
    submit() {
      if (this.phone == "" || this.code == "") {
        Toast("请验证手机号");
        return;
      }
      var openId = wx.getStorageSync(OPEN_ID);
      if (!openId) {
        Toast("无法绑定，请联系客服");
        return;
      }
      callApi(
        BIND,
        "POST",
        {
          campusId: this.campus,
          mobile: this.phone,
          code: this.code,
          avatar: this.avatar,
          nickname: this.nickname,
          openId: openId,
          inviteCode: this.inviteCode
        },
        res => {
          if (res.code == 0) {
            Dialog.alert({
              message: res.message
            }).then(() => {
              wx.reLaunch({
                url: "/pages/index/main"
              });
            });
          }
        },
        rep => {
          Toast(rep.message);
        }
      );
    }
  }
};
</script>

<style>
.header {
  padding: 45px 30px 0;
}
.header .title {
  display: inline-block;
  margin: 0 0 15px;
  user-select: none;
  font-size: 28px;
  font-weight: 400;
  font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}
.header .desc {
  font-size: 14px;
  color: #455a64;
  margin: 0 0 30px;
}
.form .title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: #455a64;
  padding: 20px 15px 15px;
}
.btn {
  padding: 40px 20px 40px;
}
.bind .van-button--large {
  background-color: #6416a6 !important;
  color: #ffffff !important;
}
</style>
