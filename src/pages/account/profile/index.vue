<script setup>
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import {
  addProfile,
  getUserProfile,
  delImg,
  uploadImg,
  editProfile,
} from "@/api";
import { onLoad, onUnload } from "@dcloudio/uni-app";

const form = ref({
  name: "",
  identity_card: "",
  bank_card: "",
  phone: "",
  job_name: "",
  depart_name: "",
  entry_time: "",
  identity_photo: "",
  sex: "",
  sexModel: "",
  departModel: "",
  jobModel: ""
});
let timeShow = ref(false);
let uToastRef = ref(null);
let sexShow = ref(false);
let departShow = ref(false);
let jobShow = ref(false);

let fileList1 = ref([]);
let baseUrl = 'http://cow.czjscktd.com/staff/'
let userId = ref(null)

// 性别选项
const columns = reactive([
  [
    {
      label: "男",
      value: "MALE",
    },
    {
      label: "女",
      value: "FAMALE",
    },
  ],
]);
// 工作选项
const jobColumns = reactive([
  [
    {
      label: "人事科长",
      value: "PERSONSECTION",
    },
    {
      label: "财务科长",
      value: "FINANCE",
    },
    {
      label: "办公室",
      value: "OFFICE",
    },
    {
      label: "仓储部长",
      value: "STORAGE",
    },
    {
      label: "采购部长",
      value: "PURCHASING",
    },
    {
      label: "加工部长",
      value: "PROCESS",
    },
    {
      label: "销售一科长",
      value: "MARKETONE",
    },
    {
      label: "销售二科长",
      value: "MARKETTWO",
    },
    {
      label: "设计科长",
      value: "DESIGN",
    },
    {
      label: "食堂主管",
      value: "MESSHALL",
    },
    {
      label: "住宿主管",
      value: "PUTUP",
    },
    {
      label: "普工",
      value: "WORKER",
    },
  ],
]);
// 部门选项
const departColumns = reactive([
  [
    {
      label: "行政部",
      value: "ADMINISTRATION",
    },
    {
      label: "生产部",
      value: "PRODUCTION",
    },
    {
      label: "销售部",
      value: "MARKET",
    },
    {
      label: "后勤部",
      value: "LOGISTICS",
    },
  ],
]);

const add = async () => {
  try {
    // 判断参数
    for (const key in form.value) {
      if (!form.value[key]) {
        return uToastRef.value.show({
          type: "error",
          message: "有参数为空",
        });
      }
    }
    let result;
    if (form.value.id) {
      result = await editProfile(form.value);
    } else {
      form.value.user_id = userId.value
      result = await addProfile(form.value);
    }
    if (result.code === 200) {
      uToastRef.value.show({
        type: "success",
        message: "修改成功",
        complete() {
          uni.navigateBack();
        },
      });
    }
  } catch (error) {}
};
// 选择性别
const checkSex = (data) => {
  form.value.sexModel = data.value[0].label;
  form.value.sex = data.value[0].value;
  sexShow.value = false;
};
// 选择部门
const checkDepart = (data) => {
  form.value.departModel = data.value[0].label;
  form.value.depart_name = data.value[0].value;
  departShow.value = false;
};
// 选择工作
const checkJob = (data) => {
  form.value.jobModel = data.value[0].label;
  form.value.job_name = data.value[0].value;
  jobShow.value = false;
};
// 选择时间
const checkTime = ({ value }) => {
  timeShow.value = false;
  form.value.entry_time = dayjs(value).format("YYYY-MM-DD");
};
// 根据用户id查找
const getInfo = async (id) => {
  try {
    const result = await getUserProfile(id);
    if (result.code === 200) {
      if(result.msg === '暂无资料') return
      form.value = result.data;
      form.value.sexModel = result.data.sex === "FAMALE" ? "女" : "男";
      switch (result.data.depart_name) {
        case "ADMINISTRATION":
          form.value.departModel = "行政部";
          break;
        case "PRODUCTION":
          form.value.departModel = "生产部";
          break;
        case "MARKET":
          form.value.departModel = "销售部";
          break;
        case "LOGISTICS":
          form.value.departModel = "后勤部";
          break;
      }

      switch (result.data.job_name) {
        case "PERSONSECTION":
          form.value.jobModel = "人事科长";
          break;
        case "FINANCE":
          form.value.jobModel = "财务科长";
          break;
        case "OFFICE":
          form.value.jobModel = "办公室";
          break;
        case "STORAGE":
          form.value.jobModel = "仓储部长";
          break;
        case "PURCHASING":
          form.value.jobModel = "采购部长";
          break;
        case "PROCESS":
          form.value.jobModel = "加工部长";
          break;
        case "MARKETONE":
          form.value.jobModel = "销售一科长";
          break;
        case "MARKETTWO":
          form.value.jobModel = "销售二科长";
          break;
        case "DESIGN":
          form.value.jobModel = "设计科长";
          break;
        case "MESSHALL":
          form.value.jobModel = "食堂主管";
          break;
        case "PUTUP":
          form.value.jobModel = "住宿主管";
          break;
        case "WORKER":
          form.value.jobModel = "普工";
          break;
      }
    }
  } catch (error) {}
};
// 上传图片
const afterRead = async (file) => {
  try {
    uni.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      async success(res) {
        console.log(res);
        if (res.errMsg === "chooseImage:ok") {
          // 判断一下是否有照片
          if (form.value.identity_photo) {
            const result = await delImg(form.value.identity_photo);
            if (result.code == 200) {
              const img = await uploadImg(
                res.tempFiles[0],
                res.tempFilePaths[0]
              );
              if (img.code == 200) {
                form.value.identity_photo = img.msg;
              }
            }
          } else {
            const img = await uploadImg(res.tempFiles[0], res.tempFilePaths[0]);
            console.log(img);
            if (img.code == 200) {
              form.value.identity_photo = img.msg;
            }
          }
        }
      },
      fail(err) {
        uToastRef.value.show({
          type: "error",
          message: err,
        });
      },
    });
  } catch (error) {}
};

