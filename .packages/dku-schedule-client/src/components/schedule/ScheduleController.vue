<script lang="ts" setup>
import { Download, Search, Share } from "@element-plus/icons-vue";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
});

const condition = computed(() => `${props.year}-${props.semester}`);
const conditions = [
  { label: "2022년 1학기", value: "2022-1" },
  { label: "2022년 2학기", value: "2022-2" },
  { label: "2023년 1학기", value: "2023-1" },
];

const emit = defineEmits(["select-semester", "search", "share", "download"]);
</script>

<template>
  <div class="controller">
    <el-button-group>
      <el-button :icon="Search" @click="emit('search')" round plain>
        검색
      </el-button>

      <el-button
        v-for="{ label, value } in conditions"
        :type="value === condition ? 'primary' : 'default'"
        @click="emit('select-semester', value)"
        round
      >
        {{ label }}
      </el-button>
    </el-button-group>

    <el-button-group class="shares">
      <el-popover
        placement="top-start"
        :width="200"
        trigger="hover"
        content="클립보드에 시간표 URL을 복사합니다."
      >
        <template #reference>
          <el-button @click="emit('share')" :icon="Share" round plain>
            시간표 공유
          </el-button>
        </template>
      </el-popover>

      <el-popover
        placement="top-start"
        :width="200"
        trigger="hover"
        content="시간표 이미지를 다운로드합니다."
      >
        <template #reference>
          <el-button @click="emit('download')" :icon="Download" round plain>
            다운로드
          </el-button>
        </template>
      </el-popover>
    </el-button-group>
  </div>
</template>

<style lang="scss" scoped>
.controller {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 30px;
  display: flex;
  justify-content: center;
}

.shares {
  margin-left: 10px;
}
</style>
