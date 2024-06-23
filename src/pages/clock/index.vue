<script setup>
import Tabbar from "@/components/tabbar";
import { onShow } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { ref } from "vue";
import { addClock, clockStatus } from "@/api";
import _ from "lodash";

const uToastRef = ref(null);

let box = ref(null);
let box2 = ref(null);
let nowTime = ref(dayjs(new Date()).format("HH:mm:ss"));
let status = ref("");
let goTime = ref("");

// 查找状态
const findStatus = async () => {
  const result = await clockStatus();
  if (result.code == 200) {
    if (result.data.clock_type === "PUNCHOUT") {
      status.value = "GOWORK";
    } else {
      status.value = "AFTER";
    }
  } else {
    status.value = "GOWORK";
  }
};

// 记录时间
const recordsTime = _.debounce(async () => {
  try {
    uni.getLocation({
      async success({ longitude, latitude }) {
        console.log("当前位置的经度：" + longitude);
        console.log("当前位置的纬度：" + latitude);
        let params = {
          longitude,
          latitude,
        };
        // 判断当前状态
        params.clock_type = status.value === "GOWORK" ? "PUNCHIN" : "PUNCHOUT";
        const result = await addClock(params);
        if (result.code === 200) {
          uToastRef.value.show({
            type: "success",
            message: "打卡成功",
          });
          // box.value.style = "transform: rotateY(180deg)";
          // box2.value.style = "transform: translateX(-50%) rotateY(0);z-index:0";
          findStatus();
        }
      },
      fail(err) {
        uToastRef.value.show({
          type: "error",
          message: "获取定位失败",
        });
      },
    });
  } catch (error) {}
}, 500);

onShow(() => {
  setInterval(() => {
    nowTime.value = dayjs(new Date()).format("HH:mm:ss");
  }, 1000);
  findStatus();
});
</script>

<template>
  <up-toast ref="uToastRef"></up-toast>
  <section class="bg">
    <section class="cards">
      <section ref="box" class="box" @click="recordsTime">
        <p class="box_p">{{ status === "GOWORK" ? "上班" : "下班" }}打卡</p>
        <p class="time">{{ nowTime }}</p>
      </section>
      <section ref="box2" class="box2">
        <p class="box_p">打卡成功</p>
        <p class="time">{{ nowTime }}</p>
      </section>
    </section>
  </section>
  <Tabbar :page="1" />
</template>

<style scoped>
.bg_p {
  position: absolute;
  transition: all 1.5s;
}
.cards {
  position: relative;
}
.box2 {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(#00a3fe, #008efe);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 5px 20px #b3e9fd;
  cursor: pointer;
  transition: all 0.6s;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) rotateY(180deg);
  z-index: -1;
}
.title {
  font-size: 20px;
  margin: 20px 0 10px;
}
.charts-box {
  width: 100%;
  height: 260px;
}
.box {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(#00a3fe, #008efe);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 260rpx auto 0;
  box-shadow: 0 5px 20px #b3e9fd;
  cursor: pointer;
  transition: all 0.6s;
}
.box_p {
  font-size: 24px;
  margin: 0 0 6px;
  color: #fff;
}
.time {
  color: #72cff8;
}
</style>
