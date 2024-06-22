<script setup>
import { ref, reactive } from "vue";
import { onShow, onUnload, onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { addOrder, editOrder } from "@/api";

const form = ref({
  model: "",
  color: "",
  lowst_num: 0,
  is_quick: false,
  draw_name: "",
  check_time: "",
  show_status: "",
  draw_id: 0,
  order_num: 0,
  order_remark: "",
  order_time: "",
  order_status: "",
});

const columns = reactive([
  [
    {
      label: "车铜",
      value: "COPPER",
    },
    {
      label: "电泳",
      value: "ELECTRO",
    },
    {
      label: "车铁",
      value: "IRON",
    },
    {
      label: "合金外层",
      value: "ALLOY",
    },
    {
      label: "上锡包装",
      value: "KAMITIN",
    },
  ],
]);

let timeShow = ref(false);
let statusShow = ref(false);
let uToastRef = ref(null);

onShow(() => {
  if (uni.getStorageSync("content")) {
    const content = JSON.parse(uni.getStorageSync("content"));
    form.value.draw_name = content.title;
    form.value.draw_id = content.id;
  }
});
onUnload(() => {
  uni.removeStorageSync("content");
  uni.$off("acceptData");
});
onLoad(() => {
  uni.$on("acceptData", (data) => {
    form.value = data;
    if(data.is_quick){
      form.value.is_quick = true
    }else{
      form.value.is_quick = false
    }
  });
});
// 确定
const confirm = async () => {
  if (form.value.id) {
    edit();
  } else {
    add();
  }
};

const add = async () => {
  try {
    if (form.value.is_quick) {
      form.value.is_quick = 1;
    } else {
      form.value.is_quick = 0;
    }

    const result = await addOrder(form.value);
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
const edit = async () => {
  try {
    if (form.value.is_quick) {
      form.value.is_quick = 1;
    } else {
      form.value.is_quick = 0;
    }
   
    const result = await editOrder(form.value);
    if (result.code === 200) {
      uToastRef.value.show({
        type: "success",
        message: "编辑成功",
        complete() {
          uni.navigateBack();
        },
      });
    }
  } catch (error) {}
};

const change = () => {};

// 时间弹窗
const checkModel = () => {
  timeShow.value = true;
  form.value.check_time = new Date();
};
// 选择时间
const checkTime = ({ value }) => {
  timeShow.value = false;
  form.value.order_time = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
};
// 选择状态
const checkStatus = ({ value }) => {
  form.value.show_status = value[0].label;
  form.value.order_status = value[0].value;
  statusShow.value = false;
};

// 搜索
const goSearch = () => {
  uni.navigateTo({
    url: `/pages/search/check/index?type=draw`,
  });
};
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <up-navbar
    :title="form.id ? '编辑排单' : '新增排单'"
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
      <text v-show="form.draw_name">{{ form.draw_name }}</text>
      <text v-show="!form.draw_name" class="text-[#ccc]">请选择型号</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">数量</text>
    <up-input
      placeholder="请输入颜色"
      border="none"
      v-model="form.order_num"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">颜色</text>
    <up-input
      placeholder="请输入颜色"
      border="none"
      v-model="form.color"
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
      <text v-show="form.show_status">{{ form.show_status }}</text>
      <text v-show="!form.show_status" class="text-[#ccc]">请选择状态</text>
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
      <text class="text-[#ccc]" v-show="!form.order_time">请选择时间</text>
      <text v-show="form.order_time">{{ form.order_time }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">备注</text>
    <up-input
      placeholder="请输入备注"
      border="none"
      v-model="form.order_remark"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="flex px-[32rpx] mt-[24rpx] justify-between">
    <text class="text-[#666]">是否加急</text>
    <up-switch v-model="form.is_quick" @change="change"></up-switch>
  </view>
  <view
    class="text-[#D43030] text-[18px] text-center mt-[120rpx]"
    v-show="false"
  >
    删除记录
  </view>
  <up-datetime-picker
    :show="timeShow"
    v-model="form.check_time"
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
