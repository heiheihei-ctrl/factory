<script setup>
import { onShow,onReachBottom } from "@dcloudio/uni-app";
import { ref } from "vue";
import { getDraw } from "@/api";

const params = ref({
  page: 1,
  limit: 10,
  content: "",
});
const data = ref({
  list:[],
  total:0
})

const baseUrl = import.meta.env.VITE_QINIU_PDF

onShow(() => {
  getInfo()
});
// 触底刷新
onReachBottom(() => {
  params.value.page++;
  getInfo();
});

const goUrl = (url) => {
  uni.navigateTo({
    url,
  });
};

const getInfo = async () => {
  try {
    const result = await getDraw(params.value)
    if(result.code === 200){
      data.value.list = [...data.value.list,...result.data.list]
      data.value.total = result.data.total
    }
  } catch (error) {
    
  }
};

const goFile = (file) => {
  uni.downloadFile({
    url: `${baseUrl}/${file}`,
    success: function (res) {
      var filePath = res.tempFilePath;
      uni.openDocument({
        filePath: filePath,
        showMenu: true,
        success: function (res) {
          console.log("打开文档成功");
        },
        fail(err) {
          console.log("打开文档失败");
        },
      });
    },
  });
};
</script>

<template>
  <view class="wrapper">
    <up-navbar
      title="图纸管理"
      :autoBack="true"
      fixed
      safeAreaInsetTop
      placeholder
    >
      <template #right>
        <image
          src="/static/icon/search.svg"
          alt=""
          class="w-[36rpx] h-[36rpx]"
          @click="goUrl(`/pages/search/index?type=draw`)"
        />
      </template>
    </up-navbar>
    <view
      class="h-[60rpx] border-t-2 border-[rgba(240,240,240,.4)] bg-[#fff] text-[12px] text-[#ccc] leading-[60rpx] pl-[24rpx]"
    >
      共{{data.total}}条记录
    </view>
    <view
      class="w-[95%] bg-[#fff] rounded-[8rpx] mx-auto mt-[16rpx] p-[28rpx]"
      v-for="item in data.list"
      :key="item.id"
    >
      <view class="flex justify-between items-start">
        <view class="flex items-center">
          <text class="text-[18px] font-bold">{{item.title.split('.')[0]}}</text>
        </view>
        <text class="text-[#2A82E4]" @click="goFile(item.title)">查看图纸</text>
      </view>
      <view class="text-[14px] text-[#666]"> 备注：{{item.remark}} </view>
      <view class="text-[12px] text-[#999] mt-[12rpx]"> 日期：{{item.create_at}} </view>
    </view>
  </view>
</template>
