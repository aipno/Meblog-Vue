<template>
  <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :draggable="true"
      align-center
      class="wiki-catalog-dialog"
      title="编辑知识库目录"
      top="5vh"
      width="900px"
  >
    <div class="flex h-[65vh] border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700">

      <!-- 左侧：目录树区域 -->
      <div class="w-1/3 border-r border-gray-100 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
        <!-- 顶部工具栏 -->
        <div class="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span class="text-sm font-bold text-gray-600 dark:text-gray-300">目录结构</span>
          <el-tooltip :show-after="500" content="添加一级目录" placement="top">
            <el-button circle icon="Plus" plain size="small" type="primary" @click="addRootCatalog"></el-button>
          </el-tooltip>
        </div>

        <!-- 树形控件 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
          <el-tree
              ref="treeRef"
              :allow-drop="allowDrop"
              :data="catalogs"
              :expand-on-click-node="false"
              :props="defaultProps"
              default-expand-all
              draggable
              empty-text="暂无目录，请添加"
              highlight-current
              node-key="id"
              @node-click="handleNodeClick"
              @node-drop="handleDrop"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node flex-1 flex items-center justify-between pr-2 overflow-hidden group">
                <div class="flex items-center gap-1.5 truncate">
                  <el-icon v-if="data.level === 1" class="text-gray-400">
                    <Folder/>
                  </el-icon>
                  <el-icon v-else class="text-gray-400">
                    <Document/>
                  </el-icon>
                  <span :class="{'font-medium': data.level === 1}" class="truncate text-sm">{{ node.label }}</span>
                </div>

                <!-- 悬停显示操作按钮 -->
                <div class="hidden group-hover:flex items-center gap-1">
                  <el-tooltip v-if="data.level < 2" :show-after="800" content="添加子目录" placement="top">
                    <el-button link size="small" type="primary" @click.stop="addChildCatalog(data)">
                      <el-icon>
                        <Plus/>
                      </el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-popconfirm title="确定删除该目录吗?" @confirm="removeCatalog(node, data)">
                    <template #reference>
                      <el-button link size="small" type="danger" @click.stop>
                        <el-icon>
                          <Delete/>
                        </el-icon>
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧：编辑表单区域 -->
      <div class="flex-1 flex flex-col bg-white dark:bg-gray-800">
        <div v-if="currentCatalog.id" class="p-6 h-full flex flex-col">
          <div class="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div
                class="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <el-icon size="20">
                <EditPen/>
              </el-icon>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white">编辑节点</h3>
              <p class="text-xs text-gray-400">配置目录名称及关联文章</p>
            </div>
          </div>

          <el-form :model="currentCatalog" class="flex-1" label-position="top">
            <el-form-item label="目录名称">
              <el-input v-model="currentCatalog.title" maxlength="20" placeholder="请输入目录名称" show-word-limit/>
            </el-form-item>

            <el-form-item label="关联文章 ID (可选)">
              <el-input v-model="currentCatalog.articleId" clearable placeholder="输入文章ID，点击目录将跳转至该文章">
                <template #append>
                  <el-button icon="Search" @click="showSelectArticleDialog"/>
                </template>
              </el-input>
              <div class="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
                <el-icon class="mt-0.5">
                  <InfoFilled/>
                </el-icon>
                <span>若不关联文章，该目录仅作为折叠分组，不可点击查看详情。</span>
              </div>
            </el-form-item>

            <!-- 如果有排序号需求，可加 -->
            <!-- <el-form-item label="排序号">
                <el-input-number v-model="currentCatalog.sort" :min="0" />
            </el-form-item> -->
          </el-form>

          <div class="mt-auto flex justify-end pt-4">
            <el-button :disabled="!currentCatalog.title" type="primary" @click="updateCatalogTitle">更新当前节点
            </el-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-300">
          <el-icon class="mb-2" size="48">
            <check/>
          </el-icon> <!-- 用一个简单的图标占位 -->
          <p class="text-sm">请在左侧选择一个目录进行编辑</p>
        </div>
      </div>
    </div>

    <template #footer>
      <div
          class="dialog-footer flex justify-between items-center w-full px-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="text-xs text-gray-400">
          <el-icon class="align-middle mr-1">
            <Rank/>
          </el-icon>
          支持拖拽调整目录顺序
        </div>
        <div>
          <el-button @click="close">关闭</el-button>
          <el-button :loading="btnLoading" icon="Check" type="primary" @click="submit">保存所有更改</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {nextTick, ref} from 'vue'
import {getWikiCatalogs, updateWikiCatalogs} from "@/api/admin/wiki.js";
import {showMessage} from "@/composables/utils.js";
import {Check, Delete, Document, EditPen, Folder, InfoFilled, Plus, Rank} from '@element-plus/icons-vue'

// 弹窗显示控制
const dialogVisible = ref(false)
const btnLoading = ref(false)

// 知识库 ID
const wikiId = ref(null)
// 目录数据
const catalogs = ref([])

