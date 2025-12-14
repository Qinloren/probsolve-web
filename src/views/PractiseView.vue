<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, type VNode } from "vue";
import { filterQuestions, getQuestionLibs, validateQuestion } from "@/api/questionLib.ts";
import { message, type SelectProps } from "ant-design-vue";
import type { QuestionLibType, QuestionType } from "@/types/questions.type.ts";
import { Input } from "ant-design-vue";
import router from "@/router";

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
  isEnableNextQuestionBtn: true,
  isShowAnalysis: false,
  isShowCheckAnswer: false,
  answeringQuestion: {
    singleAnswer: null,
    multipleAnswer: [],
    fillAnswer: [] as string[],
    trueOrFalseAnswer: -1,
    shortAnswer: null,
  },
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

const renderFillQuestionTitle = () => {
  let originTitle = "";
  if (getFirstQuestion.value) {
    originTitle = getFirstQuestion.value.content;
  }
  const segments = originTitle.split("{}");
  const inputCount = segments.length - 1;
  if (data.answeringQuestion.fillAnswer.length !== inputCount) {
    data.answeringQuestion.fillAnswer = Array(inputCount).fill("");
  }
  const children: (string | VNode)[] = [];
  segments.forEach((seg, idx) => {
    children.push(seg);
    if (idx < segments.length - 1) {
      children.push(
        h(Input, {
          value: data.answeringQuestion.fillAnswer[idx],
          "onUpdate:value": (val: string) => {
            data.answeringQuestion.fillAnswer[idx] = val;
          },
          placeholder: "请输入答案",
          class: "question-fill-input",
        }),
      );
    }
  });
  return h("p", children);
};

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

const previousQuestion = () => {};

const nextQuestion = () => {
  if (data.questions.length === 0) {
    // TODO: 最后一题
    // data.isEnableNextQuestionBtn = false;
    message.info("恭喜！所有题目已全部完成！");
    return;
  }
  const firstQuestion = getFirstQuestion.value;
  if (firstQuestion) data.answeredQuestions.unshift(firstQuestion);
  data.questions.shift();
};

