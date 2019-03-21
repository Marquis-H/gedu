<template>
  <div class="container">
    <van-cell-group>
      <van-cell title="姓名" :value="profile.name" is-link @click="changeField('name')"/>
      <van-cell title="性别" :value="profile.gender" is-link @click="changeField('gender')"/>
      <van-cell title="出生日期" :value="profile.birthday" is-link @click="changeField('birthday')"/>
      <van-cell title="手机号" :value="profile.phone"/>
      <van-cell title="所在校区" :value="profile.campus"/>
    </van-cell-group>
    <van-dialog use-slot async-close :show="showName" show-cancel-button @close="onClose">
      <van-field :value="name" @change="onChange" label="姓名" placeholder="请输入姓名"/>
    </van-dialog>
    <van-dialog use-slot async-close :show="showGender" show-cancel-button @close="confirmGender">
      <van-radio-group :value="gender" @change="onChangeGender">
        <van-radio name="男">男</van-radio>
        <van-radio name="女">女</van-radio>
      </van-radio-group>
    </van-dialog>
    <van-popup :show="showBirthday" position="bottom">
      <van-datetime-picker
        type="date"
        :value="birthday"
        @confirm="confirmBirthday"
        @cancel="showBirthday=false"
        @input="onChangeBirthday"
        :min-date="minDate"
      />
    </van-popup>
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
      showName: false,
      showGender: false,
      showBirthday: false,
      minDate: new Date(1970, 1, 1).getTime()
    };
  },
  methods: {
    changeField(type) {
      switch (type) {
        case "name":
          this.showName = true;
          this.name = this.profile.name;
          break;
        case "gender":
          this.showGender = true;
          this.gender = this.profile.gender;
          break;
        case "birthday":
          this.showBirthday = true;
          this.birthday = this.profile.birthday
            ? new Date(this.profile.birthday + " 00:00:00").getTime()
            : new Date().getTime();
          break;
      }
    },
    onChange(event) {
      this.name = event.mp.detail;
    },
    onChangeGender(event) {
      this.gender = event.mp.detail;
    },
    onChangeBirthday(event) {
      this.birthday = event.mp.detail;
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
    },
    confirmGender(event) {
      if (event.mp.detail === "confirm") {
        callApi(
          UPDATE_PROFILE,
          "post",
          { type: "gender", gender: this.gender },
          res => {
            if (res.code == 0) {
              this.profile.gender = this.gender;
            }
          }
        );
      } else {
        this.gender = this.profile.gender;
      }
      this.showGender = false;
    },
    confirmBirthday() {
      var date = new Date(this.birthday);

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      callApi(
        UPDATE_PROFILE,
        "post",
        { type: "birthday", birthday: year+'-'+month+'-'+day },
        res => {
          if (res.code == 0) {
            this.profile.birthday = year+'-'+month+'-'+day;
            this.showBirthday = false
          }
        }
      );
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
.van-radio {
  margin: 8px;
}
.foot {
  position: absolute;
  bottom: 0;
  width: 100vw;
}
</style>
