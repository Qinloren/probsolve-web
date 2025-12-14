<script setup lang="ts">
import { h, watch } from "vue";
import type { VNode } from "vue";
import { Input } from "ant-design-vue";
import type { QuestionType } from "@/types/questions.type";

const props = defineProps<{
  question: QuestionType;
}>();

/**
 * v-model 绑定答案数组
 * 如：["运算器", "控制器"]
 */
const modelValue = defineModel<string[]>({
  default: () => []
});

/**
 * 根据 {} 数量初始化答案数组
 */
watch(
  () => props.question.id,
  () => {
    const blankCount = props.question.content.split("{}").length - 1;
    modelValue.value = Array(blankCount).fill("");
  },
  { immediate: true }
);

/**
 * 渲染题干（文字 + Input）
 */
const renderTitle = (): VNode => {
  const segments = props.question.content.split("{}");
  const children: (string | VNode)[] = [];

  segments.forEach((seg, index) => {
    // 普通文本
    if (seg) {
      children.push(seg);
    }

    // 插入输入框
    if (index < segments.length - 1) {
      children.push(
        h(Input, {
          value: modelValue.value?.[index],
          "onUpdate:value": (val: string) => {
            modelValue.value[index] = val;
          },
          placeholder: "请输入答案",
          class: "question-fill-input",
          style: {
            width: "120px",
            margin: "0 6px",
          },
        }),
      );
    }
  });

  return h("p", { class: "question-fill-title" }, children);
};
</script>

<template>
  <div class="fill-blank-question">
    <!-- 使用 render 函数渲染 -->
    <component :is="renderTitle" />
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/components/practise/question-types/FillBlank";
</style>
