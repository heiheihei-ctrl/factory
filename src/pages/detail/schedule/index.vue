<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { orderDetail } from "@/api";
import { ref } from "vue";

const info = ref({});
let progress = ref(0);
let id = ref(0)

onLoad((option) => {
  id.value = option.id
  getInfo(option.id);
});

const getInfo = async (id) => {
  try {
    const result = await orderDetail(id);
    if (result.code === 200) {
      info.value = result.data;
    }
  } catch (error) {}
};

const rightClick = () => {
  uni.downloadFile({
    url: `http://cow.czjscktd.com/factory/${info.value.draw_info.title}`,
    success: function (res) {
      var filePath = res.tempFilePath;
      uni.openDocument({
        filePath: filePath,
        showMenu: true,
        success: function (res) {
          console.log("打开文档成功");
        },
        fail(err) {
          console.log("打开文档失败");
        },
      });
    },
  });
};
const goChange = () => {
  uni.navigateTo({
    url: `/pages/detail/schedule/change/index?id=${id.value}&status=${info.value.order_status}`,
  });
};
</script>

<template>
  <up-navbar
    title="订单详情"
    @rightClick="rightClick"
    :autoBack="true"
    rightText="预览"
    fixed
    safeAreaInsetTop
    placeholder
  ></up-navbar>
  <view class="px-[28rpx]">
    <view
      class="flex justify-between mt-[48rpx] border-b-2 border-[rgba(240,240,240,.4)] pb-[28rpx]"
    >
      <text class="text-[#666]">型号</text>
      <text class="text-[#333]">{{ info.draw_info?.title.split(".")[0] }}</text>
    </view>
    <view
      class="flex justify-between mt-[28rpx] border-b-2 border-[rgba(240,240,240,.4)] pb-[28rpx]"
    >
      <text class="text-[#666]">数量</text>
      <text class="text-[#333]">{{ info.order_num }}</text>
    </view>
    <view
      class="flex justify-between mt-[28rpx] border-b-2 border-[rgba(240,240,240,.4)] pb-[28rpx]"
    >
      <text class="text-[#666]">外观</text>
      <text class="text-[#333]">{{ info.color }}</text>
    </view>
    <view
      class="flex justify-between mt-[28rpx] border-b-2 border-[rgba(240,240,240,.4)] pb-[28rpx]"
    >
      <text class="text-[#666]">下单日期</text>
      <text class="text-[#333]">{{ info.order_time }}</text>
    </view>
    <view
      class="flex justify-between mt-[28rpx] border-b-2 border-[rgba(240,240,240,.4)] pb-[28rpx] mb-[40rpx]"
    >
      <text class="text-[#666]">当前进度</text>
      <text class="text-[#333]">
        <up-tag
          text="车铜"
          plain
          shape="circle"
          v-if="info.order_status === 'COPPER'"
        ></up-tag>
        <up-tag
          text="电泳"
          plain
          shape="circle"
          v-if="info.order_status === 'ELECTRO'"
        ></up-tag>
        <up-tag
          text="车铁"
          plain
          shape="circle"
          v-if="info.order_status === 'IRON'"
        ></up-tag>
        <up-tag
          text="合金外层"
          plain
          shape="circle"
          v-if="info.order_status === 'ALLOY'"
        ></up-tag>
        <up-tag
          text="上锡包装"
          plain
          shape="circle"
          v-if="info.order_status === 'KAMITIN'"
        ></up-tag>
        <up-tag
          text="出库"
          plain
          shape="circle"
          v-if="info.order_status === 'OUTPUT'"
        ></up-tag>
      </text>
    </view>
    <view
      class="flex flex-col justify-between mt-[28rpx] border-b-2 border-[rgba(240,240,240,.4)] pb-[28rpx] mb-[40rpx]"
    >
      <text class="text-[#666]">备注</text>
      <text class="text-[#333] block mt-[10rpx]">{{ info.order_remark }}</text>
    </view>
    <!-- <up-line-progress :percentage="progress" activeColor="#2A82E4"></up-line-progress> -->
    <up-button
      text="修改状态"
      type="primary"
      class="fixed"
      @click="goChange"
    ></up-button>
  </view>
</template>

<style scoped>
.u-button {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  bottom: 36px;
}
</style>
