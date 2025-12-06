<template>
  <APlayer :audio="audio" mode="fixed" autoplay="false" preload="none" loop="all" order="list" volume="0.2" :lrcType=1
    lrcShow="false"></APlayer>
</template>
<script setup>
import { onMounted, ref } from "vue";
import APlayer from "@worstone/vue-aplayer";


const aplayer = ref(null);
// 设置 2 个或 2 个以上的歌曲信息
const audio = ref([
  {
    "title": "你，好不好？",
    "author": "周兴哲",
    "url": "https://oss.iswxl.cn/music/你好不好.mp3",
    "pic": "https://oss.iswxl.cn/music/你好不好.jpg",
    // "lrc": "https://oss.iswxl.cn/music/你好不好.lrc"
  },
  {
    "title": "座位",
    "author": "承桓",
    "url": "https://oss.iswxl.cn/music/承桓 - 座位.mp3",
    "pic": "https://oss.iswxl.cn/music/座位.jpg",
    // "lrc": "https://oss.iswxl.cn/music/座位.lrc"
  },
  {
    "title": "白羊",
    "author": "徐秉龙,沈以诚",
    "url": "https://oss.iswxl.cn/music/徐秉龙,沈以诚 - 白羊.mp3",
    "pic": "https://oss.iswxl.cn/music/徐秉龙,沈以诚%20-%20白羊.jpg",
    // "lrc": "https://oss.iswxl.cn/music/白羊.lrc"
  },
  {
    "title": "坏杀手",
    "author": "探长",
    "url": "https://oss.iswxl.cn/music/探长 - 坏杀手.mp3",
    "pic": "https://oss.iswxl.cn/music/探长%20-%20坏杀手.jpg",
    // "lrc": "https://oss.iswxl.cn/music/坏杀手.lrc"
  },
  {
    "title": "吹吹风",
    "author": "鹿晗",
    "url": "https://oss.iswxl.cn/music/鹿晗 - 吹吹风.mp3",
    "pic": "https://oss.iswxl.cn/music/鹿晗%20-%20吹吹风.jpg",
    // "lrc": "https://oss.iswxl.cn/music/吹吹风.lrc"
  },
  {
    "title": "命运",
    "author": "家家",
    "url": "https://oss.iswxl.cn/music/家家 - 命运.mp3",
    "pic": "https://oss.iswxl.cn/music/家家%20-%20命运.jpg",
    // "lrc": "https://oss.iswxl.cn/music/命运.lrc"
  },
  {
    "title": "我们俩",
    "author": "郭顶",
    "url": "https://oss.iswxl.cn/music/郭顶 - 我们俩.mp3",
    "pic": "https://oss.iswxl.cn/music/郭顶%20-%20我们俩.jpg",
    // "lrc": "https://oss.iswxl.cn/music/我们俩.lrc"
  },
  {
    "title": "四点的海棠花未眠",
    "author": "渡",
    "url": "https://oss.iswxl.cn/music/渡 - 四点的海棠花未眠.mp3",
    "pic": "https://oss.iswxl.cn/music/渡%20-%20四点的海棠花未眠.jpg",
    // "lrc": "https://oss.iswxl.cn/music/四点的海棠花未眠.lrc"
  },
  {
    "title": "晚风的轮廓",
    "author": "陆杰awr",
    "url": "https://oss.iswxl.cn/music/陆杰awr - 晚风的轮廓.mp3",
    "pic": "https://oss.iswxl.cn/music/陆杰awr%20-%20晚风的轮廓.jpg",
    // "lrc": "https://oss.iswxl.cn/music/晚风的轮廓.lrc"
  },
  {
    "title": "目及皆是你",
    "author": "小蓝背心",
    "url": "https://oss.iswxl.cn/music/小蓝背心 - 目及皆是你.mp3",
    "pic": "https://oss.iswxl.cn/music/小蓝背心%20-%20目及皆是你.jpg",
    // "lrc": "https://oss.iswxl.cn/music/目及皆是你.lrc"
  },
]);

onMounted(() => {
  // 加载歌曲信息
  let audios = [];
  // 添加到播放器列表
  aplayer.value.addList(audios);
});
</script>