const submitAnswer = async () => {
  if (!getFirstQuestion.value) return;
  let answer;
  const questionType = getFirstQuestion.value.type;
  if (questionType === 1) {
    answer = data.answeringQuestion.singleAnswer;
    if (answer === null || answer === undefined) {
      message.warning("请选择一个选项");
      return;
    }
  } else if (questionType === 2) {
    answer = data.answeringQuestion.multipleAnswer;
    if (!answer || answer.length === 0) {
      message.warning("请至少选择一个选项");
      return;
    }
  } else if (questionType === 3) {
    answer = data.answeringQuestion.trueOrFalseAnswer;
    if (answer === -1 || answer === null || answer === undefined) {
      message.warning("请选择一个选项");
      return;
    }
  } else if (questionType === 4) {
    answer = data.answeringQuestion.fillAnswer;
    if (!answer || answer.length === 0 || answer.every((item) => !item || item.trim() === "")) {
      message.warning("请填写完整");
      return;
    }
  } else if (questionType === 5) {
    answer = data.answeringQuestion.shortAnswer;
    if (!answer || String(answer).trim() === "") {
      message.warning("请填写答案");
      return;
    }
  }
  if (answer === undefined) {
    return;
  }
  const response = await validateQuestion(getFirstQuestion.value.id, answer);
  if (!response.data.data) {
    message.error("回答错误！");
    data.isShowAnalysis = true;
    data.isShowNextQuestionBtn = true;
    return;
  }
  message.success("回答正确！");
  data.isShowAnalysis = false;
  data.isShowNextQuestionBtn = false;
  nextQuestion();
};
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
            <div class="question-item question-single-choice" v-if="getFirstQuestion && getFirstQuestion.type === 1">
              cz
              <!--            单选题-->
              <div class="question-header">
                      <h3>第{{ data.answeredQuestions.length + 1 }}题（单选题）</h3>
                <p>
                  <span>难度：</span>
                  <a-tag color="green" v-if="getFirstQuestion && getFirstQuestion.difficulty === 1">简</a-tag>
                  <a-tag color="orange" v-else-if="getFirstQuestion && getFirstQuestion.difficulty === 2">中</a-tag>
                  <a-tag color="red" v-else>难</a-tag>
                </p>
              </div>
              <p class="question-title" v-html="getFirstQuestion.content"></p>
              <div class="question-content">
                <a-radio-group class="question-options" v-model:value="data.answeringQuestion.singleAnswer">
                  <a-radio
                    class="question-options-item"
                    v-for="(item, index) in getFirstQuestion.options"
                    :key="index"
                    :value="item.index"
                  >{{ item.value }}</a-radio
                  >
                </a-radio-group>
              </div>
              <div class="question-action">
                <a-button @click="previousQuestion">上一题</a-button>
                <div>
                  <a-button type="primary" @click="nextQuestion" v-if="data.isShowNextQuestionBtn"
                  >下一题</a-button
                  >
                  <a-button :type="data.isShowNextQuestionBtn ? 'default' : 'primary'" @click="submitAnswer">
                    {{ data.isShowNextQuestionBtn ? "重新提交" : "提交答案" }}
                  </a-button>
                </div>
              </div>
            </div>
            <div class="question-item question-multiple-choice" v-if="getFirstQuestion && getFirstQuestion.type === 2">
              <!--            多选题-->
              <div class="question-header">
                <h3>第{{ data.answeredQuestions.length + 1 }}题（多选题）</h3>
                <p>
                  <span>难度：</span>
                  <a-tag color="green" v-if="getFirstQuestion && getFirstQuestion.difficulty === 1">简</a-tag>
                  <a-tag color="orange" v-else-if="getFirstQuestion && getFirstQuestion.difficulty === 2">中</a-tag>
                  <a-tag color="red" v-else>难</a-tag>
                </p>
              </div>
              <p class="question-title" v-html="getFirstQuestion.content"></p>
              <div class="question-content">
                <a-checkbox-group
                  class="question-options"
                  v-model:value="data.answeringQuestion.multipleAnswer"
                >
                  <a-checkbox
                    class="question-options-item"
                    v-for="(item, index) in getFirstQuestion.options"
                    :key="index"
                    :value="item.index"
                  >
                    {{ item.value }}
                  </a-checkbox>
                </a-checkbox-group>
              </div>
              <div class="question-action">
                <a-button @click="previousQuestion">上一题</a-button>
                <div>
                  <a-button type="primary" @click="nextQuestion" v-if="data.isShowNextQuestionBtn"
                  >下一题</a-button
                  >
                  <a-button :type="data.isShowNextQuestionBtn ? 'default' : 'primary'" @click="submitAnswer">
                    {{ data.isShowNextQuestionBtn ? "重新提交" : "提交答案" }}
                  </a-button>
                </div>
              </div>
            </div>
            <div class="question-item question-trueOrFalse" v-if="getFirstQuestion && getFirstQuestion.type === 3">
              <!--            判断题-->
              <div class="question-header">
                <h3>第{{ data.answeredQuestions.length + 1 }}题（判断题）</h3>
                <p>
                  <span>难度：</span>
                  <a-tag color="green" v-if="getFirstQuestion && getFirstQuestion.difficulty === 1">简</a-tag>
                  <a-tag color="orange" v-else-if="getFirstQuestion && getFirstQuestion.difficulty === 2">中</a-tag>
                  <a-tag color="red" v-else>难</a-tag>
                </p>
              </div>
              <p class="question-title">{{ getFirstQuestion.content }}</p>
              <div class="question-content">
                <a-radio-group
                  class="question-options"
                  v-model:value="data.answeringQuestion.trueOrFalseAnswer"
                >
                  <a-radio class="question-options-item" :value="1">正确</a-radio>
                  <a-radio class="question-options-item" :value="0">错误</a-radio>
                </a-radio-group>
              </div>
              <div class="question-result" v-if="data.isShowAnalysis">
                <h3 class="question-result-title">
        <span class="question-result-title-success" v-if="data.isShowCheckAnswer">
          <i class="i-mdi:checkbox-marked-circle"></i>
          回答正确
        </span>
                  <span class="question-result-title-error" v-else>
          <i class="i-mdi:close-circle"></i>
          回答错误
        </span>
                </h3>
                <div class="question-result-analysis">
                  <p class="question-result-analysis-title">
                    <i class="i-mdi:book-open-variant"></i>
                    答案解析
                  </p>
                  <div class="question-result-analysis-content" v-html="getFirstQuestion.analysis"></div>
                </div>
              </div>
              <div class="question-action">
                <a-button @click="previousQuestion">上一题</a-button>
                <div>
                  <a-button type="primary" @click="nextQuestion" v-if="data.isShowNextQuestionBtn"
                  >下一题</a-button
                  >
                  <a-button :type="data.isShowNextQuestionBtn ? 'default' : 'primary'" @click="submitAnswer">
                    {{ data.isShowNextQuestionBtn ? "重新提交" : "提交答案" }}
                  </a-button>
                </div>
              </div>
            </div>
            <div class="question-item question-fill" v-if="getFirstQuestion && getFirstQuestion.type === 4">
              <!--            填空题-->
              <div class="question-header">
                <h3>第{{ data.answeredQuestions.length + 1 }}题（填空题）</h3>
                <p>
                  <span>难度：</span>
                  <a-tag color="green" v-if="getFirstQuestion && getFirstQuestion.difficulty === 1">简</a-tag>
                  <a-tag color="orange" v-else-if="getFirstQuestion && getFirstQuestion.difficulty === 2">中</a-tag>
                  <a-tag color="red" v-else>难</a-tag>
                </p>
              </div>
              <p class="question-title">
                <render-fill-question-title />
              </p>
              <div class="question-content"></div>
              <div class="question-action">
                <a-button @click="previousQuestion">上一题</a-button>
                <div>
                  <a-button type="primary" @click="nextQuestion" v-if="data.isShowNextQuestionBtn"
                  >下一题</a-button
                  >
                  <a-button :type="data.isShowNextQuestionBtn ? 'default' : 'primary'" @click="submitAnswer">
                    {{ data.isShowNextQuestionBtn ? "重新提交" : "提交答案" }}
                  </a-button>
                </div>
              </div>
            </div>
            <div class="question-item question-short-answer" v-if="getFirstQuestion && getFirstQuestion.type === 5">
              <!--            简答题-->
              <div class="question-header">
                <h3>第{{ data.answeredQuestions.length + 1 }}题（简答题）</h3>
                <p>
                  <span>难度：</span>
                  <a-tag color="green" v-if="getFirstQuestion && getFirstQuestion.difficulty === 1">简</a-tag>
                  <a-tag color="orange" v-else-if="getFirstQuestion && getFirstQuestion.difficulty === 2">中</a-tag>
                  <a-tag color="red" v-else>难</a-tag>
                </p>
              </div>
              <p class="question-title" v-html="getFirstQuestion.content"></p>
              <div class="question-content">
                <p class="question-answer-guide-title">请输入你的答案：</p>
                <a-textarea
                  v-model:value="data.answeringQuestion.shortAnswer"
                  placeholder="请输入解答答案"
                  :rows="6"
                />
              </div>
              <div class="question-action">
                <a-button @click="previousQuestion">上一题</a-button>
                <div>
                  <a-button type="primary" @click="nextQuestion" v-if="data.isShowNextQuestionBtn"
                  >下一题</a-button
                  >
                  <a-button :type="data.isShowNextQuestionBtn ? 'default' : 'primary'" @click="submitAnswer">
                    {{ data.isShowNextQuestionBtn ? "重新提交" : "提交答案" }}
                  </a-button>
                </div>
              </div>
            </div>
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
