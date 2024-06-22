<script setup>
import { defineProps,defineEmits } from "vue";
const props = defineProps(["info"])
const emit = defineEmits(['detail'])
const send = () => {
  emit('detail',props.info)
}
</script>

<template>
  <view class="w-[95%] bg-[#fff] rounded-[8rpx] mx-auto mt-[16rpx] p-[28rpx]" @click="send">
    <view class="flex justify-between items-start">
      <view class="flex items-center">
        <text class="text-[18px] font-bold">{{props.info?.model}}</text>
        <text
          class="text-xs block px-[12rpx] h-[38rpx] border-2 border-[#FF5733] box-border rounded-[8rpx] text-[#FF5733] ml-[16rpx]"
          v-show="props.info?.total < props.info?.lowest_num">库存警告</text>
      </view>
      <text class="text-[#D43030] font-bold text-[20px]">{{props.info?.lowest_num}}</text>
    </view>
    <view class="text-[14px] text-[#666]"> 总数：{{props.info?.total}} </view>
    <view class="text-[12px] text-[#999] mt-[12rpx]"> 日期：{{props.info?.time}} </view>
  </view>
</template>
