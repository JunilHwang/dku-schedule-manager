<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
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
  { label: "2021년 2학기", value: "2021-2" },
];

const emit = defineEmits(["select-semester", "search"]);
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
</style>
