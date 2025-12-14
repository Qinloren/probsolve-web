<script setup lang="ts">
import type { QuestionType } from "@/types/questions.type.ts";

defineProps<{ question: QuestionType }>();

const modelValue = defineModel<string>();
</script>

<template>
  <a-textarea
    v-model:value="modelValue"
    rows="4"
    placeholder="请输入答案"
  />
</template>
