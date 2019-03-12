<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="label">Hi</div>
        <div class="tips">从今天起，打卡记录进步</div>
      </div>
      <div class="static">
        <van-row>
          <van-col span="6">
            <div class="item">
              <p class="num">{{info.newWord}}</p>
              <p class="label">新单词</p>
            </div>
          </van-col>
          <van-col span="6">
            <div class="item">
              <p class="num">{{info.nowWord}}</p>
              <p class="label">今日单词</p>
            </div>
          </van-col>
          <van-col span="6">
            <div class="item">
              <p class="num">{{info.surplusWord}}</p>
              <p class="label">剩余单词</p>
            </div>
          </van-col>
          <van-col span="6">
            <div class="item">
              <p class="num">{{info.meWord}}</p>
              <p class="label">我的单词</p>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="btn" @click="toLearn">
        <van-button round>开始学习</van-button>
      </div>
    </div>
    <van-toast id="van-toast"/>
    <van-dialog use-slot async-close :show="isRecord == false" @confirm="confirmType()">
      <van-radio-group :value="type" @change="onChange">
        <van-radio name="ielts">雅思</van-radio>
        <van-radio name="toefl">托福</van-radio>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
import { callApi } from "../../libs/api.js";
import { WORD_INFO, CREATE_WORD_USER } from "../../constants/api";
import Toast from "../../../static/vant/toast/toast";

export default {
  data() {
    return {
      info: {
        newWord: "-",
        nowWord: "-",
        surplusWord: "-",
        meWord: "-"
      },
      isRecord: true,
      type: "ielts"
    };
  },
  methods: {
    getWordInfo() {
      Toast.loading({
        duration: 0,
        mask: true,
        message: "加载中..."
      });
      callApi(WORD_INFO, "GET", {}, res => {
        Toast.clear();
        // 判断是否有选择单词类型
        this.isRecord = res.data.isRecord;
        this.info = res.data.info;
      });
    },
    toLearn() {
      wx.navigateTo({
        url: "/pages/wordLearn/main"
      });
    },
    onChange(e) {
      this.type = e.mp.detail;
    },
    confirmType() {
      // 选择了单词类型
      var type = this.type;
      callApi(
        CREATE_WORD_USER,
        "post",
        { type: type },
        res => {
          this.info = res.data.info;
          this.isRecord = res.data.isRecord;
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  onShow: function() {
    this.getWordInfo();
  },
  created() {}
};
</script>

<style>
.content {
  background-color: #ffffff;
  text-align: center;
  padding: 30px 10px 20px 10px;
}
.top .label {
  font-size: 42px;
  color: #6416a6;
  font-weight: 900;
}
.top .tips {
  font-size: 16px;
  color: #455a64;
}
.top {
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.static {
  padding: 20px 10px 10px 10px;
  color: #455a64;
}
.static .label {
  font-size: 12px;
}
.static .num {
  font-size: 22px;
  font-weight: bolder;
}
.btn {
  margin: 20px 0 10px 0;
}
.van-button--normal {
  width: 50%;
  background-color: #6416a6 !important;
  color: #fff !important;
}
.van-radio {
  margin: 8px;
}
</style>
