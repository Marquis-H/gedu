<script>
import { POST } from "./libs/request.js";
import { GET_OPENID } from "./constants/api.js";
import { OPEN_ID } from "./constants/storage.js";

export default {
  created() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    console.log("app created and cache logs by setStorageSync");
  },
  onLaunch: function() {
    // 检查登录状态
    wx.checkSession({
      success: function(res) {},
      fail: function(res) {
        wx.clearStorageSync();
        wx.setStorageSync("_isMessage", false);
        // 登录
        wx.login({
          success: function(res) {
            POST(GET_OPENID, { code: res.code }).then(rep => {
              wx.setStorageSync(OPEN_ID, rep.data.openId);
            });
          }
        });
      }
    });
  },
  onHide: function() {
    // 小程序退出或者进入后台时候进行数据缓存
    wx.setStorageSync("_isMessage", false);
  }
};
</script>

<style>
@import "../static/vant/common/index.wxss";

page {
  height: 100%;
  background-color: #f8f8f8;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
