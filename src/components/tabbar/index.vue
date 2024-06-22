<script setup>
import { ref, defineProps } from "vue";
const props = defineProps(["page"]);
const page = props.page;

const click = (i) => {
  console.log(i);
  let url = "";
  if (i == 1) {
    url = "/pages/clock/index";
  } else if(i == 2){
    url = "/pages/account/index";
  }else{
    url = "/pages/index/index"
  }

  uni.switchTab({
    url,
  });
};

const chagne = (e) => {
  console.log(e);
};
</script>

<template>
  <up-tabbar
    :value="page"
    @change="change"
    :fixed="true"
    :placeholder="true"
    :safeAreaInsetBottom="true"
    :border="false"
  >
    <up-tabbar-item text="首页" @click="click">
      <template #active-icon>
        <image
          class="w-[48rpx] h-[48rpx]"
          src="/static/icon/tabbar/home-active.svg"
        ></image>
      </template>
      <template #inactive-icon>
        <image
          class="w-[48rpx] h-[48rpx]"
          src="/static/icon/tabbar/home.svg"
        ></image>
      </template>
    </up-tabbar-item>
    <up-tabbar-item text="打卡" @click="click">
      <template #active-icon>
        <image
          class="w-[48rpx] h-[48rpx]"
          src="/static/icon/tabbar/work-active.svg"
        ></image>
      </template>
      <template #inactive-icon>
        <image
          class="w-[48rpx] h-[48rpx]"
          src="/static/icon/tabbar/work.svg"
        ></image>
      </template>
    </up-tabbar-item>
    <up-tabbar-item text="我的" @click="click">
      <template #active-icon>
        <image
          class="w-[56rpx] h-[56rpx]"
          src="/static/icon/tabbar/profile-active.svg"
        ></image>
      </template>
      <template #inactive-icon>
        <image
          class="w-[56rpx] h-[56rpx]"
          src="/static/icon/tabbar/profile.svg"
        ></image>
      </template>
    </up-tabbar-item>
  </up-tabbar>
</template>
