import {ElMessage, ElMessageBox} from "element-plus";
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import NProgress from 'nprogress'

// 消息提示
export function showMessage(message = '操作失败', type = 'success', customClass = '') {
    return ElMessage({
        message,
        type: type,
        customClass
    })
}

// 显示页面加载Loading
export function showPageLoading() {
    NProgress.start()
}
// 隐藏页面加载Loading
export function hidePageLoading() {
    NProgress.done()
}

// 弹出确认框
export function showModel(content = '提示内容', type = 'warning', title = '') {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type,
        }
    )
}