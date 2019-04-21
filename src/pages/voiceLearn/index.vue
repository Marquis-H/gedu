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
        <div v-for="(item, index) in voiceItem.translation" class="duan" :key="index" :style="'color:'+(toView == index?'#6416a6':'#455a64')">
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
          <van-icon name="play" size="5vh" v-if="isPlaying == false" @click="handlePlay"/>
          <van-icon name="pause" size="5vh" v-else @click="handlePlay"/>
        </van-col>
        <van-col span="6">
          <van-icon name="arrow" size="5vh" @click="handleNext"/>
        </van-col>
        <van-col span="3"></van-col>
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
      hiddenAll: false,
      hiddenCn: true,
      isPlaying: false,
      sliderVal: 0,
      duration: 0,
      toView: -1,
      voiceItem: {}
    };
  },
  onLoad: function(options) {
    var id = options.id;
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

        this.audioCtx.src = this.voiceItem.voice;
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
      wx.showToast({ title: "加载音频", icon: "loading", duration: 500 });
      this.audioCtx.seek(0);
      this.audioCtx.pause();
      this.isPlaying = true;
      var timer = setTimeout(function() {
        that.audioCtx.play();
        that.audioCtx.onTimeUpdate(that.timeUpdate);
        that.isPlaying = false;
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

      const translation = this.voiceItem.translation;
      // 匹配歌词
      for (var j = 0; j < translation.length; ++j) {
        if (
          currentTime >= this.voiceItem.translation[j]['start'] &&
          currentTime < this.voiceItem.translation[j]['end']
        ) {
          this.toView = j;
        }
      }
    },
    handlePre() {
      if (this.voiceItem.pre) {
        this.audioCtx.destroy();
        wx.redirectTo({
          url: "/pages/voiceLearn/main?id=" + this.voiceItem.pre
        });
      } else {
        Toast("无音频可播放");
      }
    },
    handleNext() {
      if (this.voiceItem.next) {
        this.audioCtx.destroy();
        wx.redirectTo({
          url: "/pages/voiceLearn/main?id=" + this.voiceItem.next
        });
      } else {
        Toast("无音频可播放");
      }
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
  padding: 0 5px;
}
</style>
