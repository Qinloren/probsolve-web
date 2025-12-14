<script setup lang="ts">
import type { QuestionType } from "@/types/questions.type.ts";

defineProps<{ question: QuestionType }>();

const modelValue = defineModel<number>();
</script>

<template>
  <a-radio-group v-model:value="modelValue" class="question-options">
    <a-radio class="question-options-item" :value="1">正确</a-radio>
    <a-radio class="question-options-item" :value="0">错误</a-radio>
  </a-radio-group>
</template>

<style lang="scss">
@use "@/assets/scss/components/practise/question-types/ChoiceTrueFalse";
</style>
