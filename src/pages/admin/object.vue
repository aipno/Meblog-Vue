<template>
  <div>
    <!-- 表头分页查询条件 -->
    <el-card class="mb-5" shadow="never">
      <div class="flex items-center">
        <el-text>文件名</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchFileName" placeholder="请输入文件名（模糊查询）"/>
        </div>

        <el-text>上传日期</el-text>
        <div class="ml-3 w-30 mr-5">
          <el-date-picker
              v-model="pickDate"
              :shortcuts="shortcuts"
              end-placeholder="结束时间"
              range-separator="至"
              size="default"
              start-placeholder="开始时间"
              type="daterange"
              @change="datepickerChange"
          />
        </div>

        <el-button :icon="Search" class="ml-3" type="primary" @click="getTableData">
          查询
        </el-button>
        <el-button :icon="RefreshRight" class="ml-3" @click="reset">
          重置
        </el-button>
      </div>
    </el-card>

    <el-card shadow="never">
      <!-- 上传按钮 -->
      <div class="mb-5">
        <el-button type="primary" @click="uploadFileBtnClick">
          <el-icon class="mr-1">
            <Upload />
          </el-icon>
          上传文件
        </el-button>
      </div>

      <!-- 文件列表 -->
      <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          stripe
          style="width: 100%"
      >
        <el-table-column label="预览" width="100">
          <template #default="scope">
            <div v-if="isImage(scope.row.fileName)" class="flex justify-center items-center">
              <el-image
                  :initial-index="getImageIndex(scope.row)"
                  :preview-src-list="getImagePreviewList()"
                  :preview-teleported="true"
                  :src="getImageSrc(scope.row)"
                  class="w-16 h-16 cursor-pointer"
                  fit="cover"
                  hide-on-click-modal
                  preview-teleported
              >
                <template #placeholder>
                  <div class="flex items-center justify-center w-full h-full bg-gray-100">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div v-else class="flex justify-center items-center">
              <el-icon :size="32">
                <Document />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件名" prop="fileName" width="250" />
        <el-table-column label="文件大小" prop="fileSize" width="120">
          <template #default="scope">
            {{ formatFileSize(scope.row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="文件类型" prop="contentType" width="150" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="downloadFile(scope.row)">
              <el-icon class="mr-1">
                <Download />
              </el-icon>
              下载
            </el-button>
            <el-button size="small" type="danger" @click="deleteFileSubmit(scope.row)">
              <el-icon class="mr-1">
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-10 flex justify-center">
        <el-pagination
            v-model:current-page="current"
            v-model:page-size="size"
            :background="true"
            :page-sizes="[10, 20, 50]"
            :small="false"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="getTableData"
        />
      </div>
    </el-card>

    <!-- 上传文件对话框 -->
    <el-dialog v-model="uploadFileDialogVisible" title="上传文件" width="500">
      <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          accept="*/*"
          action="#"
          class="w-full"
          drag
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadFileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 对象存储管理页面
 * 提供文件的上传、下载、删除、预览等功能
 */

// 引入所需图标
import {
  Delete,
  Document,
  Download,
  Picture,
  RefreshRight,
  Search,
  Upload,
  UploadFilled
} from '@element-plus/icons-vue'

// 引入依赖
import { reactive, ref } from 'vue'
import moment from 'moment'

// 引入工具函数
import { showMessage, showModel } from '@/composables/utils'

// 引入API接口
import { objectList, uploadFile } from '@/api/admin/file'

// ========== 数据相关 ==========

// 搜索相关
const searchFileName = ref('')
const pickDate = ref('')

// 查询条件：开始结束时间
const startDate = reactive({})
const endDate = reactive({})

// 表格相关
const tableLoading = ref(false)
const tableData = ref([])
const current = ref(1)
const total = ref(0)
const size = ref(10)

// 上传文件相关
const uploadFileDialogVisible = ref(false)
const uploadRef = ref()

// ========== 方法相关 ==========

/**
 * 日期选择器变更事件处理
 * @param {Array} e - 选择的日期范围
 */
const datepickerChange = (e) => {
  // 检查日期是否有效
  if (!e || e.length !== 2) {
    startDate.value = null
    endDate.value = null
    return
  }

  startDate.value = moment(e[0]).format('YYYY-MM-DD')
  endDate.value = moment(e[1]).format('YYYY-MM-DD')
}

/**
 * 每页展示数量变更事件处理
 * @param {Number} chooseSize - 选择的页面大小
 */
const handleSizeChange = (chooseSize) => {
  // 检查参数是否有效
  if (!chooseSize || typeof chooseSize !== 'number') return

  size.value = chooseSize
  getTableData()
}

/**
 * 重置查询条件
 */
const reset = () => {
  searchFileName.value = ''
  pickDate.value = ''
  startDate.value = null
  endDate.value = null
  getTableData() // 重置后重新加载数据
}

/**
 * 获取文件列表数据
 */
function getTableData() {
  // 显示表格 loading
  tableLoading.value = true
  objectList()
      .then(res => {
        // 检查 res.data 是否存在且为数组
        if (res && res.data && Array.isArray(res.data)) {
          tableData.value = res.data.map(item => ({
            id: item.id,
            fileName: item.fileName,
            fileSize: item.fileSize,
            contentType: item.contentType,
            previewData: item.previewData,
            url: item.url,
          }))
          // 更新总数
          total.value = res.data.length
        } else {
          // 如果数据不存在或不是数组，则清空表格数据
          tableData.value = []
          total.value = 0
          console.warn('API 返回的数据格式不正确:', res)
        }
      }).catch(error => {
    console.error('获取对象列表失败:', error)
    showMessage(error.message || '操作失败', 'error')
    // 发生错误时清空表格数据
    tableData.value = []
    total.value = 0
  }).finally(() => {
    tableLoading.value = false
  })
}

/**
 * 页面加载时初始化数据
 */
getTableData()

// 日期快捷选项
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = moment().subtract(3, 'months').toDate()
      return [start, end]
    },
  },
]

