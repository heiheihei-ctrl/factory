<script setup>
import { ref } from "vue";
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import {
  searchOrder,
  findDepot,
  searchRecord,
  getDraw,
  searchUser,
} from "@/api";
import Card from "@/components/card";
import modelCard from "@/components/modelCard";

onLoad((option) => {
  params.value.type = option.type;
  // 查找历史记录列表
  if (uni.getStorageSync("history")) {
    params.value.historyArr = JSON.parse(uni.getStorageSync("history"));
    params.value.historyShow = true;
  }
});

const params = ref({
  page: 1,
  limit: 10,
  content: "",
  type: "",
  list: [],
  historyArr: [],
  historyShow: false,
  emptyShow: false,
  cloShow: false,
  delIcon: true,
  loadStatus: "loading",
  loadShow: false,
});

// 触底刷新
onReachBottom(() => {
  params.value.page++;
  const searchType = params.value.type;
  if (searchType === "order") {
    findOrder();
  } else if (searchType === "materials") {
    findMater();
  } else if (searchType === "output") {
    findRecord();
  } else if (searchType === "draw") {
    findDraw();
  }
});
// 下拉加载
onPullDownRefresh(() => {
  params.value.page++;
  const searchType = params.value.type;
  if (searchType === "order") {
    findOrder();
  } else if (searchType === "materials") {
    findMater();
  } else if (searchType === "output") {
    findRecord();
  } else if (searchType === "draw") {
    findDraw();
  }
});

// 搜索订单
const findOrder = async () => {
  try {
    const result = await searchOrder(params.value);
    if (result.code === 200) {
      if (!result.data.list.length) {
        params.value.emptyShow = true;
      }
      params.value.list = [...params.value.list, ...result.data.list];
      params.value.content = "";
    }
  } catch (error) {}
};
// 搜索材料
const findMater = async () => {
  try {
    params.value.loadShow = true;
    const result = await findDepot(params.value);
    if (result.code === 200) {
      if (!result.data.list.length) {
        params.value.emptyShow = true;
        params.value.loadStatus = "nomore";
        params.value.loadShow = true;
      } else {
        params.value.list = [...params.value.list, ...result.data.list];
        params.value.loadShow = false;
      }
    }
  } catch (error) {}
};
// 搜索出库
const findRecord = async () => {
  try {
    params.value.loadShow = true;
    const result = await searchRecord(params.value);
    if (result.code === 200) {
      if (!result.data.list.length) {
        params.value.emptyShow = true;
        params.value.loadStatus = "nomore";
        params.value.loadShow = true;
      } else {
        params.value.list = [...params.value.list, ...result.data.list];
        params.value.loadShow = false;
      }
    }
  } catch (error) {}
};
// 搜索图纸
const findDraw = async () => {
  try {
    params.value.loadShow = true;
    const result = await getDraw(params.value);
    if (result.code === 200) {
      if (!result.data.list.length) {
        params.value.emptyShow = true;
        params.value.loadStatus = "nomore";
        params.value.loadShow = true;
      } else {
        params.value.list = [...params.value.list, ...result.data.list];
        params.value.loadShow = false;
      }
    }
  } catch (error) {}
};
// 搜索用户
const findUser = async () => {
  try {
    params.value.loadShow = true;
    const result = await searchUser(params.value);
    if (result.code === 200) {
      if (!result.data.list.length) {
        params.value.emptyShow = true;
        params.value.loadStatus = "nomore";
        params.value.loadShow = true;
      } else {
        params.value.list = [...params.value.list, ...result.data.list];
        params.value.loadShow = false;
      }
    }
  } catch (error) {}
};

// 确认搜索
const findInfo = () => {
  const searchType = params.value.type;
  params.value.list = [];
  if (uni.getStorageSync("history")) {
    const history = JSON.parse(uni.getStorageSync("history"));
    if (uni.getStorageSync("history").indexOf(params.value.content) == -1) {
      history.push(params.value.content);
    }
    uni.setStorageSync("history", JSON.stringify(history));
  } else {
    uni.setStorageSync("history", JSON.stringify([params.value.content]));
  }
  params.value.historyShow = false;
  if (searchType === "order") {
    findOrder();
  } else if (searchType === "materials") {
    findMater();
  } else if (searchType === "output") {
    findRecord();
  } else if (searchType === "draw") {
    findDraw();
  } else if (searchType === "staff") {
    findUser();
  }
};

const checkTag = (content) => {
  params.value.content = content;
  findInfo();
};

// 清空历史记录
const clearHistory = () => {
  uni.removeStorageSync("history");
  params.value.historyShow = false;
};

// 点击删除图标
const delTag = () => {
  params.value.cloShow = true;
  params.value.delIcon = false;
};
// 取消
const cancel = () => {
  params.value.delIcon = true;
  params.value.cloShow = false;
};

// 删除单个标签
const delSingle = (item) => {
  console.log(item);
  const list = params.value.historyArr;
  list.forEach((element, index) => {
    if (element === item) {
      list.splice(index, 1);
    }
  });
  uni.setStorageSync("history", JSON.stringify(list));
  if (!list.length) {
    params.value.historyShow = false;
  }
};

// 跳转
const goUrl = (url) => {
  uni.navigateTo({
    url,
  });
};
</script>

