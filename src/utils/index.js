function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export const getDispatchApi = (uri, version = 'v1') => {
  const api = `http://gedu.qidorg.com/${version}${uri}`;

  return api;
};

export const WeAppStorage = {
  setItem: function (key, value, callback) {
    wx.setStorage({ key, data: value, fail: callback })
  },
  getItem: function (key, callback) {
    wx.getStorage({ key, success: (res) => callback && callback(undefined, res.data), fail: callback })
  },
  removeItem: function (key, callback) {
    wx.removeStorage({ key, fail: callback })
  },
  getAllKeys: function (callback) {
    wx.getStorageInfo({ success: res => callback && callback(undefined, res.keys), fail: callback })
  }
};


export default {
  formatNumber,
  formatTime,
  getDispatchApi,
  WeAppStorage
}
