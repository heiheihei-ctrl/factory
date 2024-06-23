const baseUrl = import.meta.env.VITE_API_URL + "/api/v1"
// const baseUrl = "/api/v1"

export const request = ({url,method,data}) => {
	let header = {}
	
	uni.showLoading({
		title:'加载中...'
	})
	
	if(uni.getStorageSync("accessToken")){
		header = {
			Authorization:uni.getStorageSync("accessToken")
		}
	}
	return new Promise((resolve,reject) => {
		uni.request({
			url:baseUrl + url,
			method,
			data,
			header,
			success(res) {
				uni.hideLoading()
				if(res.data.code === 401){
					uni.clearStorageSync()
          uni.showToast({
            title:"账号或密码错误",
            icon:"error"
          })
					uni.reLaunch({
						url:"/pages/login/index"
					})
				}
				resolve(res.data)
			},
			fail(err) {
				uni.hideLoading()
				reject(err)
			}
		})
	})
}