<template>
  <view class="wrapper">
    <up-navbar :autoBack="true" fixed safeAreaInsetTop placeholder>
      <template #center>
        <up-search
          class="px-[100rpx]"
          placeholder="请输入要搜索的内容"
          v-model="params.content"
          clearabled
          :showAction="false"
          @search="findInfo"
          @custom="findInfo"
        ></up-search>
      </template>
    </up-navbar>
    <view class="px-[40rpx]" v-show="params.historyShow">
      <view class="flex justify-between mt-[36rpx] items-center">
        <text>历史搜索</text>
        <image
          src="/static/icon/delete.svg"
          alt=""
          class="w-[40rpx] h-[40rpx]"
          @click="delTag"
          v-show="params.delIcon"
        />
        <view class="text-[#999] text-[12px]" v-show="!params.delIcon">
          <text @click="clearHistory">全部清除</text>
          <text class="mx-[20rpx]">|</text>
          <text @click="cancel">取消</text>
        </view>
      </view>
      <view class="mt-[24rpx]">
        <up-tag
          :text="item"
          color="#999"
          bgColor="rgba(240,240,240,.6)"
          borderColor="rgba(240,240,240,.6)"
          shape="circle"
          v-for="(item, index) in params.historyArr"
          :key="index"
          @click="checkTag(item)"
          class="mr-[20rpx]"
          :closable="params.cloShow"
          @close="delSingle(item)"
        ></up-tag>
      </view>
      <view
        class="text-center text-[12px] text-[#1A7BEB] mt-[24rpx]"
        @click="clearHistory"
      >
        清空历史记录
      </view>
    </view>
    <up-empty mode="search" v-show="params.emptyShow"></up-empty>
    <view v-if="params.type === 'order'">
      <Card :list="params.list" :type="params.type" />
    </view>
    <view v-show="params.type === 'materials'">
      <modelCard
        v-for="item in params.list"
        :key="item.id"
        :info="item"
        @detail="goDetail"
      />
      <up-loadmore :status="params.loadStatus" v-show="params.loadShow" />
    </view>
    <view v-show="params.type === 'output'">
      <view
        class="w-[95%] bg-[#fff] rounded-[8rpx] mx-auto mt-[16rpx] p-[28rpx]"
        v-for="item in params.list"
        :key="item.id"
      >
        <view class="flex justify-between items-start">
          <view class="flex items-center">
            <text class="text-[18px] font-bold">{{
              item.depot_info?.model
            }}</text>
          </view>
          <text
            class="text-[#D43030] font-bold text-[20px]"
            v-show="item.enter_type === 'DECREASE'"
            >{{ item.out_num }}</text
          >
          <text
            class="text-[#00BAAD] font-bold text-[20px]"
            v-show="item.enter_type === 'INCREASE'"
            >{{ item.out_num }}</text
          >
        </view>
        <view class="text-[12px] text-[#999] mt-[12rpx]">
          日期：{{ item.time }}
        </view>
      </view>
    </view>
    <view v-show="params.type === 'draw'">
      <view
        class="w-[95%] bg-[#fff] rounded-[8rpx] mx-auto mt-[16rpx] p-[28rpx]"
        v-for="item in params.list"
        :key="item.id"
      >
        <view class="flex justify-between items-start">
          <view class="flex items-center">
            <text class="text-[18px] font-bold">{{ item.title }}</text>
          </view>
          <text class="text-[#2A82E4]" @click="goFile(item.title)"
            >查看图纸</text
          >
        </view>
        <view class="text-[14px] text-[#666]"> 备注：{{ item.remark }} </view>
        <view class="text-[12px] text-[#999] mt-[12rpx]">
          日期：{{ item.create_at }}
        </view>
      </view>
    </view>
    <view v-show="params.type === 'staff'">
      <view class="w-[95%] bg-[#fff] rounded-[8rpx] mx-auto mt-[16rpx] p-[28rpx]" v-for="item in params.list" :key="item.id">
        <view class="flex justify-between items-start">
          <view
            class="flex justify-between w-[100%]"
            @click="goUrl(`/pages/staff/newly/index?id=${item.id}`)"
          >
            <text class="text-[18px] font-bold">{{ item.username }}</text>
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'PERSONSECTION'
              "
              >人事科长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'FINANCE'
              "
              >财务科长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'OFFICE'
              "
              >办公室</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'STORAGE'
              "
              >仓储部长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'PURCHASING'
              "
              >采购部长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'PROCESS'
              "
              >加工部长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'MARKETONE'
              "
              >销售一科长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'MARKETTWO'
              "
              >销售二科长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'DESIGN'
              "
              >设计科长</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'MESSHALL'
              "
              >食堂主管</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'PUTUP'
              "
              >住宿主管</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="
                item.profile_info?.job_name &&
                item.profile_info?.job_name == 'WORKER'
              "
              >普工</text
            >
            <text
              class="text-[#D43030] font-bold text-[18px]"
              v-show="!item.profile_info?.job_name"
              >暂无职位</text
            >
          </view>
        </view>
        <view
          class="text-[12px] text-[#999] mt-[12rpx]"
          v-if="item.profile_info?.entry_time"
        >
          入职时间：{{ item?.profile_info?.entry_time }}
        </view>
        <view class="text-[12px] text-[#999] mt-[12rpx]" v-else>
          入职时间：暂无</view
        >
      </view>
    </view>
  </view>
</template>

<style scoped>
.u-empty[data-v-bd84101d] {
  padding: 240rpx 0 0;
}
</style>
