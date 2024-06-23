<script setup>
import Tabbar from "@/components/tabbar";
import { userDetail } from "@/api";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

const info = ref({});
const role = ref("");
let uToastRef = ref(null);
let baseUrl = import.meta.env.VITE_QINIU_URL;

const noOpen = () => {
  uToastRef.value.show({
    type: "error",
    message: "此功能暂未开放",
  });
};
const goUrl = (url) => {
  uni.navigateTo({
    url,
  });
};
const getInfo = async () => {
  try {
    const result = await userDetail();
    if (result.code === 200) {
      info.value = result.data;
      const roles = result.data.role_info.alias;
      if (roles.indexOf("admin") != -1) {
        role.value = "admin";
      } else if (roles.indexOf("super") != -1) {
        role.value = "super";
      } else {
        role.value = "normal";
      }
      uni.setStorageSync("role", role.value);
    }
  } catch (error) {}
};
onShow(() => {
  getInfo();
});
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <view class="wrapper">
    <view class="relative bg-gradient-to-b from-[#8CC2FF] to-[rgba(0,0,0,0)]">
      <view
        class="w-[94%] flex items-center justify-between mx-auto pt-[128rpx]"
        @click="goUrl(`/pages/account/profile/index?id=${info.id}`)"
      >
        <view class="flex flex-row">
          <image
            src="https://cdn.uviewui.com/uview/album/1.jpg"
            mode=""
            class="w-[106rpx] h-[106rpx] rounded-md"
            v-show="!info.profile_info?.identity_photo"
          />
          <image
            :src="baseUrl + info.profile_info?.identity_photo"
            mode=""
            v-show="info.profile_info?.identity_photo"
            class="w-[106rpx] h-[106rpx] rounded-md"
          />
          <view class="flex flex-col ml-[20rpx] mt-[8rpx]">
            <text class="text-[18px]">{{ info.username }}</text>
            <text class="text-[#666] text-[14px]"
              >身份：{{ info.role_info?.name }}</text
            >
          </view>
        </view>
        <image
          src="/static/icon/arrow-white.svg"
          class="w-[88rpx] h-[88rpx]"
          alt=""
        />
      </view>
    </view>
    <view class="mt-[40rpx]">
      <view
        class="w-[94%] bg-[#fff] mx-auto rounded-[8rpx] px-[26rpx] py-[20rpx] mb-[16rpx]"
        v-show="!info.profile_info"
      >
        <view
          class="flex items-center justify-between"
          @click="goUrl('/pages/account/profile/index')"
        >
          <view class="flex items-center justify-center">
            <up-icon name="error-circle" color="#F4A062"></up-icon>
            <text class="text-[14px] text-[#F4A062] ml-[12rpx]"
              >请填写完整信息</text
            >
          </view>
          <view class="flex">
            <text class="text-[14px] text-[#F4A062] mr-[12rpx]">立即填写</text>
            <up-icon name="arrow-right" color="#F4A062" size="12"></up-icon>
          </view>
        </view>
      </view>
      <view
        class="w-[94%] bg-[#fff] mx-auto rounded-[8rpx] mb-[16rpx] px-[28rpx] py-[20rpx]"
        v-show="role === 'admin'"
      >
        <view class="pb-[20rpx] border-b-2 border-[rgba(240,240,240,.4)]">
          <text class="text-[18px]">常用工具</text>
        </view>
        <view class="flex justify-between items-end px-[20rpx] mt-[24rpx]">
          <view
            class="flex flex-col text-center items-center"
            @click="goUrl('/pages/materials/index')"
          >
            <image
              class="w-[98rpx] h-[98rpx]"
              src="/static/icon/account/materials.svg"
              mode=""
            />
            <text class="mt-[14rpx] text-[14px]">材料管理</text>
          </view>
          <view
            class="flex flex-col text-center items-center"
            @click="goUrl('/pages/draw/index')"
          >
            <image
              class="w-[78rpx] h-[78rpx]"
              src="/static/icon/account/draw.svg"
              mode=""
            />
            <text class="mt-[14rpx] text-[14px]">图纸管理</text>
          </view>
          <view
            class="flex flex-col text-center items-center"
            @click="goUrl('/pages/output/index')"
          >
            <image
              class="w-[78rpx] h-[78rpx]"
              src="/static/icon/account/output.svg"
              mode=""
            />
            <text class="mt-[14rpx] text-[14px]">出库管理</text>
          </view>
          <view
            class="flex flex-col text-center items-center"
            @click="goUrl('/pages/order/index')"
          >
            <image
              class="w-[78rpx] h-[78rpx]"
              src="/static/icon/account/order.svg"
              mode=""
            />
            <text class="mt-[14rpx] text-[14px]">排单管理</text>
          </view>
        </view>
      </view>
      <view
        class="w-[94%] bg-[#fff] mx-auto rounded-[8rpx] px-[26rpx] pt-[16rpx] mb-[16rpx]"
        v-show="role === 'admin'"
      >
        <view class="pb-[20rpx] border-b-2 border-[rgba(240,240,240,.4)]">
          <text class="text-[18px]">其他工具</text>
        </view>
        <view
          class="flex items-center justify-between py-[24rpx] border-b-2 border-[rgba(240,240,240,.4)]"
          @click="noOpen"
        >
          <view class="flex items-center">
            <up-icon name="hourglass" size="20" color="#333"></up-icon>
            <text class="ml-[16rpx] text-[14px] text-[#333]">材料统计</text>
          </view>
          <image
            src="/static/icon/arrow.svg"
            alt=""
            class="w-[48rpx] h-[48rpx]"
          />
        </view>
        <view
          class="flex items-center justify-between py-[24rpx]"
          @click="goUrl('/pages/staff/index')"
        >
          <view class="flex items-center">
            <up-icon name="account" size="20" color="#333"></up-icon>
            <text class="ml-[16rpx] text-[14px] text-[#333]">员工管理</text>
          </view>
          <image
            src="/static/icon/arrow.svg"
            alt=""
            class="w-[48rpx] h-[48rpx]"
          />
        </view>
      </view>
      <view
        class="w-[94%] bg-[#fff] mx-auto rounded-[8rpx] px-[26rpx] pt-[12rpx]"
      >
        <view class="pb-[20rpx] border-b-2 border-[rgba(240,240,240,.4)]">
          <text class="text-[18px]">帮助中心</text>
        </view>
        <view
          class="flex items-center justify-between py-[24rpx]"
          @click="goUrl('/pages/setting/index')"
        >
          <view class="flex items-center">
            <up-icon name="setting" color="#333" size="20"></up-icon>
            <text class="ml-[16rpx] text-[14px] text-[#333]">设置与隐私</text>
          </view>
          <image
            src="/static/icon/arrow.svg"
            alt=""
            class="w-[48rpx] h-[48rpx]"
          />
        </view>
      </view>
    </view>
    <Tabbar :page="2" />
  </view>
</template>
