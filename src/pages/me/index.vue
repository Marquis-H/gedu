<template>
  <div class="container">
    <div class="header">
      <div class="top">
        <van-row>
          <van-col span="5">
            <img class="avatar" :src="profile.avatar">
          </van-col>
          <van-col span="19">
            <div @click="toProfile">
              <p class="nickname">{{profile.nickname}}</p>
              <p class="des">
                查看个人信息
                <van-icon name="arrow" custom-style="vertical-align:middle;margin-top:-2px;"/>
              </p>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="static">
        <van-row>
          <van-col span="8">
            <div class="item">
              <p class="title">积分</p>
              <p class="num">{{profile.static.integral}}</p>
            </div>
          </van-col>
          <van-col span="8">
            <div class="item">
              <p class="title">打卡</p>
              <p class="num">{{profile.static.daka}}</p>
            </div>
          </van-col>
          <van-col span="8">
            <div class="item">
              <p class="title">单词</p>
              <p class="num">{{profile.static.word}}</p>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="service">
      <div class="title">我的服务</div>
      <div class="list">
        <van-row>
          <van-col span="6">
            <div class="item" @click="toPrize">
              <van-icon name="gift-o" size="40px" color="#6416a6"/>
              <p class="label">积分商城</p>
            </div>
          </van-col>
          <!-- <van-col span="6">
            <div class="item" @click="toFAQ">
              <van-icon name="question-o" size="40px" color="#6416a6"/>
              <p class="label">问题反馈</p>
            </div>
          </van-col>-->
          <van-col span="6">
            <div class="item" @click="toShare">
              <van-icon name="share" size="40px" color="#6416a6"/>
              <p class="label">邀请有奖</p>
            </div>
          </van-col>
          <van-col span="6">
            <div class="item" @click="showWordType = true" v-if="wordType">
              <van-icon name="notes-o" size="40px" color="#6416a6"/>
              <p class="label">单词类别</p>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="campus" v-if="tabs[0]">
      <van-card
        custom-class="tab-content"
        v-for="(item, idx) in tabs[0].contents"
        :key="idx"
        :title="item.title"
        :thumb="item.thumb"
      >
        <view slot="title" @click="toContent(item.id, tabs[0].slug)">
          <div class="van-multi-ellipsis--l2">{{item.title}}</div>
        </view>
        <view slot="desc" @click="toContent(item.id, tabs[0].slug)">
          <view class="van-multi-ellipsis--l3">{{item.desc}}</view>
        </view>
        <view slot="footer">
          <van-button size="large" type="primary" @click="call(item.phone)">联系电话</van-button>
        </view>
      </van-card>
    </div>
    <van-toast id="van-toast"/>
    <van-action-sheet @close="onClose" :show="showPhone">
      <van-cell-group>
        <van-cell
          :center="true"
          icon="phone-o"
          :title="item.name"
          :clickable="true"
          v-for="(item, index) in phone"
          :key="index"
          :value="item.campus"
          @click="onSelectPhone(item.name)"
        />
      </van-cell-group>
    </van-action-sheet>
    <van-dialog
      use-slot
      :closeOnClickOverlay="true"
      :show="showWordType"
      @confirm="confirmType()"
      @close="showWordType = false"
    >
      <van-radio-group :value="wordType" @change="onChange">
        <van-radio name="ielts">雅思</van-radio>
        <van-radio name="toefl">托福</van-radio>
        <van-radio name="four">四级</van-radio>
        <van-radio name="six">六级</van-radio>
        <van-radio name="gre">GRE</van-radio>
        <van-radio name="gmat">GMAT</van-radio>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
import Toast from "../../../static/vant/toast/toast";
import {
  GET_PROFILE,
  UPDATE_PROFILE,
  GET_CONTENT_CAT
} from "../../constants/api.js";
import { callApi } from "../../libs/api.js";
import { OPEN_ID } from "../../constants/storage.js";

export default {
  data() {
    return {
      profile: {
        avatar: "/static/images/user.png",
        nickname: "-",
        static: {
          integral: "-",
          daka: "-",
          word: "-"
        }
      },
      wordType: "",
      showWordType: false,
      tabs: {},
      showPhone: false,
      phone: []
    };
  },
  methods: {
    toProfile() {
      wx.navigateTo({
        url: "/pages/profile/main"
      });
    },
    toFAQ() {
      Toast("暂未开放");
    },
    toShare() {
      wx.navigateTo({
        url: "/pages/share/main"
      });
    },
    toPrize() {
      wx.navigateTo({
        url: "/pages/prize/main"
      });
    },
    toContent(id, type) {
      wx.navigateTo({
        url: `/pages/content/main?id=${id}&type=${type}`
      });
    },
    onChange(event) {
      this.wordType = event.mp.detail;
    },
    confirmType() {
      var wordType = this.wordType;
      // 保存用户选择的单词类别
      callApi(
        UPDATE_PROFILE,
        "POST",
        { type: "wordType", wordType: wordType },
        res => {
          this.showWordType = false;
          Toast(res.message);
        },
        error => {
          this.showWordType = false;
          Toast(res.message);
        }
      );
    },
    call(phone) {
      var data = [];
      phone.forEach((element, i) => {
        data.push({
          campus: element.title,
          name: element.phone
        });
      });
      this.phone = data;
      this.showPhone = true;
    },
    onSelectPhone(phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      });
    },
    onClose() {
      this.showPhone = false;
    }
  },
  onShow() {
    // 获取个人信息
    callApi(GET_PROFILE, "GET", {}, res => {
      this.profile = res.data;
      this.wordType = res.data.wordType;
    });
    var openId = wx.getStorageSync(OPEN_ID);
    // 获取内容分类\内容
    callApi(
      GET_CONTENT_CAT,
      "GET",
      {
        openId: openId
      },
      res => {
        this.tabs = res.data;
      }
    );
  },
  created() {}
};
</script>

<style>
.header {
  height: 28vh;
}
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
.avatar {
  width: 50px;
  height: 50px;
}
.van-icon {
  vertical-align: middle;
}
.static {
  background-color: #ffffff;
  padding: 12px 20px;
}
.static .title {
  font-size: 12px;
  color: #455a64;
}
.static .item {
  text-align: center;
}
.service {
  background-color: #ffffff;
  padding: 12px 20px;
  margin-bottom: 13px;
}
.campus {
  background-color: #ffffff;
}
.service .title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: #455a64;
}
.service .item {
  text-align: center;
}
.service .list {
  padding: 10px 0 0 0;
}
.service .item .label {
  font-size: 14px;
  color: #455a64;
}
.van-radio {
  margin: 8px;
}
.van-button--large {
  margin-top: 10px;
  height: 36px !important;
  line-height: 34px !important;
}
.van-popup--bottom {
  width: 100.3% !important;
}
</style>
