<template>
  <div class="container">
    <van-cell-group>
      <van-cell title="姓名" :value="profile.name" is-link @click="changeField()"/>
      <van-cell title="性别" :value="profile.gender" is-link/>
      <van-cell title="出生日期" :value="profile.birthday" is-link/>
      <van-cell title="手机号" :value="profile.phone"/>
      <van-cell title="所在校区" :value="profile.campus"/>
    </van-cell-group>
    <van-dialog use-slot async-close :show="showName" show-cancel-button @close="onClose">
      <van-field :value="name" @change="onChange" label="姓名" placeholder="请输入姓名"/>
    </van-dialog>
  </div>
</template>

<script>
import { GET_PROFILE, UPDATE_PROFILE } from "../../constants/api.js";
import { callApi } from "../../libs/api.js";

export default {
  data() {
    return {
      profile: {},
      name: "",
      gender: "",
      birthday: "",
      showName: false
    };
  },
  methods: {
    changeField() {
      this.showName = true;
      this.name = this.profile.name;
    },
    onChange(event) {
      this.name = event.mp.detail;
    },
    onClose(event) {
      if (event.mp.detail === "confirm") {
        callApi(
          UPDATE_PROFILE,
          "post",
          { type: "name", name: this.name },
          res => {
            if (res.code == 0) {
              this.profile.name = this.name;
            }
          }
        );
      } else {
        this.name = this.profile.name;
      }
      this.showName = false;
    }
  },
  onReady() {
    // 获取个人信息
    callApi(GET_PROFILE, "GET", {}, res => {
      this.profile = res.data;
    });
  },
  created() {}
};
</script>

<style>
.container {
  margin-top: 15px;
}
</style>