// 当前选中的目录节点
const currentCatalog = ref({
  id: null,
  title: '',
  articleId: '',
  level: 1,
  children: []
})

const treeRef = ref(null)

// 树形控件配置
const defaultProps = {
  children: 'children',
  label: 'title'
}

// 打开弹窗
const open = (id) => {
  wikiId.value = id
  dialogVisible.value = true
  initCatalogs()
}

// 初始化目录
const initCatalogs = () => {
  // 每次打开先清空选中状态
  currentCatalog.value = {}
  getWikiCatalogs(wikiId.value).then(res => {
    if (res.success) {
      catalogs.value = res.data || []
    }
  })
}

// 关闭弹窗
const close = () => {
  dialogVisible.value = false
}

// 节点点击事件
const handleNodeClick = (data) => {
  // 拷贝一份数据到表单，避免直接修改 tree 数据导致视图实时变动（虽然实时变动也行，但表单提交感更强）
  // 这里为了体验流畅，直接引用，实时更新 Tree 显示
  currentCatalog.value = data
}

// 更新节点标题 (其实因为引用关系，input 输入时 tree 已经变了，这个按钮主要用于心理确认或后续扩展校验)
const updateCatalogTitle = () => {
  if (!currentCatalog.value.title) return
  showMessage('节点信息已更新 (需点击底部保存生效)', 'success')
}

// 添加一级目录
const addRootCatalog = () => {
  const newCatalog = {
    id: Date.now(), // 临时 ID
    title: '新目录',
    articleId: null,
    level: 1,
    children: []
  }
  catalogs.value.push(newCatalog)
  // 自动选中新节点
  nextTick(() => {
    treeRef.value.setCurrentKey(newCatalog.id)
    currentCatalog.value = newCatalog
  })
}

// 添加子目录
const addChildCatalog = (data) => {
  const newCatalog = {
    id: Date.now(),
    title: '新子文章',
    articleId: null,
    level: data.level + 1,
    children: []
  }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newCatalog)
  // 展开父节点
  // treeRef.value.store.nodesMap[data.id].expanded = true

  // 自动选中
  nextTick(() => {
    treeRef.value.setCurrentKey(newCatalog.id)
    currentCatalog.value = newCatalog
  })
}

// 删除目录
const removeCatalog = (node, data) => {
  const parent = node.parent;
  const children = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.id === data.id);
  children.splice(index, 1);

  // 如果删除的是当前选中节点，重置表单
  if (currentCatalog.value.id === data.id) {
    currentCatalog.value = {}
  }
}

// 拖拽允许规则 (仅允许同级拖拽，或者限制层级深度，这里简单限制最大 2 级)
const allowDrop = (draggingNode, dropNode, type) => {
  // 简单的规则：一级目录不能拖入二级目录内部
  if (draggingNode.data.level === 1 && type === 'inner' && dropNode.data.level === 1) {
    return true // 允许一级变二级
  }
  if (draggingNode.data.level === 1 && type !== 'inner' && dropNode.data.level === 2) {
    return false // 一级不能变成二级的兄弟（即三级）- 假设只支持两级
  }
  return true
}

// 拖拽完成回调 (更新 level)
const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  // 递归更新层级
  const updateLevel = (nodes, level) => {
    nodes.forEach(node => {
      node.level = level
      if (node.children && node.children.length > 0) {
        updateLevel(node.children, level + 1)
      }
    })
  }
  updateLevel(catalogs.value, 1)
}

// 提交保存
const submit = () => {
  btnLoading.value = true
  updateWikiCatalogs(wikiId.value, catalogs.value).then(res => {
    if (res.success) {
      showMessage('目录结构保存成功')
      close()
    } else {
      showMessage(res.message, 'error')
    }
  }).finally(() => {
    btnLoading.value = false
  })
}

// 预留：选择文章弹窗
const showSelectArticleDialog = () => {
  showMessage('选择文章功能待开发', 'warning')
}

defineExpose({
  open
})
</script>

<style scoped>
/* 深度选择器定制 Element Plus 样式 */
:deep(.wiki-catalog-dialog) {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

:deep(.wiki-catalog-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

:deep(.dark .wiki-catalog-dialog .el-dialog__header) {
  border-bottom-color: #374151;
}

:deep(.wiki-catalog-dialog .el-dialog__body) {
  padding: 1.5rem;
}

:deep(.wiki-catalog-dialog .el-dialog__footer) {
  padding: 0 1.5rem 1.25rem 1.5rem;
}

/* Tree 样式美化 */
:deep(.el-tree-node__content) {
  height: 36px;
  border-radius: 6px;
  margin-bottom: 2px;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f3f4f6; /* bg-gray-100 */
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #e0f2fe; /* bg-sky-100 */
  color: #0284c7; /* text-sky-600 */
  font-weight: 500;
}

:deep(.dark .el-tree-node__content:hover) {
  background-color: #374151;
}

:deep(.dark .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #0c4a6e;
  color: #38bdf8;
}

/* 滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}
</style>