<script setup>
import { onShow, onReachBottom } from "@dcloudio/uni-app";
import { ref } from "vue";
import { getAllUser } from "@/api";

const data = ref({
  list: [],
  total: 0,
});
const params = ref({
  page: 1,
  limit: 10,
});
let uToastRef = ref(null);

onShow(() => {
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
    const result = await getAllUser(params.value);
    if (result.code === 200) {
      data.value.list = [...data.value.list, ...result.data.list];
      data.value.total = result.data.total;
    }
  } catch (error) {}
};
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <view class="wrapper">
    <up-navbar
      title="员工管理"
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
          @click="goUrl(`/pages/search/index?type=staff`)"
        />
      </template>
    </up-navbar>
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
        <view class="flex justify-between w-[100%]" @click="goUrl(`/pages/account/profile/index?id=${item.id}`)">
          <text class="text-[18px] font-bold">{{ item.username }}</text>
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'PERSONSECTION'
            "
            >人事科长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'FINANCE'
            "
            >财务科长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'OFFICE'
            "
            >办公室</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'STORAGE'
            "
            >仓储部长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'PURCHASING'
            "
            >采购部长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'PROCESS'
            "
            >加工部长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'MARKETONE'
            "
            >销售一科长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'MARKETTWO'
            "
            >销售二科长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'DESIGN'
            "
            >设计科长</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'MESSHALL'
            "
            >食堂主管</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'PUTUP'
            "
            >住宿主管</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="
              item.profile_info?.job_name &&
              item.profile_info?.job_name == 'WORKER'
            "
            >普工</text
          >
          <text
            class="text-[#D43030] font-bold text-[18px]"
            v-show="!item.profile_info?.job_name"
            >暂无职位</text
          >
        </view>
      </view>
      <view
        class="text-[12px] text-[#999] mt-[12rpx]"
        v-if="item.profile_info?.entry_time"
      >
        入职时间：{{ item.profile_info?.entry_time }}
      </view>
      <view class="text-[12px] text-[#999] mt-[12rpx]" v-else>
        入职时间：暂无</view
      >
    </view>
  </view>
</template>
