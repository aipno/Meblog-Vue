import instance from "@/axios";

// 登录接口
export function login(username, password) {
    return instance.post("/login", {username, password})
}

// 获取登录用户信息
export function getUserInfo() {
    return instance.post("/admin/user/info")
}

// 修改用户密码
export function updateAdminPassword(data) {
    return instance.post("/admin/password/update", data)
}

// 注册接口
export function register(data) {
    return instance.post("/register", data)
}

// 获取用户列表
export function getUserList() {
    return instance.post("/admin/user/list")
}

// 更新用户角色
export function updateUserRole(username, roleId) {
    return instance.post("/admin/user/role/change", {username, roleId})
}

// 更新用户详细权限
export function updateUserPermissions(userId, permissions) {
    return instance.post("/admin/user/update/permissions", {userId, permissions})
}

// 获取用户详细权限
export function getUserPermissions(userId) {
    return instance.post("/admin/user/permissions", {userId})
}

// 更改用户状态
export function updateUserStatus(userId, status) {
    return instance.post("/admin/user/status", {userId, status})
}

