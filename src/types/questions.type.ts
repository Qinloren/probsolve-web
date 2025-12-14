export type AnswerType = number | number[] | string | string[];

/**
 * 题目类型
 */
export interface QuestionType {
  /**
   * 题目id
   */
  id: number;

  /**
   * 用户id
   */
  userId: number;

  /**
   * 题目内容
   */
  content: string;

  /**
   * 解析
   */
  analysis: string;

  /**
   * 难度
   */
  difficulty: number;

  /**
   * 分数
   */
  score: number;

  /**
   * 来源
   */
  source: string;

  /**
   * 状态
   */
  status: number;

  /**
   * 类型
   */
  type: number;

  /**
   * 创建时间
   */
  createTime: number;

  /**
   * 修改时间
   */
  updateTime: number;

  /**
   * 选项
   */
  options: QuestionOptionType[];
}

/**
 * 题目选项类型
 */
export interface QuestionOptionType {
  /**
   * 选项索引
   */
  index: number;
  /**
   * 选项
   */
  value: string;
}

/**
 * 题目库类型
 */
export interface QuestionLibType {

  /**
   * 题库id
   */
  id: number;

  /**
   * 题库名称
   */
  name: string;

  /**
   * 题库描述
   */
  signature: string;

  /**
   * 用户id
   */
  userId: number;

  /**
   * 排序
   */
  sort: number;

  /**
   * 显示状态
   */
  views: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 题目数量
   */
  size: number;

  /**
   * 题目
   */
  questions: QuestionType[];

  /**
   * 创建时间
   */
  createTime: number;

  /**
   * 修改时间
   */
  updateTime: number;
}
