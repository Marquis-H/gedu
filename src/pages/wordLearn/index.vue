<template>
  <div class="container" v-if="isEnd == 0">
    <scroll-view scroll-y style="height: 88vh;">
      <div class="content">
        <div class="slider">
          <van-slider :value="info.currentValue" use-button-slot disabled>
            <view class="custom-button" slot="button">{{ info.currentValue }}</view>
          </van-slider>
        </div>
        <div class="word">
          <van-row>
            <van-col span="20">
              <p class="label">
                {{info.word}}
                <span>{{info.symbol}}</span>
              </p>
            </van-col>
            <van-col span="4">
              <div class="voice">
                <van-icon v-if="isPlay" name="volume" size="20px" color="#6416a6"/>
                <van-icon
                  v-else
                  name="play"
                  size="20px"
                  color="#6416a6"
                  @click="handleVoice(info.voice)"
                />
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="tips" v-if="step == 2">
          <div class="translation">{{info.translation}}</div>
          <div class="annotation">
            <p class="label">注解</p>
            <div class="content">{{info.annotation}}</div>
          </div>
          <div class="annotation">
            <p class="label">变形</p>
            <div class="content">{{info.exchanges}}</div>
          </div>
        </div>
        <div class="tips" v-if="step == 3">
          <div class="annotation">
            <div class="content color">{{info.exchanges}}</div>
          </div>
        </div>
        <div class="tips" v-if="step == 4">
          <div class="annotation">
            <div class="content">{{info.exchanges}}</div>
          </div>
          <div class="annotation">
            <div class="content color">{{info.translation}}</div>
          </div>
        </div>
      </div>
      <van-toast id="van-toast"/>
    </scroll-view>
    <div class="foot">
      <van-cell-group v-if="step == 1">
        <van-cell title="认识" @click="toStep(2, 'mark')"></van-cell>
        <van-cell title="不认识" @click="toStep(3)"></van-cell>
      </van-cell-group>
      <van-cell-group v-else-if="step == 3">
        <van-cell title="想起来了" @click="toStep(2)"></van-cell>
        <van-cell title="没想起来" @click="toStep(4)"></van-cell>
      </van-cell-group>
      <div class="btn" v-else-if="step == 4">
        <van-button size="normal" @click="toStep(2)">查看详情</van-button>
      </div>
      <div class="btn" v-else-if="step == 2">
        <van-button size="normal" @click="toNext()">下一个</van-button>
      </div>
    </div>
  </div>
  <div class="container" v-else>
    <div class="daka" v-if="isComplete == false">
      <van-button size="normal" @click="daka()">打卡</van-button>
    </div>
    <div class="daka" v-else>
      <van-button size="normal" disabled>今日已打卡</van-button>
    </div>
  </div>
</template>

<script>
import { callApi } from "../../libs/api.js";
import Toast from "../../../static/vant/toast/toast";

import {
  WORD_WORD_INFO,
  UPDATE_WORD_RECORD,
  WORD_DAKA
} from "../../constants/api";

export default {
  data() {
    return {
      step: 1,
      index: 0,
      isKnown: 0,
      isEnd: 0,
      isPlay: false,
      isComplete: false,
      info: {
        currentValue: 0,
        word: "-",
        symbol: "-",
        voice: "#",
        translation: "-",
        annotation: "-",
        exchanges: "-"
      }
    };
  },
  methods: {
    toStep(step, type = null) {
      this.step = step;
      if (type == "mark") {
        this.isKnown = 1;
      }
    },
    toNext() {
      // 更新单词数据
      callApi(
        UPDATE_WORD_RECORD,
        "post",
        { index: this.index, isKnown: this.isKnown },
        res => {
          var isEnd = res.data.isEnd;
          if (isEnd == false) {
            if (this.isKnown) {
              this.index = this.index;
            } else {
              this.index = this.index + 1;
            }
            // 更新单词
            this.getWordInfo();
            this.step = 1;
            this.isKnown = 0;
          } else {
            this.isEnd = isEnd;
          }
        }
      );
    },
    handleVoice(voice) {
      const innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = voice;
      this.isPlay = true;
      var that = this;
      innerAudioContext.onEnded(() => {
        that.isPlay = false;
      });
    },
    getWordInfo() {
      const index = this.index;
      const currentValue = this.info.currentValue;
      callApi(
        WORD_WORD_INFO,
        "get",
        { index: index, isKnown: currentValue },
        res => {
          if (res.data.isEnd) {
            this.isEnd = res.data.isEnd;
          } else if (res.data.isComplete) {
            this.isEnd = true;
            this.isComplete = res.data.isComplete;
          } else if (res.data.again) {
            this.index = 0;
            this.getWordInfo();
            Toast.loading({
              duration: 3000,
              mask: true,
              message: "未完成，重新开始..."
            });
          } else {
            this.info = res.data;
          }
        }
      );
    },
    daka() {
      // 打卡
      callApi(WORD_DAKA, "post", {}, res => {
        this.isComplete = res.data.isComplete;
      });
    }
  },
  onReady: function() {
    this.index = 0;
    this.getWordInfo();
  },
  created() {}
};
</script>

<style>
.content {
  padding: 25px 0;
  word-wrap: break-word;
}
.foot {
  position: absolute;
  bottom: 0;
  width: 90vw;
  border-top: 1px solid #ddd;
  padding: 10px 5vw 10px 5vw;
}
.foot .btn {
  text-align: center;
}
.slider {
  padding: 0 20px;
}
.word {
  margin: 20px 10px 0 10px;
  background-color: #fff;
  border: 1px solid #ddd;
}
.word .label {
  font-size: 25px;
  color: #6416a6;
  padding: 2px 8px;
}
.word .label span {
  font-size: 16px;
  color: #455a64;
  margin-left: 5px;
}
.word .voice {
  /* border-left: 1px solid #ddd; */
  text-align: center;
  line-height: 2.2;
}
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  border-radius: 100px;
  background-color: #6416a6;
}
.van-icon {
  vertical-align: middle;
}
.van-slider--disabled {
  opacity: 1 !important;
}
.van-button--normal {
  width: 50%;
  background-color: #6416a6 !important;
  color: #fff !important;
}
.tips {
  padding: 0 10px;
}
.tips .translation {
  padding: 10px;
  background-color: #fff;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  color: #455a64;
  font-size: 16px;
}
.tips .annotation {
  padding-top: 15px;
}
.tips .annotation .label {
  font-size: 16px;
}
.tips .annotation .content {
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  font-size: 14px;
  color: #455a64;
  border: 1px solid #ddd;
}
.tips .annotation .color {
  background-color: #6416a6;
  color: #fff;
}
.daka {
  text-align: center;
  padding-top: 48vh;
}
</style>
