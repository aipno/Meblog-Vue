import axios from "@/axios";

// 获取邮箱验证码
export function getEmailCode(data) {
    return axios.post("/email/code", data)
}
