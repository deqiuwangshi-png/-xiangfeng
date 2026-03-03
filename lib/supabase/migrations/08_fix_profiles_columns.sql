-- =====================================================
-- 修复 profiles 表缺少 bio 和 location 字段的问题
-- 执行此 SQL 添加缺失字段到现有表
-- =====================================================

-- 添加 bio 字段（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'bio'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT DEFAULT '这个人很懒，还没有填写简介...';
    RAISE NOTICE 'Added bio column to profiles table';
  ELSE
    RAISE NOTICE 'bio column already exists in profiles table';
  END IF;
END $$;

-- 添加 location 字段（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'location'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location TEXT DEFAULT '';
    RAISE NOTICE 'Added location column to profiles table';
  ELSE
    RAISE NOTICE 'location column already exists in profiles table';
  END IF;
END $$;

-- 验证字段是否添加成功
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;
