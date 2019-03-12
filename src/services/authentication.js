import { POST } from '../libs/request.js';
import { GET_OPENID, GET_TOKEN } from '../constants/api.js';
import { SESSION_ID, OPEN_ID } from '../constants/storage.js';
import { callApi } from '../libs/api';

/**
 * 在服务端获取Session ID
 */
export const getSession = (successCallback, failureCallback) => {
    // 清除本地存储数据
    var _isMessage = wx.getStorageSync('_isMessage');
    // wx.clearStorageSync();
    wx.setStorageSync('_isMessage', _isMessage);
    // 重新登录
    wx.login({
        success: function (res) {
            POST(GET_OPENID, { code: res.code }).then(rep => {
                // 保存SessionId
                var phone = rep.data.phone;
                wx.setStorageSync(OPEN_ID, rep.data.openId);
                // 获取sessionId
                callApi(GET_TOKEN, 'POST', { phone: phone }, res => {
                    wx.setStorageSync(SESSION_ID, res.data.token);
                    successCallback && successCallback(rep.data);
                })
            }, error => {
                failureCallback && failureCallback(error);
            }).catch(error => {
                console.error(error);
            });
        }
    });
}