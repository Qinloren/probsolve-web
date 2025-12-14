<script setup lang="ts">
import { computed, ref, watch, type Component } from "vue";
import type { QuestionType } from "@/types/questions.type";

import SingleChoice from "./question-types/SingleChoice.vue";
import MultipleChoice from "./question-types/MultipleChoice.vue";
import TrueFalse from "./question-types/TrueFalse.vue";
import FillBlank from "./question-types/FillBlank.vue";
import ShortAnswer from "./question-types/ShortAnswer.vue";

/**
 * Props
 */
const props = defineProps<{
  question: QuestionType;
  showAnalysis: boolean;
  showNext: boolean;
  isFirst: boolean;
  currentIndex: number;
}>();

/**
 * Emits
 */
const emit = defineEmits<{
  (e: "submit", answer: number | number[] | string | string[]): void;
  (e: "next"): void;
  (e: "prev"): void;
}>();

/**
 * 当前题目的作答
 */
const answer = ref<number | number[] | string | string[] | null>(null);

/**
 * 切题时重置答案（非常关键）
 */
watch(
  () => props.question.id,
  () => {
    answer.value = null;
  },
  { immediate: true },
);

/**
 * 题型组件映射（无 any）
 */
const componentMap: Record<number, Component> = {
  1: SingleChoice,
  2: MultipleChoice,
  3: TrueFalse,
  4: FillBlank,
  5: ShortAnswer,
};

/**
 * 当前题型组件
 */
const currentComponent = computed<Component | null>(() => {
  return componentMap[props.question.type] ?? null;
});

/**
 * 提交
 */
const submit = () => {
  if (answer.value === null) return;
  emit("submit", answer.value);
};

/**
 * 题型文本映射
 */
const typeLabelMap: Record<number, string> = {
  1: "单选题",
  2: "多选题",
  3: "判断题",
  4: "填空题",
  5: "简答题",
};
</script>

<template>
  <div class="question-container" :class="{
      'question-single-choice': question.type === 1,
      'question-multiple-choice': question.type === 2,
      'question-trueOrFalse': question.type === 3,
      'question-fill': question.type === 4,
      'question-short-answer': question.type === 5
    }"
  >
    <!-- 题干 -->
    <div class="question-header">
      <h3>第{{ currentIndex + 1 }}题（{{ typeLabelMap[question.type] ?? '未知题型' }}）</h3>
      <p v-if="question.difficulty">
        <span>难度：</span>
        <a-tag color="green" v-if="question.difficulty === 1">简</a-tag>
        <a-tag color="orange" v-else-if="question.difficulty === 2">中</a-tag>
        <a-tag color="red" v-else>难</a-tag>
      </p>
    </div>

    <!-- 题干内容 -->
    <p class="question-title" v-if="question.type !== 4" v-html="question.content"></p>
    <!-- 填空题交给 FillBlank 组件处理，内部渲染 a-input -->

    <!-- 题型组件渲染 -->
    <div class="question-content">
      <component
        v-if="currentComponent"
        :is="currentComponent"
        :question="question"
        v-model="answer"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="question-actions">
      <a-button
        v-if="!isFirst"
        @click="$emit('prev')"
      >上一题</a-button>

      <div>
        <a-button
          v-if="!showNext"
          type="primary"
          @click="submit"
        >提交答案</a-button>

        <a-button
          v-else
          type="primary"
          @click="$emit('next')"
        >下一题</a-button>
      </div>
    </div>

    <!-- 答案解析 -->
    <div v-if="showAnalysis" class="question-analysis">
      <h4>答案解析</h4>
      <div v-html="question.analysis" />
    </div>
  </div>
  <!--  <div class="question-container">-->
<!--    &lt;!&ndash; 题干 &ndash;&gt;-->
<!--    <div class="question-title">-->
<!--      <strong>【{{ typeLabelMap[question.type] ?? "未知题型" }}】</strong>-->
<!--      <span v-html="question.content" />-->
<!--    </div>-->

<!--    &lt;!&ndash; 题型渲染 &ndash;&gt;-->
<!--    <component-->
<!--      v-if="currentComponent"-->
<!--      :is="currentComponent"-->
<!--      :question="question"-->
<!--      v-model="answer"-->
<!--    />-->

<!--    &lt;!&ndash; 操作 &ndash;&gt;-->
<!--    <div class="question-actions">-->
<!--      <a-button-->
<!--        v-if="!isFirst"-->
<!--        @click="emit('prev')">-->
<!--        上一题-->
<!--      </a-button>-->
<!--      <a-button-->
<!--        v-if="!showNext"-->
<!--        type="primary"-->
<!--        @click="submit">-->
<!--        提交答案-->
<!--      </a-button>-->
<!--      <a-button-->
<!--        v-else-->
<!--        type="primary"-->
<!--        @click="emit('next')">-->
<!--        下一题-->
<!--      </a-button>-->
<!--    </div>-->

<!--    &lt;!&ndash; 解析 &ndash;&gt;-->
<!--    <div v-if="showAnalysis" class="question-analysis">-->
<!--      <h4>答案解析</h4>-->
<!--      <div v-html="question.analysis" />-->
<!--    </div>-->
<!--  </div>-->
</template>

<style lang="scss">
@use "@/assets/scss/components/practise/QuestionRenderer";
@use "@/assets/scss/components/practise/question-types/ChoiceTrueFalse";
</style>
