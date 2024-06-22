<script setup>
import { ref } from "vue";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { addDepot, editDepot,delDepot } from "@/api";

const form = ref({
  model: "",
  total: 0,
  lowest_num: 0,
  time: "",
});

let timeShow = ref(false);
let uToastRef = ref(null);
let modelShow = ref(false);

onLoad(() => {
  uni.$on("acceptData", (data) => {
    form.value = data;
  });
});
onUnload(() => {
  uni.$off("acceptData");
});

const confirm = () => {
  if(form.value.id){
    edit()
  }else{
    add()
  }
};

// 选择时间
const checkTime = ({ value }) => {
  timeShow.value = false;
  form.value.time = dayjs(value).format("YYYY-MM-DD");
};

// 编辑
const edit = async () => {
  try {
    const result = await editDepot(form.value);
    if (result.code === 200) {
      uToastRef.value.show({
        type: "success",
        message: "编辑成功",
        complete() {
          uni.navigateBack()
        },
      });
    }
  } catch (error) {}
};
// 添加
const add = async () => {
  try {
    const result = await addDepot(form.value);
    if (result.code === 200) {
      uToastRef.value.show({
        type: "success",
        message: "添加成功",
        complete() {
          uni.navigateBack()
        },
      });
    }
  } catch (error) {}
};
// 删除
const del = async () => {
  try {
    const result = await delDepot(form.value.id)
    if(result.code === 200){
      modelShow.value = false
      uToastRef.value.show({
        type: "success",
        message: "删除成功",
        complete() {
          uni.navigateBack()
        },
      });
    }
  } catch (error) {
    
  }
}
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <up-modal title="删除记录" content="您确定要删除此条记录吗？" showCancelButton :show="modelShow" :closeOnClickOverlay="true" @confirm="del" @cancel="modelShow = false"></up-modal>
  <up-navbar
    :title="form.id ? '编辑材料' : '新增材料'"
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
    <up-input
      placeholder="请输入型号"
      border="none"
      v-model="form.model"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">总数</text>
    <up-input
      placeholder="请输入总数"
      border="none"
      v-model="form.total"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">最低库存</text>
    <up-input
      placeholder="请输入最低库存"
      border="none"
      v-model="form.lowest_num"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">时间</text>
    <view
      class="flex items-center justify-between mt-[20rpx]"
      @click="timeShow = true"
    >
      <text class="text-[#ccc]" v-show="!form.time">请选择时间</text>
      <text v-show="form.time">{{ form.time }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[24rpx]"></view>
  </view>
  <view
    class="text-[#D43030] text-[18px] text-center mt-[120rpx]"
    v-show="form.id"
    @click="modelShow = true"
  >
    删除记录
  </view>
  <up-datetime-picker
    :show="timeShow"
    mode="date"
    @cancel="timeShow = false"
    @confirm="checkTime"
  ></up-datetime-picker>
</template>

<style scoped>
.uni-input-wrapper,
.uni-input-placeholder,
.uni-input-form,
.uni-input-input {
  font-size: 32rpx;
}
</style>
