import { request } from "@/utils/request";

// 员工状态
export const clockStatus = () => request({
  url: `/clock/status`,
  method: "GET"
})

// 员工打卡
export const addClock = (data) => request({
  url: `/clock/add`,
  method: "POST",
  data
})

// 编辑资料
export const editProfile = (data) => request({
  url: `/profile/edit`,
  method: "PUT",
  data
})

// 上传照片
export const uploadImg = (file, tempFile) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: '/api/v1/upload/add',
      filePath: tempFile,
      name: 'file',
      formData: {
        file
      },
      header: {
        Authorization: uni.getStorageSync("accessToken")
      },
      success(uploadFile) {
        resolve(JSON.parse(uploadFile.data))
      },
      fail(err){
        reject(err)
      }
    })
  })
}

// 删除照片
export const delImg = (key) => request({
  url: `/upload/del?key=${key}`,
  method: "DELETE"
})

// 查找所有员工
export const searchUser = ({ page, limit, content }) => request({
  url: `/user/find?page=${page}&limit=${limit}&content=${content}`,
  method: "GET"
})

// 查找所有员工
export const getAllUser = ({ page, limit }) => request({
  url: `/user/find?page=${page}&limit=${limit}`,
  method: "GET"
})

// 根据用户id查找资料
export const getUserProfile = (id) => request({
  url: `/profile/user/${id}`,
  method: "GET"
})

// 添加个人资料
export const addProfile = (data) => request({
  url: "/profile/add",
  method: "POST",
  data
})

// 退出登录
export const logout = () => request({
  url: `/logout`,
  method: "GET"
})

// 编辑排单
export const editOrder = (data) => request({
  url: `/order/edit`,
  method: "PUT",
  data
})

// 添加排单
export const addOrder = (data) => request({
  url: `/order/add`,
  method: "POST",
  data
})

// 排单详情
export const orderDetail = (id) => request({
  url: `/order/detail?id=${id}`,
  method: "GET"
})

// 搜索排单
export const searchOrder = ({ page, limit, content }) => request({
  url: `/order/search?page=${page}&limit=${limit}&content=${content}`,
  method: "GET"
})

// 查找排单
export const getOrder = ({ page, limit, type }) => request({
  url: `/order/find?page=${page}&limit=${limit}&type=${type}`,
  method: "GET"
})

// 查找图纸
export const getDraw = ({ page, limit, content }) => request({
  url: `/draw/find?page=${page}&limit=${limit}&content=${content}`,
  method: "GET"
})
// 查找出库
export const searchRecord = ({ page, limit, content }) => request({
  url: `/depot/record/find?page=${page}&limit=${limit}&content=${content}`,
  method: "GET"
})

// 查找出库
export const getRecord = ({ page, limit, type }) => request({
  url: `/depot/record/find?page=${page}&limit=${limit}&type=${type}`,
  method: "GET"
})

// 添加出库
export const addRecord = (data) => request({
  url: `/depot/record/add`,
  method: "POST",
  data
})

// 登录
export const login = (data) => request({
  url: "/login",
  method: "POST",
  data
})

// 查找用户信息
export const userDetail = () => request({
  url: "/user/detail",
  method: "GET"
})

// 查找材料
export const getAllDepot = ({ page, limit }) => request({
  url: `/depot/find?page=${page}&limit=${limit}`,
  method: "GET"
})

// 添加材料
export const addDepot = (data) => request({
  url: `/depot/add`,
  method: "POST",
  data
})

// 编辑材料
export const editDepot = (data) => request({
  url: `/depot/edit`,
  method: "PUT",
  data
})

// 删除材料
export const delDepot = (id) => request({
  url: `/depot/del/${id}`,
  method: "DELETE"
})

// 搜索材料
export const findDepot = ({ page, limit, content }) => request({
  url: `/depot/search?page=${page}&limit=${limit}&content=${content}`,
  method: "GET"
})