/**
 * 上传文件按钮点击事件
 */
// const uploadFileBtnClick = () => {
//   uploadFileDialogVisible.value = true
// }

/**
 * 处理文件选择事件
 * @param {Object} file - 选择的文件对象
 */
const handleFileChange = (file) => {
  // 检查文件是否有效
  if (!file) {
    console.warn('选择的文件无效')
    return
  }
  console.log('选择文件:', file)
}

/**
 * 处理文件数量超出限制事件
 */
const handleExceed = () => {
  showMessage('只能上传一个文件', 'warning')
}

/**
 * 处理文件移除事件
 * @param {Object} file - 移除的文件对象
 */
const handleRemove = (file) => {
  // 检查文件是否有效
  if (!file) {
    console.warn('移除的文件无效')
    return
  }
  console.log('移除文件:', file)
}

/**
 * 提交文件上传
 */
const submitUpload = () => {
  // 检查上传引用是否存在
  if (!uploadRef.value) {
    showMessage('上传组件未初始化', 'error')
    return
  }

  // 检查是否有文件待上传
  if (!uploadRef.value.uploadFiles || uploadRef.value.uploadFiles.length === 0) {
    showMessage('请选择要上传的文件', 'warning')
    return
  }

  uploadRef.value.submit()
  uploadFile(uploadRef.value.uploadFiles[0].raw)
      .then(res => {
        // 检查响应是否有效
        if (!res) {
          throw new Error('服务器响应为空')
        }

        if (res.success) {
          showMessage('上传成功')
          uploadFileDialogVisible.value = false
          getTableData()
        } else {
          showMessage(res.message || '上传失败', 'error')
        }
      })
      .catch(err => {
        console.error('上传错误:', err)
        showMessage(err.message || '上传失败', 'error')
      })
}

/**
 * 下载文件
 * @param {Object} row - 文件信息
 */
const downloadFile = (row) => {
  // 检查参数是否有效
  if (!row) {
    showMessage('文件信息无效', 'warning')
    return
  }

  showMessage('下载功能待实现', 'warning')
}

/**
 * 删除文件确认
 * @param {Object} row - 文件信息
 */
const deleteFileSubmit = (row) => {
  // 检查参数是否有效
  if (!row) {
    showMessage('文件信息无效', 'warning')
    return
  }

  showModel('是否确定要删除该文件？')
      .then(() => {
        // 模拟删除操作
        showMessage('删除成功')
        getTableData()
      })
      .catch(() => {
        console.log('取消删除')
      })
}

/**
 * 格式化文件大小显示
 * @param {Number} size - 文件大小（字节）
 * @returns {String} 格式化后的文件大小
 */
const formatFileSize = (size) => {
  // 检查参数是否有效
  if (size === null || size === undefined || isNaN(size)) return '0 B'

  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

/**
 * 判断是否为图片类型
 * @param {String} fileName - 文件名
 * @returns {Boolean} 是否为图片
 */
const isImage = (fileName) => {
  if (!fileName || typeof fileName !== 'string') return false
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico']
  const extension = fileName.split('.').pop().toLowerCase()
  return imageExtensions.includes(extension)
}

/**
 * 获取图片预览列表
 * @returns {Array} 图片预览URL列表
 */
const getImagePreviewList = () => {
  // 检查数据是否有效
  if (!tableData.value || !Array.isArray(tableData.value)) return []

  // 获取所有图片类型的文件
  const imageRows = tableData.value.filter(item => isImage(item.fileName))
  return imageRows.map(item => getImageSrc(item))
}

/**
 * 获取当前图片在预览列表中的索引
 * @param {Object} row - 当前行数据
 * @returns {Number} 图片索引
 */
const getImageIndex = (row) => {
  // 检查参数是否有效
  if (!row || !row.id) return 0

  const imageRows = tableData.value.filter(item => isImage(item.fileName))
  const index = imageRows.findIndex(item => item.id === row.id)
  // 如果找不到索引，默认返回0
  return index >= 0 ? index : 0
}

/**
 * 获取图片的URL
 * @param {Object} row - 行数据
 * @returns {String} 图片URL
 */
const getImageSrc = (row) => {
  // 检查参数是否有效
  if (!row) return ''
  // 优先使用url字段，如果没有则使用原来的base64数据
  if (row.url) return row.url
  if (!row.previewData) return ''
  if (!row.contentType) return ''

  return `data:${row.contentType};base64,${row.previewData}`
}


/**
 * 上传文件按钮点击事件
 */
const uploadFileBtnClick = () => {
  uploadFileDialogVisible.value = true
}
</script>