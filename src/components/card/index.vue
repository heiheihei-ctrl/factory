<script setup>
import { defineProps } from "vue";
const props = defineProps(["list", "type"]);
const pages = getCurrentPages();

const goDetail = (id) => {
  if (props.type === "order") {
    uni.navigateTo({
      url: `/pages/detail/schedule/index?id=${id}`,
    });
  }
};
const editOrder = (item) => {
  uni.navigateTo({
    url: "/pages/order/newly/index",
    success: () => {
      setTimeout(() => {
        uni.$emit("acceptData", item);
      }, 100);
    },
  });
};

// 查看身份
const goUrl = (item) => {
  if (pages[0].route == "pages/index/index") {
    goDetail(item.id);
  } else {
    editOrder(item);
  }
};
</script>

<template>
  <view
    class="w-[95%] bg-[#fff] h-[216rpx] mt-[16rpx] mx-auto rounded-[8rpx] p-[32rpx]"
    v-for="item in props.list"
    :key="item.id"
    @click="goUrl(item)"
  >
    <view class="flex items-start justify-between">
      <view class="flex items-center">
        <text class="text-[18px] font-bold">{{
          item.draw_info.title.split(".")[0]
        }}</text>
        <text
          class="text-xs block px-[12rpx] h-[38rpx] border-2 border-[#FF5733] box-border rounded-[8rpx] text-[#FF5733] ml-[16rpx]"
          v-show="item.is_quick"
          >加急</text
        >
      </view>
      <text
        class="text-[#2A82E4] text-[24px]"
        v-show="item.order_status === 'COPPER' && props.type === 'order'"
        >车铜</text
      >
      <text
        class="text-[#2A82E4] text-[24px]"
        v-show="item.order_status === 'ELECTRO' && props.type === 'order'"
        >电泳</text
      >
      <text
        class="text-[#2A82E4] text-[24px]"
        v-show="item.order_status === 'IRON' && props.type === 'order'"
        >车铁</text
      >
      <text
        class="text-[#2A82E4] text-[24px]"
        v-show="item.order_status === 'ALLOY' && props.type === 'order'"
        >合金外层</text
      >
      <text
        class="text-[#2A82E4] text-[24px]"
        v-show="item.order_status === 'KAMITIN' && props.type === 'order'"
        >上锡包装</text
      >
      <text
        class="text-[#2A82E4] text-[24px]"
        v-show="item.order_status === 'OUTPUT' && props.type === 'order'"
        >出库</text
      >
    </view>
    <view class="text-[#666] text-[14px]">
      <text class="mr-[10rpx]">数量：{{ item.order_num }}</text>
      <text>外观：{{ item.color }}</text>
    </view>
    <text class="text-[12px] text-[#ccc]">下单日期：{{ item.order_time }}</text>
  </view>
</template>
