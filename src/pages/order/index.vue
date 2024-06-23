<script setup>
import { onShow,onHide,onReachBottom } from "@dcloudio/uni-app";
import { ref, reactive } from "vue";
import { getOrder } from "@/api";
import Card from "@/components/card";

const params = ref({
  page: 1,
  limit: 6,
  type: "",
});
const data = ref({
  list: [],
  total: 0,
});

onShow(() => {
  getInfo();
});
// 离开页面初始化数据
onHide(() => {
  data.value.list = []
  params.value.page = 1
})
// 触底刷新
onReachBottom(() => {
  params.value.page++;
  getInfo();
});

const getInfo = async () => {
  try {
    const result = await getOrder(params.value);
    if (result.code === 200) {
      data.value.list = [...data.value.list, ...result.data.list];
      data.value.total = result.data.total;
    }
  } catch (error) {}
};

const goUrl = (url) => {
  uni.navigateTo({
    url,
  });
};
</script>

<template>
  <view class="wrapper">
    <up-navbar
      title="排单管理"
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
          @click="goUrl('/pages/order/newly/index')"
        />
        <image
          src="/static/icon/search.svg"
          alt=""
          class="w-[36rpx] h-[36rpx]"
          @click="goUrl('/pages/search/index?type=order')"
        />
      </template>
    </up-navbar>
    <view
      class="h-[60rpx] border-t-2 border-[rgba(240,240,240,.4)] bg-[#fff] text-[12px] text-[#ccc] leading-[60rpx] pl-[24rpx]"
    >
      共{{ data.total }}条记录
    </view>
    <Card :list="data.list" type="order" />
  </view>
</template>
