tem
<script setup>
import { ref } from "vue";
import { login } from "@/api";
import { onShow } from "@dcloudio/uni-app";

// 响应式表单数据
const form = ref({
  username: "",
  password: "",
});

// 校验规则
const rules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["blur", "change"],
    },
  ],
};

// 表单引用
const uFormRef = ref(null);
// 消息提示
const uToastRef = ref(null);

// 判断token
onShow(() => {
  if (uni.getStorageSync("accessToken")) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  }
});

// 登录
const loginConfirm = () => {
  uFormRef.value
    .validate()
    .then(async (valid) => {
      if (valid) {
        try {
          const result = await login(form.value);
          if (result.code === 200) {
            uni.setStorageSync("accessToken", result.data.token);
            uToastRef.value.show({
              type: "success",
              message: "登录成功",
              complete() {
                uni.switchTab({
                  url: "/pages/index/index",
                });
              },
            });
          } else {
            uToastRef.value.show({
              type: "error",
              message: "账号或密码错误",
            });
          }
        } catch (error) {
          uToastRef.value.show({
            type: "error",
            message: "账号或密码错误",
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <view class="wrapper">
    <view class="title"> 欢迎来到<br />湘利电子生产管理系统 </view>
    <view class="box">
      <view class="box_title"> 登录 </view>
      <up-form
        :model="form"
        ref="uFormRef"
        class="box_form"
        errorType="toast"
        :rules="rules"
      >
        <up-form-item prop="username">
          <view class="box_input">
            <up-input
              border="none"
              v-model="form.username"
              placeholder="请输入账号"
            />
          </view>
        </up-form-item>
        <up-form-item prop="password">
          <view class="box_input">
            <up-input
              type="password"
              border="none"
              v-model="form.password"
              placeholder="请输入密码"
            />
          </view>
        </up-form-item>
      </up-form>
      <up-button @click="loginConfirm" type="primary" shape="circle"
        >登录</up-button
      >
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  background: url("../../static/images/login.png") no-repeat;
  background-size: cover;
  background-position: 0 -300rpx;
  overflow: hidden;

  .title {
    color: #fff;
    font-weight: bold;
    font-size: 48rpx;
    margin: 148rpx 0 0;
    padding: 0 40rpx;
    position: relative;
  }

  .box {
    width: 100%;
    height: 60vh;
    box-sizing: border-box;
    background: #fff;
    border-radius: 40rpx 40rpx 0 0;
    padding: 40rpx;
    position: fixed;
    bottom: 0;

    .box_title {
      font-size: 40rpx;
      font-weight: bold;
    }

    .box_form {
      margin: 40rpx 0;

      ::v-deep .u-form-item__body[data-v-b4fd400b] {
        padding: 0;
      }

      .box_input {
        width: 100%;
        border: 1px solid #e6e6e6;
        border-radius: 48rpx;
        height: 112rpx;
        display: flex;
        padding: 0 0 0 48rpx;
        margin: 0 0 24rpx;
      }
    }
  }
}
</style>
