-- =====================================================
-- 修复 comments 表缺少 likes 字段的问题
-- 执行此 SQL 添加 likes 字段到现有表
-- =====================================================

-- 添加 likes 字段（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' 
    AND column_name = 'likes'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE comments ADD COLUMN likes INTEGER DEFAULT 0;
    RAISE NOTICE 'Added likes column to comments table';
  ELSE
    RAISE NOTICE 'likes column already exists in comments table';
  END IF;
END $$;

-- 验证字段是否添加成功
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
AND table_schema = 'public'
ORDER BY ordinal_position;
