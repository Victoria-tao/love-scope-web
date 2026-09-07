// utils/imageConfig.js
// 图片基础路径配置
// 开发调试时用本地路径 '/assets/illustration'
// 上线前请改成网络图床URL，例如 'https://your-cdn.com/xingge'
// 把 assets/illustration 目录下的所有图片上传到图床对应目录即可
const IMG_BASE = '/assets/illustration';

// 首页主视觉
const HOME_HERO = IMG_BASE + '/home/hero_rose-couple.jpg';

// MBTI人格猫咪图片（16种类型）- 放在 personal 分包
const MBTI_CATS = {
  INTJ: '/pages/personal/images/INTJ.jpg',
  INTP: '/pages/personal/images/INTP.jpg',
  ENTJ: '/pages/personal/images/ENTJ.jpg',
  ENTP: '/pages/personal/images/ENTP.jpg',
  INFJ: '/pages/personal/images/INFJ.jpg',
  INFP: '/pages/personal/images/INFP.jpg',
  ENFJ: '/pages/personal/images/ENFJ.jpg',
  ENFP: '/pages/personal/images/ENFP.jpg',
  ISTJ: '/pages/personal/images/ISTJ.jpg',
  ISFJ: '/pages/personal/images/ISFJ.jpg',
  ESTJ: '/pages/personal/images/ESTJ.jpg',
  ESFJ: '/pages/personal/images/ESFJ.jpg',
  ISTP: '/pages/personal/images/ISTP.jpg',
  ISFP: '/pages/personal/images/ISFP.jpg',
  ESTP: '/pages/personal/images/ESTP.jpg',
  ESFP: '/pages/personal/images/ESFP.jpg'
};

module.exports = {
  IMG_BASE,
  HOME_HERO,
  MBTI_CATS
};
