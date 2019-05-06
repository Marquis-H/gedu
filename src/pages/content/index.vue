<template>
  <div class="container" v-if="type == 'campus'">
    <div class="content">
      <div class="title">校区简介</div>
      <div class="main">
        <wxParse :content="detail.content"/>
      </div>
    </div>
    <div class="info">
      <div class="title">校区信息</div>
      <div v-for="(item, i) in detail.extra" :key="i">
        <div v-if="i > 0" class="hr"></div>
        <div class="item">
          <van-icon name="home-o" size="20px" color="#6416a6"/>
          <span>{{item.title}}</span>
        </div>
        <div class="item">
          <van-icon name="phone-circle-o" size="20px" color="#6416a6"/>
          <span>{{item.phone}}</span>
        </div>
        <div class="item">
          <div>
            <van-icon name="location-o" size="20px" color="#6416a6"/>
            <span>{{item.address}}</span>
          </div>
          <div class="map" v-if="item.map">
            <img :src="item.map">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="type == 'teacher'">
    <div class="content">
      <div class="title">讲师简介</div>
      <div class="main">
        <wxParse :content="detail.content"/>
      </div>
    </div>
  </div>
  <div v-else-if="type == 'activity'">
    <div class="content">
      <div class="title">{{detail.title}}</div>
      <div class="main">
        <wxParse :content="detail.content"/>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="content">
      <div class="title">课程简介</div>
      <div class="main">
        <wxParse :content="detail.content"/>
      </div>
    </div>
  </div>
</template>

<script>
import wxParse from "mpvue-wxparse";
import { GET_CONTENT_DETAIL } from "../../constants/api.js";
import { callApi } from "../../libs/api.js";

export default {
  components: {
    wxParse
  },
  data() {
    return {
      type: "",
      detail: {}
    };
  },
  methods: {},
  onLoad(options) {
    var id = options.id;
    // 设置类型
    var type = options.type;
    this.type = type;
    // 获取banner
    callApi(GET_CONTENT_DETAIL, "GET", { id: id, type: type }, res => {
      this.detail = res.data;
    });
  },
  created() {}
};
</script>

<style>
.content {
  padding: 10px 15px 15px 15px;
  background-color: #ffffff;
}
.info {
  margin-top: 5px;
  padding: 10px 15px 15px 15px;
  background-color: #ffffff;
}
.title {
  color: 101010;
  padding: 5px 0;
}
.main {
  font-size: 14px;
  color: #aeaeae;
}
.item span {
  font-size: 16px;
}
.van-icon {
  vertical-align: middle;
  margin-right: 5px;
}
.item {
  margin: 5px 0;
}
.map {
  padding: 15px 0;
}
.map img {
  width: 100%;
}
.hr{
  border-bottom: 1px solid #ddd
}
</style>
