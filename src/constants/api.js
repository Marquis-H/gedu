const domain = 'https://gedu.qidorg.com';

// 获取校区
export const GET_COMPUS = `${domain}/api/app/public/campus`;
// 申请绑定
export const BIND_REQUEST = `${domain}/api/app/auth/bind_request`;
// 绑定
export const BIND = `${domain}/api/app/auth/bind`;
// 获取openId \ phone
export const GET_OPENID = `${domain}/api/app/public/get_openId`;
// 获取token
export const GET_TOKEN = `${domain}/api/app/auth/token`;
// 更新分享的积分
export const UPDATE_INTEGRAL_SHARE = `${domain}/api/app/public/update_share_integral`

// 获取banner
export const GET_BANNER = `${domain}/api/app/public/banner`;
// 获取内容分类
export const GET_CONTENT_CAT = `${domain}/api/app/public/content_cat`;
// 获取内容列表
export const GET_CONTENT_LIST = `${domain}/api/app/public/content/list`;
// 获取内容
export const GET_CONTENT_DETAIL = `${domain}/api/app/public/content/detail`;
// 获取活动规则
export const GET_SHARE_TIPS = `${domain}/api/app/public/share/tips`;

// 获取单词统计数据
export const WORD_INFO = `${domain}/api/app/word/info`;
// 创建单词记录
export const CREATE_WORD_USER = `${domain}/api/app/word/create_record`;
// 获取单词数据
export const WORD_WORD_INFO = `${domain}/api/app/word/word_info`;
// 更新单词数据
export const UPDATE_WORD_RECORD = `${domain}/api/app/word/update_record`;
// 打卡
export const WORD_DAKA = `${domain}/api/app/word/daka`;


// 获取用户个人信息
export const GET_PROFILE = `${domain}/api/app/profile/detail`;
export const UPDATE_PROFILE = `${domain}/api/app/profile/update`;
export const GET_PRIZE_LIST = `${domain}/api/app/public/prize/list`;

export const getDispatchApi = (uri, version = '') => {
    const api = `http://gedu.qidorg.com/${version}${uri}`;

    return api;
};