<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { filterQuestions, getQuestionLibs, validateQuestion } from "@/api/questionLib.ts";
import { message, type SelectProps } from "ant-design-vue";
import type { AnswerType, QuestionLibType, QuestionType } from "@/types/questions.type.ts";
import router from "@/router";
import QuestionRenderer from "@/components/practise/QuestionRenderer.vue";

const data = reactive({
  selectedQuestionId: ref<number | null>(null),
  questionLibs: [] as SelectProps["options"],
  questionCount: 50,
  questions: [] as QuestionType[],
  questionDifficultyActive: 0,
  questionTypeActive: 0,
  selectedQuestionName: "测试题库",
  answeredQuestions: [] as QuestionType[],
  isShowNextQuestionBtn: false,
  isShowAnalysis: false,
  answeringQuestion: {
    singleAnswer: null,
    multipleAnswer: [],
    fillAnswer: [] as string[],
    trueOrFalseAnswer: -1,
    shortAnswer: null,
  },
  currentIndex: 0
});

const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    const questionsResponse = await getQuestionLibs();
    if (!questionsResponse.data?.data?.content) {
      data.questionLibs = [
        {
          value: 0,
          label: "暂无题库",
          disabled: true,
        },
      ];
      loading.value = false;
      return;
    }
    const questionsResult = questionsResponse.data.data.content;
    data.questionLibs = questionsResult.map((item: QuestionLibType) => ({
      value: item.id,
      label: item.name,
    }));
    const getRequestQuery = router.currentRoute.value.query;
    let targetId: number | null = null;
    if (getRequestQuery) {
      const routeId = Number(getRequestQuery.id);
      if (!isNaN(routeId) && questionsResult.some((item: QuestionLibType) => item.id === routeId)) {
        targetId = routeId;
      }
      // data.selectedQuestionId = Number(getRequestId.id)
    }
    if (targetId === null && questionsResult.length > 0) {
      targetId = questionsResult[0].id;
    }
    data.selectedQuestionId = targetId;
    if (targetId !== null) {
      const selectedLib = questionsResult.find((item: QuestionLibType) => item.id === targetId);
      data.selectedQuestionName = selectedLib?.name || "未知题库";
      await startPractiseQuestionById(targetId);
    }
    // await startPractiseQuestion();
  } catch (error) {
    console.error("加载题库失败", error);
    message.error("加载题库失败");
  } finally {
    loading.value = false;
  }
});

const getPracticeProgress = computed(() => {
  if (data.questions.length === 0) return 2;
  return (data.answeredQuestions.length / data.questions.length) * 100;
});

const getFirstQuestion = computed(() => {
  // return data.questions.length > 0 ? data.questions[0] : null;
  return data.questions.length > 0 ? data.questions[0] : null;
});

const filterOption = (input: string, option: { value: number; label: string }) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const toggleQuestionDifficulty = (index: number) => {
  if (!(index >= 0 && index < 4)) return;
  data.questionDifficultyActive = index;
};

const toggleQuestionType = (index: number) => {
  if (!(index >= 0 && index < 6)) return;
  data.questionTypeActive = index;
};

const decreasingQuestionCount = () => {
  if (data.questionCount === 0) return;
  data.questionCount--;
};

const increasingQuestionCount = () => {
  data.questionCount++;
};

const startPractiseQuestion = async () => {
  await startPractiseQuestionById(Number(data.selectedQuestionId));
};

const startPractiseQuestionById = async (id: number) => {
  const response = await filterQuestions(
    id,
    data.questionDifficultyActive === 0 ? null : data.questionDifficultyActive,
    data.questionTypeActive === 0 ? null : data.questionTypeActive,
    data.questionCount,
  );
  data.questions = response.data.data.content;
  data.selectedQuestionName =
    data.questionLibs?.find((item) => item.value === data.selectedQuestionId)?.label ?? null;
};

const previousQuestion = () => {
  if (data.currentIndex <= 0) {
    return;
  }
  data.currentIndex--;
  data.isShowAnalysis = false;
  data.isShowNextQuestionBtn = false;

};

const nextQuestion = () => {
  if (data.currentIndex < data.questions.length - 1) {
    data.currentIndex++;
    data.isShowAnalysis = false;
    data.isShowNextQuestionBtn = false;
  }
};

const isFirst = computed(() => data.currentIndex === 0);

const validateAnswer = (
  question: QuestionType,
  answer: AnswerType
): boolean => {
  switch (question.type) {
    case 1:
    case 3:
      if (answer === null || answer == undefined) {
        message.warning("请选择一个选项");
        return false;
      }
      return true;
    case 2:
      if (!Array.isArray(answer) || answer.length === 0) {
        message.warning("请至少选择一个选项");
        return false;
      }
      return true;
    case 4:
      if (!Array.isArray(answer) ||
          answer.length === 0 ||
          answer.some((item) => !item || typeof item !== "number" && item?.trim() === "")) {
        message.warning("请填写完整");
        return false;
      }
      return true;
    case 5:
      if (!answer || String(answer).trim() === "") {
        message.warning("请填写答案");
        return false;
      }
      return true;
    default:
      message.error("未知题型");
      return false;
  }
}

