<script setup>
import modelCard from "@/components/modelCard";
import { getAllDepot, delDepot } from "@/api";
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { ref } from "vue";

const params = ref({
  page: 1,
  limit: 10,
  list: [],
  total: 0,
  loadStatus: "loading",
  loadShow: false,
});
let uToastRef = ref(null);

onLoad(() => {
  getInfo();
});

// 触底刷新
onReachBottom(() => {
  params.value.page++;
  getInfo();
});
// 下拉加载
onPullDownRefresh(() => {
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
    const result = await getAllDepot(params.value);
    if (result.code === 200) {
      params.value.list = [...params.value.list, ...result.data.list];
      params.value.total = result.data.total;
    }
  } catch (error) {}
};

// 跳转到编辑
const goDetail = (info) => {
  uni.navigateTo({
    url: "/pages/materials/newly/index",
    success: (res) => {
      setTimeout(() => {
        uni.$emit("acceptData", info);
      }, 100);
    },
  });
};
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <view class="wrapper">
    <up-navbar
      title="材料管理"
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
          @click="goUrl('/pages/materials/newly/index')"
        />
        <image
          src="/static/icon/search.svg"
          alt=""
          class="w-[36rpx] h-[36rpx]"
          @click="goUrl(`/pages/search/index?type=materials`)"
        />
      </template>
    </up-navbar>
    <view
      class="h-[60rpx] border-t-2 border-[rgba(240,240,240,.4)] bg-[#fff] text-[12px] text-[#ccc] leading-[60rpx] pl-[24rpx]"
    >
      共{{ params.total }}条记录
    </view>
    <modelCard
      v-for="item in params.list"
      :key="item.id"
      :info="item"
      @detail="goDetail"
    />
    <up-loadmore :status="params.loadStatus" v-show="params.loadShow" />
  </view>
</template>
