<script setup>
import { onShow,onReachBottom } from "@dcloudio/uni-app";
import { ref } from "vue";
import { getRecord } from "@/api";

const params = ref({
  page: 1,
  limit: 10,
  type: ""
});
const data = ref({
  list: [],
  total: 0,
  loadStatus: "loading",
  loadShow: false
});

onShow(() => {
  data.value.list = []
  getInfo();
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
    const result = await getRecord(params.value);
    if (result.code === 200) {
      data.value.list = [...data.value.list,...result.data.list];
      data.value.total = result.data.total;
    }
  } catch (error) {}
};

const checkType = (type) => {
  params.value.type = type;
  data.value.list = []
  getInfo();
};
</script>

<template>
  <view class="wrapper">
    <up-navbar
      title="出库管理"
      :autoBack="true"
      fixed
      safeAreaInsetTop
      placeholder
    >
      <template #right>
        <image
          src="/static/icon/add.svg"
          alt=""
          class="mr-[20rpx] w-[36rpx] h-[36rpx]"
          @click="goUrl('/pages/output/newly/index')"
        />
        <image
          src="/static/icon/search.svg"
          alt=""
          class="w-[36rpx] h-[36rpx]"
          @click="goUrl(`/pages/search/index?type=output`)"
        />
      </template>
    </up-navbar>
    <view
      class="h-[88rpx] leading-[88rpx] bg-[#fff] pl-[24rpx] border-t-2 border-[rgba(240,240,240,.4)]"
    >
      <text @click="checkType('')" :class="{ 'text-[#999]': params.type != '' }"
        >全部</text
      >
      <text
        @click="checkType('DECREASE')"
        :class="{
          'text-[#999]': params.type != 'DECREASE',
          'mx-[36rpx]': true,
        }"
        >出库</text
      >
      <text
        @click="checkType('INCREASE')"
        :class="{ 'text-[#999]': params.type != 'INCREASE' }"
        >入库</text
      >
    </view>
    <view
      class="h-[60rpx] border-t-2 border-[rgba(240,240,240,.4)] bg-[#fff] text-[12px] text-[#ccc] leading-[60rpx] pl-[24rpx]"
    >
      共{{ data.total }}条记录
    </view>
    <view
      class="w-[95%] bg-[#fff] rounded-[8rpx] mx-auto mt-[16rpx] p-[28rpx]"
      v-for="item in data.list"
      :key="item.id"
    >
      <view class="flex justify-between items-start">
        <view class="flex items-center">
          <text class="text-[18px] font-bold">{{ item.depot_info?.model }}</text>
        </view>
        <text
          class="text-[#D43030] font-bold text-[20px]"
          v-show="item.enter_type === 'DECREASE'"
          >{{ item.out_num }}</text
        >
        <text
          class="text-[#00BAAD] font-bold text-[20px]"
          v-show="item.enter_type === 'INCREASE'"
          >{{ item.out_num }}</text
        >
      </view>
      <view class="text-[12px] text-[#999] mt-[12rpx]">
        日期：{{ item.time }}
      </view>
    </view>
    <up-loadmore :status="params.loadStatus" v-show="params.loadShow" />
  </view>
</template>
