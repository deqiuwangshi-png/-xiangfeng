-- =====================================================
-- 收藏表创建
-- 作用: 存储用户的文章收藏记录
-- =====================================================

-- 1. 创建收藏表
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- 2. 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_bookmarks_article_id ON bookmarks(article_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- 3. 启用 RLS (Row Level Security)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- 5. 验证表是否创建成功
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'bookmarks'
ORDER BY ordinal_position;
