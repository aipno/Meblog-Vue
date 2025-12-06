import axios from "@/axios";

// 上传文件
export function uploadFile(form) {
    return axios.post("/admin/file/upload", form)
}

// 获取可复用图片列表
export function findImageList() {
    return axios.post("/admin/image/list")
}

export function objectList() {
    return axios.post("/admin/file/object/list")
}