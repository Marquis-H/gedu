import { GET, POST } from './request.js';
import { getSession } from '../services/authentication.js';

/**
 * API请求封装
 */
export const callApi = (api, method = 'GET', data, successCallback, failureCallback) => {
    let requestFunc;
    method = method.toUpperCase();
    switch (method) {
        case 'GET':
            requestFunc = () => GET(api, data ? data : {});
            break;
        case 'POST':
            requestFunc = () => POST(api, data);
            break;
        default:
            throw new Error('未知请求方法');
    }

    requestFunc().then(response => {
        let code = response.code;
        if (code === 0) {
            successCallback(response);
        } else {
            // 状态码不为0,分情况处理
            switch (code) {
                // 未绑定身份
                case 1001:
                    wx.showModal({
                        title: '安全提示',
                        content: '请进行身份验证后再使用',
                        showCancel: false,
                        confirmText: '身份验证',
                        success: () => {
                            wx.redirectTo({
                                url: '/pages/bind/main'
                            });
                        }
                    });
                    break;
                // 登陆超时,重新登录
                case 401:
                case 403:
                    getSession(
                        response => {
                            // 重新登录,判断是否已经绑定
                            callApi(api, method, data, successCallback, failureCallback);
                        },
                        response => {
                            // 重新登录失败
                            showMessage('无法登录调度服务器，请稍后再试');
                        }
                    );
                    break;
                default:
                    failureCallback && failureCallback(response);
                    break;
            }
        }
    }, error => {
        showMessage('服务器维护中，请稍后再试');
    });
}

function showMessage(content, title = '系统提示', confirmText = '知道了', callback) {
    // 这里无论有无loading都调用下,然后用定时器做延迟加载(小程序问题)
    wx.hideLoading();
    setTimeout(() => {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            confirmText: confirmText,
            success: () => {
                callback && callback()
            }
        });
    }, 100);
};