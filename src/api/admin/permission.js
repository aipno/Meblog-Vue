import instance from "@/axios";

export function getRolePermissionList(roleId) {
    return instance.post("/admin/permission/list", {roleId})
}
