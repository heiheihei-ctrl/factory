<script setup>
import { reactive, ref } from "vue";
import { onShow, onUnload } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { addRecord } from "@/api";

onShow(() => {
  if (uni.getStorageSync("content")) {
    const content = JSON.parse(uni.getStorageSync("content"));
    form.value.model_name = content.model;
    form.value.material_id = content.id;
  }
});
onUnload(() => {
  uni.removeStorageSync("content");
});

const form = ref({
  material_id: 0,
  out_num: 0,
  enter_type: "",
  time: "",
  model_name: "",
  model_status: "",
  model_time: "",
});
const columns = reactive([
  [
    {
      label: "出库",
      value: "DECREASE",
    },
    {
      label: "入库",
      value: "INCREASE",
    },
  ],
]);

let timeShow = ref(false);
let statusShow = ref(false);
let uToastRef = ref(null);

// 确定
const confirm = async () => {
  try {
    const result = await addRecord(form.value);
    if (result.code === 200) {
      uToastRef.value.show({
        type: "success",
        message: "添加成功",
        complete() {
          uni.navigateBack();
        },
      });
    }
  } catch (error) {}
};

// 时间弹窗
const checkModel = () => {
  timeShow.value = true;
  form.value.model_time = new Date();
};
// 选择时间
const checkTime = ({ value }) => {
  console.log(value);
  timeShow.value = false;
  form.value.time = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
};
// 选择状态
const checkStatus = ({ value }) => {
  form.value.model_status = value[0].label;
  form.value.enter_type = value[0].value;
  statusShow.value = false;
};

// 搜索
const goSearch = () => {
  uni.navigateTo({
    url: `/pages/search/check/index?type=materials`,
  });
};
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <up-navbar
    title="新增出库"
    :autoBack="true"
    fixed
    safeAreaInsetTop
    placeholder
    rightText="确定"
    @rightClick="confirm"
  >
  </up-navbar>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">型号</text>
    <view
      class="flex items-center justify-between mt-[20rpx]"
      @click="goSearch"
    >
      <text v-show="form.model_name">{{ form.model_name }}</text>
      <text v-show="!form.model_name" class="text-[#ccc]">请选择型号</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">数量</text>
    <up-input
      placeholder="请输入数量"
      border="none"
      v-model="form.out_num"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">状态</text>
    <view
      class="flex items-center justify-between mt-[20rpx]"
      @click="statusShow = true"
    >
      <text class="text-[#ccc]" v-show="!form.model_status">请选择状态</text>
      <text v-show="form.model_status">{{ form.model_status }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">时间</text>
    <view
      class="flex items-center justify-between mt-[20rpx]"
      @click="checkModel"
    >
      <text class="text-[#ccc]" v-show="!form.time">请选择时间</text>
      <text v-show="form.time">{{ form.time }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view
    class="text-[#D43030] text-[18px] text-center mt-[120rpx]"
    v-show="false"
  >
    删除记录
  </view>
  <up-datetime-picker
    :show="timeShow"
    v-model="form.model_time"
    mode="datetime"
    @cancel="timeShow = false"
    @confirm="checkTime"
  ></up-datetime-picker>
  <up-picker
    :show="statusShow"
    :columns="columns"
    keyName="label"
    @cancel="statusShow = false"
    @confirm="checkStatus"
  ></up-picker>
</template>

<style scoped>
.uni-input-wrapper,
.uni-input-placeholder,
.uni-input-form,
.uni-input-input {
  font-size: 32rpx;
}
</style>
