<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { findDepot,getDraw } from "@/api";

const data = ref({
  page: 1,
  limit: 10,
  content: "",
  type: "",
  list: [],
  emptyShow: false,
});

// 获取搜索类型
onLoad((options) => {
  data.value.type = options.type;
});

// 搜索材料
const findMater = async () => {
  try {
    const result = await findDepot(data.value);
    if (result.code === 200) {
      data.value.list = [...data.value.list, ...result.data.list];
    }
  } catch (error) {}
};

// 搜索图纸
const findDraw = async () => {
  try {
    const result = await getDraw(data.value);
    if (result.code === 200) {
      data.value.list = [...data.value.list, ...result.data.list];
    }
  } catch (error) {}
};
// 确认搜索
const findInfo = () => {
  const searchType = data.value.type;
  if (searchType === "draw") {
    findDraw();
  } else if (searchType === "materials") {
    findMater();
  }
};

// 确认选择
const check = (val) => {
  uni.setStorageSync("content",JSON.stringify(val))
  uni.navigateBack();
}
</script>

<template>
  <view class="wrapper">
    <up-navbar :autoBack="true" fixed safeAreaInsetTop placeholder>
      <template #center>
        <up-search
          class="px-[100rpx]"
          placeholder="请输入要搜索的内容"
          v-model="data.content"
          clearabled
          :showAction="false"
          @search="findInfo"
          @custom="findInfo"
        ></up-search>
      </template>
    </up-navbar>
    <view
      class="h-[100rpx] bg-[#fff] leading-[100rpx] pl-[24rpx] border-t-2 border-[rgba(240,240,240,.4)]"
      v-for="item in data.list"
      :key="item.id"
      @click="check(item)"
    >
      <text>{{item.model || item.title}}</text>
    </view>
    <up-empty mode="search" v-show="data.emptyShow"></up-empty>
  </view>
</template>
