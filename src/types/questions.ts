/**
 * 题目类型
 */
export interface QuestionType {
  /**
   * 题目id
   */
  id: string;

  /**
   * 用户id
   */
  userId: string;

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
  difficulty: string;

  /**
   * 分数
   */
  score: string;

  /**
   * 来源
   */
  source: string;

  /**
   * 状态
   */
  status: string;

  /**
   * 类型
   */
  type: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 修改时间
   */
  updateTime: string;
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
