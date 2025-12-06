<script setup>

</script>

<template>
  <footer class="bg-white relative z-40 border-t border-b border-gray-200 mt-5 dark:bg-[#0d1117] dark:border-gray-900">
    <div class="w-full mx-auto max-w-screen-2xl py-6 px-4 md:flex md:items-center md:justify-between">
            <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a class="hover:underline"
                                                                                            href="https://me.iswxl.cn/">aipno</a>. All Rights Reserved.
            </span>
      <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li class="mr-3">
          备案号：
          <a class="hover:underline" href="https://icp.gov.moe/?keyword=20250716">萌ICP备20250716号</a>
        </li>
        <li>
          <a class="mr-4 hover:underline md:mr-6 " href="https://beian.miit.gov.cn/">鲁ICP备2025142845号-1</a>
        </li>
        <li class="beian">
          <img src="@/assets/image/备案图标.png" style="width: 25px;height: 25px" alt="#">
          <a class="mr-4 hover:underline md:mr-6 "
             href="https://beian.mps.gov.cn/#/query/webSearch?code=37172402000442">鲁公网安备37172402000442号</a>
        </li>
      </ul>
    </div>
  </footer>
</template>


<style scoped>
li.beian img {
  float: left;
  width: 50%;
}
</style>