const handleSubmit = async (
  answer: AnswerType,
) => {
  const question = currentQuestion.value;
  if (!question) return;

  if (!(validateAnswer(question, answer))) {
    return;
  }

  const response = await validateQuestion(question.id, answer);

  const isCorrect = response.data.data;

  data.isShowAnalysis = true;
  data.isShowNextQuestionBtn = true;

  if (isCorrect) {
    message.success("回答正确！");
  } else {
    message.error("回答错误！");
  }
}

const currentQuestion = computed<QuestionType | undefined>(() => {
  return data.questions[data.currentIndex]
})
</script>

<template>
  <div class="practise-container">
    <div class="practise-header">
      <h1 class="practise-header-title">专项练习</h1>
      <p class="practise-header-subtitle">根据知识点针对性练习，快速提升解题能力</p>
    </div>
    <div class="practise-content">
      <div class="practise-card practise-filter">
        <h3 class="card-title">条件筛选</h3>
        <div class="card-body">
          <div class="card-body-item">
            <div class="card-body-item-title">题库</div>
            <div class="card-body-item-title-main">
              <a-select
                :options="data.questionLibs"
                show-search
                show-arrow
                :not-found-content="false"
                placeholder="请选择题库"
                :filter-option="filterOption"
                v-model:value="data.selectedQuestionId"
                style="flex: 1"
              />
            </div>
          </div>
          <div class="card-body-item">
            <div class="card-body-item-title">难度</div>
            <div class="card-body-item-title-main">
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionDifficultyActive === 0,
                }"
                @click="toggleQuestionDifficulty(0)"
              >
                全部
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionDifficultyActive === 1,
                }"
                @click="toggleQuestionDifficulty(1)"
              >
                简单
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionDifficultyActive === 2,
                }"
                @click="toggleQuestionDifficulty(2)"
              >
                一般
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionDifficultyActive === 3,
                }"
                @click="toggleQuestionDifficulty(3)"
              >
                困难
              </button>
            </div>
          </div>
          <div class="card-body-item">
            <div class="card-body-item-title">题型</div>
            <div class="card-body-item-title-main">
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionTypeActive === 0,
                }"
                @click="toggleQuestionType(0)"
              >
                全部
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionTypeActive === 1,
                }"
                @click="toggleQuestionType(1)"
              >
                单选题
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionTypeActive === 2,
                }"
                @click="toggleQuestionType(2)"
              >
                多选题
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionTypeActive === 3,
                }"
                @click="toggleQuestionType(3)"
              >
                判断题
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionTypeActive === 4,
                }"
                @click="toggleQuestionType(4)"
              >
                填空题
              </button>
              <button
                class="filter-item-btn"
                :class="{
                  active: data.questionTypeActive === 5,
                }"
                @click="toggleQuestionType(5)"
              >
                简答题
              </button>
            </div>
          </div>
          <div class="card-body-item">
            <div class="card-body-item-title">数量</div>
            <div class="card-body-item-title-main">
              <a-button @click="decreasingQuestionCount">
                <template #icon>
                  <i class="i-mdi:minus"></i>
                </template>
              </a-button>
              <a-input-number v-model:value="data.questionCount" style="flex: 1" :min="1" />
              <a-button @click="increasingQuestionCount">
                <template #icon>
                  <i class="i-mdi:plus"></i>
                </template>
              </a-button>
            </div>
          </div>
          <div class="card-body-item">
            <a-button type="primary" @click="startPractiseQuestion">开始练习</a-button>
          </div>
        </div>
      </div>
      <div class="practise-card practise-main">
        <div class="practise-main-header">
          <div class="practise-main-process">
            <div class="practise-main-process-header">
              <div class="practise-main-process-header-title">
                <h3>
                  {{ data.selectedQuestionName || "请选择题库" }}
                </h3>
                <p style="margin-bottom: 0">
                  当前进度：{{ data.answeredQuestions.length }}/{{ data.questions.length }} 题
                </p>
              </div>
            </div>
            <div class="practise-main-process-inner" v-if="getFirstQuestion !== null">
              <a-button>保存进度</a-button>
              <a-button type="primary" danger>放弃练习</a-button>
            </div>
          </div>
          <a-progress style="margin-top: 15px" :show-info="false" :percent="getPracticeProgress" />
        </div>
        <div class="practise-main-question">
          <template v-if="getFirstQuestion !== null">
            <QuestionRenderer
              :current-index="data.currentIndex"
              v-if="currentQuestion"
              :question="currentQuestion"
              :is-first="isFirst"
              :show-next="data.isShowNextQuestionBtn"
              :show-analysis="data.isShowAnalysis"
              @submit="handleSubmit"
              @next="nextQuestion"
              @prev="previousQuestion"
            />
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/views/practise";
</style>
