<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
</script>

<template>
  <div>
    <el-button
      type="primary"
      :icon="Search"
      round
      plain
    >
      수업 목록에서 검색
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
div {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 30px;
  display: flex;
  justify-content: center;
}
</style>