/**
 * Supabase 数据库类型定义
 * @module types/supabase
 * @description 自动生成的数据库类型定义，需与数据库结构保持同步
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * 用户角色类型
 */
export type UserRole = 'user' | 'admin' | 'super_admin'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          github_url: string | null
          twitter_url: string | null
          weibo_url: string | null
          followers_count: number
          following_count: number
          articles_count: number
          likes_received: number
          nodes_count: number
          is_verified: boolean
          is_premium: boolean
          role: UserRole
          visibility: 'public' | 'followers' | 'private' | 'community'
          allow_dm: 'everyone' | 'followers' | 'mutual_follow' | 'none'
          account_status: 'active' | 'suspended' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          github_url?: string | null
          twitter_url?: string | null
          weibo_url?: string | null
          followers_count?: number
          following_count?: number
          articles_count?: number
          likes_received?: number
          nodes_count?: number
          is_verified?: boolean
          is_premium?: boolean
          role?: UserRole
          visibility?: 'public' | 'followers' | 'private' | 'community'
          allow_dm?: 'everyone' | 'followers' | 'mutual_follow' | 'none'
          account_status?: 'active' | 'suspended' | 'deleted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          github_url?: string | null
          twitter_url?: string | null
          weibo_url?: string | null
          followers_count?: number
          following_count?: number
          articles_count?: number
          likes_received?: number
          nodes_count?: number
          is_verified?: boolean
          is_premium?: boolean
          role?: UserRole
          visibility?: 'public' | 'followers' | 'private' | 'community'
          allow_dm?: 'everyone' | 'followers' | 'mutual_follow' | 'none'
          account_status?: 'active' | 'suspended' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      get_user_role: {
        Args: { check_user_id: string }
        Returns: UserRole
      }
      set_user_role: {
        Args: { target_user_id: string; new_role: UserRole }
        Returns: boolean
      }
    }
    Enums: {
      user_role_enum: UserRole
    }
  }
}
