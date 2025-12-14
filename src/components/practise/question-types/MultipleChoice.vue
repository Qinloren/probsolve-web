<script setup lang="ts">
import type { QuestionType } from "@/types/questions.type";

defineProps<{
  question: QuestionType;
}>();

const modelValue = defineModel<number[]>();
</script>

<template>
  <a-checkbox-group v-model:value="modelValue" class="question-options">
    <a-checkbox
      class="question-options-item"
      v-for="opt in question.options"
      :key="opt.index"
      :value="opt.index"
    >
<!--      {{ opt.key }}. {{ opt.value }}-->
      {{ opt.value }}
    </a-checkbox>
  </a-checkbox-group>
</template>

<style lang="scss">
@use "@/assets/scss/components/practise/question-types/ChoiceTrueFalse";
</style>
