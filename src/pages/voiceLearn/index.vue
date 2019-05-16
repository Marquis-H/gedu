<template>
  <div class="container">
    <div class="top">
      <van-row>
        <van-col span="14" class="title">{{voiceItem.title}}</van-col>
        <van-col span="10" class="control">
          <span @click="handleHiddenAll()">
            <van-icon name="orders-o"/>
            <span>原文</span>
          </span>
          <span>&emsp;</span>
          <span @click="handleHiddenCn()">
            <van-icon name="orders-o"/>
            <span>翻译</span>
          </span>
        </van-col>
      </van-row>
    </div>
    <scroll-view scroll-y style="height: 80vh;" class="content" v-if="hiddenAll == false">
      <div class="section">
        <div
          v-for="(item, index) in voiceItem.translation"
          class="duan"
          :key="index"
          :style="'color:'+(toView == index?'#6416a6':'#455a64')"
        >
          <p>{{item.entext}}</p>
          <p :style="'display:'+(hiddenCn?'none':'block')">{{item.cntext}}</p>
        </div>
      </div>
    </scroll-view>
    <div v-else style="height: 80vh;" class="content">
      <div style="position: absolute; top:40%; text-align: center; width:100%;">
        <van-icon name="closed-eye" size="36px"/>
      </div>
    </div>
    <div class="foot">
      <div class="slider">
        <van-slider :value="sliderVal" @change="handleChangeSlider"/>
      </div>
      <van-row class="play">
        <van-col span="6" offset="3">
          <van-icon name="arrow-left" size="5vh" @click="handlePre"/>
        </van-col>
        <van-col span="6">
          <van-icon name="pause" size="5vh" v-if="isPlaying == false" @click="handlePlay"/>
          <van-icon name="play" size="5vh" v-else @click="handlePlay"/>
        </van-col>
        <van-col span="6">
          <van-icon name="arrow" size="5vh" @click="handleNext"/>
        </van-col>
        <van-col span="3">
          <span class="time">{{currentTime}}</span>
        </van-col>
      </van-row>
    </div>
    <van-toast id="van-toast"/>
  </div>
</template>

<script>
import Toast from "../../../static/vant/toast/toast";
import { callApi } from "../../libs/api.js";
import { VOICE_DETAIL } from "../../constants/api";

export default {
  data() {
    return {
      hiddenAll: true,
      hiddenCn: true,
      isPlaying: false,
      sliderVal: 0,
      duration: 0,
      currentTime: "00:00",
      toView: -1,
      voiceItem: {},
      audioCtx: {}
    };
  },
  onLoad: function(options) {
    var id = options.id;
    this.currentTime = '00:00'
    //获取播放器
    this.audioCtx = wx.createInnerAudioContext("musicAudio");
    // 获取数据
    this.getVoiceItem(id);
  },
  onUnload() {
    this.audioCtx.destroy();
  },
  methods: {
    getVoiceItem(id) {
      Toast.loading({
        duration: 0,
        mask: true,
        message: "加载中..."
      });
      callApi(VOICE_DETAIL, "GET", { id: id }, res => {
        Toast.clear();
        this.voiceItem = res.data;
        this.audioCtx.src = encodeURI(this.voiceItem.voice);
        this.playSet();
      });
    },
    handleHiddenCn() {
      this.hiddenCn = !this.hiddenCn;
    },
    handleHiddenAll() {
      this.hiddenAll = !this.hiddenAll;
    },
    handlePlay() {
      if (this.isPlaying) {
        this.audioCtx.play();
      } else {
        this.audioCtx.pause();
      }
      // 改变图标
      this.isPlaying = !this.isPlaying;
    },
    playSet() {
      var that = this;
      Toast.loading({
        duration: 0,
        mask: true,
        message: "加载音频..."
      });
      this.audioCtx.seek(0);
      this.audioCtx.pause();
      this.isPlaying = true;
      setTimeout(function() {
        that.audioCtx.play();
        that.audioCtx.onTimeUpdate(that.timeUpdate);
        that.isPlaying = false;
        Toast.clear();
      }, 500);
    },
    handleChangeSlider(e) {
      var unit = this.duration / 100;
      var seek = e.mp.detail * unit;
      if (this.isPlaying) {
        this.handlePlay();
      }
      this.audioCtx.seek(seek);
      this.sliderVal = e.mp.detail;
    },
    timeUpdate() {
      var e = this.audioCtx;
      var duration = e.duration;
      var currentTime = e.currentTime;
      var sliderVal = currentTime / (duration / 100);
      this.sliderVal = sliderVal;
      this.duration = duration;
      this.currentTime = this.timeToMinute(duration - currentTime);

      const translation = this.voiceItem.translation;
      // 匹配歌词
      for (var j = 0; j < translation.length; ++j) {
        if (
          currentTime >= this.voiceItem.translation[j]["start"] &&
          currentTime < this.voiceItem.translation[j]["end"]
        ) {
          this.toView = j;
        }
      }
    },
    handlePre() {
      if (this.voiceItem.pre) {
        this.audioCtx.destroy();
        this.resetData();
        wx.redirectTo({
          url: "/pages/voiceLearn/main?id=" + this.voiceItem.pre
        });
      } else {
        Toast("无音频可播放");
      }
    },
    resetData() {
      this.sliderVal = 0;
      this.duration = 0;
      this.currentTime = '00:00';
      this.toView = -1;
    },
    handleNext() {
      if (this.voiceItem.next) {
        this.audioCtx.destroy();
        this.resetData();
        wx.redirectTo({
          url: "/pages/voiceLearn/main?id=" + this.voiceItem.next
        });
      } else {
        Toast("无音频可播放");
      }
    },
    timeToMinute(times) {
      var result = "00:00:00";
      var hour, minute, second;
      if (times > 0) {
        hour = Math.floor(times / 3600);
        if (hour < 10) {
          hour = "0" + hour;
        }
        minute = Math.floor((times - 3600 * hour) / 60);
        if (minute < 10) {
          minute = "0" + minute;
        }

        second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
        if (second < 10) {
          second = "0" + second;
        }
        if (hour == "00") {
          result = minute + ":" + second;
        } else if (minute == "00") {
          result = hour + ":" + minute + ":" + second;
        } else {
          result = second;
        }
      }
      console.log("result", result);
      return result;
    }
  }
};
</script>

<style>
.top {
  font-size: 15px;
  background-color: #f8f8f8;
  color: #455a64;
  padding: 5px 10px;
}
.top .control {
  text-align: right;
}
.top .van-icon {
  vertical-align: middle;
  margin-bottom: 3px;
}
.content {
  background-color: #fff;
}
.section {
  padding: 5px 10px;
}
.section .duan {
  padding: 5px;
}
.section p {
  font-size: 16px;
  /* color: #455a64; */
}
.foot {
  position: absolute;
  bottom: 0;
  width: 100vw;
}
.foot .play {
  padding: 0 20vw;
  text-align: center;
}
.slider {
  padding: 0 15px;
}
.time{
  text-align: left;
  margin-right: 15px;
  font-size: 14px;
}
</style>
