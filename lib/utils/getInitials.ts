/**
 * 获取用户名称首字母
 *
 * @param name - 用户名称
 * @returns 首字母
 */
export function getInitials(name: string): string {
  return name.slice(0, 2)
}
