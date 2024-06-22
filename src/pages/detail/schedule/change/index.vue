<script setup>
import { ref } from "vue";
import { editOrder } from "@/api";
import { onLoad } from "@dcloudio/uni-app";

const status = [
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
  {
    label: "出库",
    value: "OUTPUT",
  },
];
const checkIndex = ref(0);
const checkItem = ref("");
const uToastRef = ref(null);
const id = ref(0)

onLoad((option) => {
  id.value = option.id
  status.forEach((item,index) => {
    if(item.value == option.status){
      checkIndex.value = index
    }
  })
})

const change = (i) => {
  checkIndex.value = i;
  checkItem.value = status[i].value;
};

// 确定
const confirm = async () => {
  try {
    let params = {
      id:id.value,
      order_status: checkItem.value,
    };
    const result = await editOrder(params);
    if (result.code === 200) {
      uToastRef.value.show({
        type: "success",
        message: "修改成功",
        complete() {
          uni.navigateBack({
            delta: 2
          });
        },
      });
    }
  } catch (error) {}
};
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <view class="wrapper">
    <up-navbar
      title="修改状态"
      @rightClick="confirm"
      :autoBack="true"
      rightText="确定"
      fixed
      safeAreaInsetTop
      placeholder
    ></up-navbar>
    <view class="grid grid-cols-2 px-[48rpx] gap-2 mt-[40rpx]">
      <view
        :class="[
          'w-[316rpx] h-[144rpx] bg-[#fff] rounded-[8rpx] flex items-center justify-center text-[28px]',
          { box: index === checkIndex },
        ]"
        v-for="(item, index) in status"
        :key="index"
        @click="change(index)"
        >{{ item.label }}</view
      >
    </view>
  </view>
</template>

<style scoped>
.box {
  background: #2a82e4;
  color: #fff;
}
</style>
