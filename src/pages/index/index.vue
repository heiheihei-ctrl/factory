<script setup>
import { onShow,onReachBottom } from "@dcloudio/uni-app";
import Tabbar from "@/components/tabbar";
import { ref } from "vue";
import { getOrder } from "@/api";
import Card from "@/components/card"

const params = ref({
  page: 1,
  limit: 5,
  type: "UNDERWAY",
});
const list = ref([])

const goSearch = () => {
  uni.navigateTo({
    url: "/pages/search/index?type=order",
  });
};

onShow(() => {
  uni.hideTabBar({
    animation: false,
  });
  getInfo()
});
// 触底刷新
onReachBottom(() => {
  params.value.page++;
  getInfo();
});

const getInfo = async () => {
  try {
    const result = await getOrder(params.value)
    if(result.code === 200){
      list.value = [...list.value,...result.data.list];
    }
  } catch (error) {
    
  }
};
const checkInfo = (type) => {
  params.value.type = type
  list.value = []
  params.value.page = 1
  getInfo()
}
</script>

<template>
  <view class="wrapper top-safe">
    <view
      class="h-[120rpx] shadow-[0_4rpx_8rpx_0_rgba(240,240,240,0.6)] flex justify-between items-center px-[16px] bg-[#fff]"
    >
      <view>
        <text :class="{'text-[#999]':params.type != 'UNDERWAY','text-[18px] mr-[16px]':params.type == 'UNDERWAY'}" @click="checkInfo('UNDERWAY')">进行中</text>
        <text :class="{'text-[#999]':params.type != 'FINISH','text-[18px] ml-[16px]':params.type == 'FINISH'}" @click="checkInfo('FINISH')">已完成</text>
      </view>
      <image
        src="/static/icon/search.svg"
        mode=""
        @click="goSearch"
        class="w-[48rpx] h-[48rpx]"
      />
    </view>
    <Card :list="list" type="order"/>
    <Tabbar :page="0" />
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  padding-top: var(--status-bar-height);
}
</style>
