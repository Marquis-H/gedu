import { SESSION_ID } from '../constants/storage';

function request(method = 'GET') {
    return function (url, data = {}) {
        let sessionId = wx.getStorageSync(SESSION_ID);
        let headers = {
            'Content-Type': 'application/json'
        }
        // 存在登录
        if (sessionId)
            headers['Authorization'] = `Bearer ${sessionId}`;

        return new Promise(function (resolve, reject) {
            wx.request({
                url,
                data,
                method,
                header: headers,
                success: function (res) {
                    let statusCode = res.statusCode,
                        repData = res.data;
                    if (statusCode === 200) {
                        resolve(repData)
                    } else {
                        reject(repData)
                    }
                },
                fail: function (err) {
                    reject('网路请求不符合规范，请检查域名是否符合要求')
                }
            })
        })
    }
}

export const GET = request('GET');
export const POST = request('POST');
export const PUT = request('PUT');
export const DELETE = request('DELETE');