onLoad((option) => {
  if (Object.keys(option).indexOf("id") != -1) {
    getInfo(option.id);
    userId.value = option.id
  }
});
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <up-navbar
    title="个人资料"
    :autoBack="true"
    fixed
    safeAreaInsetTop
    placeholder
  >
  </up-navbar>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">姓名</text>
    <up-input
      placeholder="请输入姓名"
      border="none"
      v-model="form.name"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">性别</text>
    <view
      class="w-[100%] flex items-center justify-between mt-[20rpx]"
      @click="sexShow = true"
    >
      <text class="text-[#ccc] text-[16px]" v-show="!form.sexModel"
        >请选择性别</text
      >
      <text v-show="form.sexModel">{{ form.sexModel }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">身份证</text>
    <up-input
      placeholder="请输入身份证号"
      border="none"
      v-model="form.identity_card"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">银行卡</text>
    <up-input
      placeholder="请输入银行卡号"
      border="none"
      v-model="form.bank_card"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">手机号</text>
    <up-input
      placeholder="请输入手机号"
      border="none"
      v-model="form.phone"
      class="mt-[20rpx]"
    ></up-input>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">部门</text>
    <view
      class="w-[100%] flex items-center justify-between mt-[20rpx]"
      @click="departShow = true"
    >
      <text class="text-[#ccc] text-[16px]" v-show="!form.departModel"
        >请选择部门</text
      >
      <text v-show="form.departModel">{{ form.departModel }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">职位</text>
    <view
      class="w-[100%] flex items-center justify-between mt-[20rpx]"
      @click="jobShow = true"
    >
      <text class="text-[#ccc] text-[16px]" v-show="!form.jobModel"
        >请选择职位</text
      >
      <text v-show="form.jobModel">{{ form.jobModel }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">照片</text>
    <view class="w-[200rpx] h-[200rpx] mt-[20rpx]">
      <image
        class="w-[100%] h-[100%]"
        :src="baseUrl + form.identity_photo"
        mode=""
        v-show="form.identity_photo"
        @click="afterRead"
      />
      <image
        class="w-[100%] h-[100%]"
        src="/static/images/upload.png"
        mode=""
        v-show="!form.identity_photo"
        @click="afterRead"
      />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)] mt-[20rpx]"></view>
  </view>
  <view class="px-[32rpx] mt-[24rpx]">
    <text class="text-[#666] text-[12px]">入职时间</text>
    <view
      class="flex items-center justify-between mt-[20rpx] pb-[24rpx]"
      @click="timeShow = true"
    >
      <text class="text-[#ccc]" v-show="!form.entry_time">请选择入职时间</text>
      <text v-show="form.entry_time">{{ form.entry_time }}</text>
      <image src="/static/icon/arrow.svg" alt="" class="w-[48rpx] h-[48rpx]" />
    </view>
    <view class="h-[1px] bg-[rgba(240,240,240,.4)]"></view>
  </view>
  <view class="px-[20rpx] pb-[40rpx] pt-[40rpx]">
    <up-button text="保存" type="primary" @click="add"></up-button>
  </view>
  <up-picker
    :show="sexShow"
    :columns="columns"
    keyName="label"
    @confirm="checkSex"
    @cancel="sexShow = false"
  ></up-picker>
  <up-picker
    :show="departShow"
    :columns="departColumns"
    keyName="label"
    @confirm="checkDepart"
    @cancel="departShow = false"
  ></up-picker>
  <up-picker
    :show="jobShow"
    :columns="jobColumns"
    keyName="label"
    @confirm="checkJob"
    @cancel="jobShow = false"
  ></up-picker>
  <up-datetime-picker
    :show="timeShow"
    mode="date"
    @cancel="timeShow = false"
    @confirm="checkTime"
  ></up-datetime-picker>
</template>
