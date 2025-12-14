<script setup lang="ts">
import type { QuestionType } from "@/types/questions.type";

defineProps<{
  question: QuestionType;
}>();

const modelValue = defineModel<number | null>();
</script>

<template>
  <a-radio-group v-model:value="modelValue" class="question-options">
    <a-radio
      class="question-options-item"
      v-for="opt in question.options"
      :key="opt.index"
      :value="opt.index"
    >
<!--      {{ opt.key }}. {{ opt.value }}-->
      {{ opt.value }}
    </a-radio>
  </a-radio-group>
</template>

<style lang="scss">
@use "@/assets/scss/components/practise/question-types/ChoiceTrueFalse";
</style>
