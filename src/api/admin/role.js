import instance from "@/axios.js";

// 获取用户组
export function getRole() {
    return instance.post("/admin/role/list")
}

// 获取角色下的用户列表
export function getRoleUserList(roleId) {
    return instance.post("/admin/role/user", { roleId })
}

// 更新角色权限
export function updateRolePermissions(roleId, permissionIds) {
    return instance.post("/admin/role/permission/change", { roleId, permissionIds })
}
