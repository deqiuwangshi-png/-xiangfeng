/**
 * 福利中心图标库
 * @module components/icons/rewards
 * @description 福利中心页面专用图标
 */

import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Brain,
  Calendar,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Coffee,
  Coins,
  Compass,
  Crown,
  CupSoda,
  Eye,
  Feather,
  Film,
  Gift,
  Globe,
  GraduationCap,
  ListTodo,
  Map,
  MessageCircle,
  Minus,
  Moon,
  Music,
  Palette,
  PenTool,
  Plus,
  Scroll,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Sticker,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'

// 导出所有图标
export {
  Archive,
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Brain,
  Calendar,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Coffee,
  Coins,
  Compass,
  Crown,
  CupSoda,
  Eye,
  Feather,
  Film,
  Gift,
  Globe,
  GraduationCap,
  ListTodo,
  Map,
  MessageCircle,
  Minus,
  Moon,
  Music,
  Palette,
  PenTool,
  Plus,
  Scroll,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Sticker,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Zap,
}

export type { LucideIcon }

/**
 * 图标名称映射表
 * @constant iconMap
 */
const iconMap: Record<string, LucideIcon> = {
  Archive,
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Brain,
  Calendar,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Coffee,
  Coins,
  Compass,
  Crown,
  CupSoda,
  Eye,
  Feather,
  Film,
  Gift,
  Globe,
  GraduationCap,
  ListTodo,
  Map,
  MessageCircle,
  Minus,
  Moon,
  Music,
  Palette,
  PenTool,
  Plus,
  Scroll,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Sticker,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Zap,
}

/**
 * 图标颜色映射配置
 * @constant iconColorMap
 * @description 福利中心兑换记录图标颜色配置
 */
export const iconColorMap: Record<string, string> = {
  Coffee: 'text-xf-primary',
  Film: 'text-xf-accent',
  Music: 'text-xf-accent',
  Crown: 'text-amber-600',
  ShoppingBag: 'text-xf-primary',
  Bookmark: 'text-xf-primary',
  Smartphone: 'text-xf-primary',
  CupSoda: 'text-xf-info',
  BookOpen: 'text-xf-accent',
  Palette: 'text-purple-600',
  Sparkles: 'text-rose-500',
  Gift: 'text-rose-500',
  Zap: 'text-amber-600',
  Sticker: 'text-xf-primary',
}

/**
 * 默认图标颜色
 * @constant defaultIconColor
 */
export const defaultIconColor = 'text-xf-accent'

/**
 * 根据名称获取图标组件
 * @param {string} name - 图标名称
 * @returns {LucideIcon} 图标组件
 */
export function getIconComponent(name: string): LucideIcon {
  return iconMap[name] || Gift
}

/**
 * 获取图标配置（图标组件 + 颜色）
 * @param {string} name - 图标名称
 * @returns {{ icon: LucideIcon; color: string }} 图标配置
 */
export function getIconConfig(name: string): { icon: LucideIcon; color: string } {
  return {
    icon: getIconComponent(name),
    color: iconColorMap[name] || defaultIconColor,
  }
}
