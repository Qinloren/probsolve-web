/**
 * 用户信息
 */
export interface UserType {
  /**
   * 用户id
   */
  id: number;

  /**
   * 用户名
   */
  username: string;

  /**
   * 邮箱
   */
  email: string;

  /**
   * 角色Id
   */
  role: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 头像
   */
  avatar: string;

  /**
   * 总积分
   */
  totalScore: number;

  /**
   * 等级
   */
  level: number;

  /**
   * 注册时间
   */
  createTime: number;

  /**
   * 修改时间
   */
  updateTime: number;

  /**
   * 最后登录时间
   */
  lastLoginTime: number;
}
