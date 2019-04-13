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
        <div v-for="(item, index) in voiceItem.translation" class="duan" :key="index">
          <p>{{item.enText}}</p>
          <p :style="'display:'+(hiddenCn?'none':'block')">{{item.cnText}}</p>
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
          <van-icon name="arrow-left" size="5vh"/>
        </van-col>
        <van-col span="6">
          <van-icon name="play" size="5vh" v-if="isPlaying == false" @click="handlePlay"/>
          <van-icon name="pause" size="5vh" v-else @click="handlePlay"/>
        </van-col>
        <van-col span="6">
          <van-icon name="arrow" size="5vh"/>
        </van-col>
        <van-col span="3"></van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hiddenAll: false,
      hiddenCn: true,
      isPlaying: false,
      sliderVal: 0,
      duration: 0,
      voiceItem: {
        title: "Test 1 - Section 1",
        voice:
          "http://tiku.d.zhan.com/Ielts_Audio/1475217733_1363_6791/20160930134049_01.Test1.Section1.mp3",
        translation: [
          {
            cnText: "大家好，女士们，先生们。",
            enText: "Good day, ladies and gentlemen.",
            star: "57.91",
            end: "59.49"
          }
        ]
      }
    };
  },
  onLoad: function(options) {
    var id = options.id;
    //获取播放器
    this.audioCtx = wx.createInnerAudioContext("musicAudio");
    // 获取数据
    this.getVoiceItem();
  },
  methods: {
    getVoiceItem(id) {
      this.audioCtx.src = this.voiceItem.voice;
      this.playSet();
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
        this.audioCtx.onTimeUpdate(() => this.timeUpdate);
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
      if(this.isPlaying){
        this.handlePlay()
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
  color: #455a64;
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
