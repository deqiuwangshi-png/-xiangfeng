'use client'

import Image from 'next/image'

export type ActivityType = 'user' | 'community' | 'article'

export interface ActivityCardProps {
  type: ActivityType
  avatar?: string
  avatarFallback?: string
  avatarGradient?: string
  userName: string
  userAction: string
  timeAgo: string
  badge?: {
    text: string
    variant: 'primary' | 'info' | 'success'
  }
  title: string
  description: string
  articleId?: string
  stats?: {
    label: string
    value: number
    icon: React.ElementType
  }[]
  actionButton?: {
    text: string
    variant: 'primary' | 'info'
    onClick: (articleId?: string) => void
  }
  onClick?: () => void
  className?: string
  loading?: 'eager' | 'lazy'
}

export function ActivityCard({
  type,
  avatar,
  avatarFallback,
  avatarGradient,
  userName,
  userAction,
  timeAgo,
  badge,
  title,
  description,
  articleId,
  stats,
  actionButton,
  onClick,
  className = '',
  loading = 'lazy'
}: ActivityCardProps) {
  // type参数用于未来扩展不同类型的卡片样式
  void type
  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-xf-primary/10 text-xf-primary'
      case 'info':
        return 'bg-xf-info/10 text-xf-info'
      case 'success':
        return 'bg-xf-success/10 text-xf-success'
      default:
        return 'bg-xf-primary/10 text-xf-primary'
    }
  }

  const getActionButtonVariant = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-xf-primary hover:bg-xf-primary/90 text-white'
      case 'info':
        return 'bg-xf-info hover:bg-xf-info/90 text-white'
      default:
        return 'bg-xf-primary hover:bg-xf-primary/90 text-white'
    }
  }

  return (
    <div
      className={`card-bg rounded-2xl p-6 group cursor-pointer card-equal-height ${className}`}
      onClick={onClick}
    >
      <div className="card-content">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {avatar ? (
              <div className="w-10 h-10 rounded-full overflow-hidden bg-xf-soft/20">
                <Image
                  src={avatar}
                  alt={userName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  loading={loading}
                  unoptimized={avatar?.includes('dicebear.com')}
                />
              </div>
            ) : avatarGradient ? (
              <div
                className={`w-10 h-10 rounded-xl bg-linear-to-tr ${avatarGradient} flex items-center justify-center text-white text-sm font-bold`}
              >
                {avatarFallback}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-xf-primary flex items-center justify-center text-white text-sm font-bold">
                {avatarFallback || userName.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="font-bold text-xf-dark">{userName}</h4>
              <p className="text-sm text-xf-primary">
                {userAction} • {timeAgo}
              </p>
            </div>
          </div>
          {badge && (
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${getBadgeVariant(badge.variant)}`}
            >
              {badge.text}
            </span>
          )}
        </div>

        <h3 className="text-xl font-serif font-bold text-xf-dark mb-4 group-hover:text-xf-accent transition-colors text-layer-1">
          {title}
        </h3>

        <p className="text-xf-dark/70 text-sm mb-6 font-normal line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between pt-4 border-t border-xf-bg/40">
          {stats && stats.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-xf-medium">
              {stats.map((stat, index) => (
                <span key={index} className="flex items-center gap-1.5">
                  <stat.icon className="w-4 h-4" />
                  {stat.value}{stat.label}
                </span>
              ))}
            </div>
          )}
          {actionButton && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                actionButton.onClick(articleId)
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${getActionButtonVariant(
                actionButton.variant
              )}`}
            >
              {actionButton.text}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
