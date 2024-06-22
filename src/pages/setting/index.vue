<script setup>
import { ref } from "vue";
import { logout } from "@/api";

let uToastRef = ref(null);

const noOpen = () => {
  uToastRef.value.show({
    type: "error",
    message: "此功能暂未开放"
  });
};
const goOut = async () => {
  try {
    const result = await logout();
    if (result.code == 200) {
      uni.clearStorageSync()
      uToastRef.value.show({
        type: "success",
        message: "退出成功",
        complete() {
          uni.reLaunch({
            url: "/pages/login/index",
          });
        },
      });
    }
  } catch (error) {}
};
const checkAccount = () => {
  uni.removeStorageSync("accessToken")
  uni.reLaunch({
    url: "/pages/login/index",
  });
};
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <view class="wrapper">
    <up-navbar
      title="设置与隐私"
      :autoBack="true"
      fixed
      safeAreaInsetTop
      placeholder
    ></up-navbar>
    <view
      class="flex bg-[#fff] mt-[40rpx] h-[96rpx] justify-between items-center px-[36rpx] border-b-2 border-[rgba(240,240,240,.4)]"
      @click="noOpen"
    >
      <text>我的信息</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view
      class="flex bg-[#fff] h-[96rpx] justify-between items-center px-[36rpx]"
      @click="noOpen"
    >
      <text>修改密码</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view
      class="flex bg-[#fff] h-[96rpx] justify-between items-center px-[36rpx] mt-[28rpx]"
      @click="noOpen"
    >
      <text>帮助与反馈</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="fixed bottom-[84rpx] w-[100%]">
      <view
        class="bg-[#fff] h-[104rpx] text-center leading-[104rpx]"
        @click="checkAccount"
      >
        <text>切换账号</text>
      </view>
      <view
        class="bg-[#fff] h-[104rpx] text-center leading-[104rpx] mt-[12rpx]"
        @click="goOut"
      >
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>
