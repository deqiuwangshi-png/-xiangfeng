-- =====================================================
-- 点赞统计自动更新触发器
-- 作用: 当点赞被添加或删除时，自动更新文章的 likes_count 字段
-- =====================================================

-- 1. 首先确保 articles 表有 likes_count 字段
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- 2. 创建点赞表（如果不存在）
CREATE TABLE IF NOT EXISTS article_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- 3. 创建触发器函数: 增加点赞计数
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articles 
  SET likes_count = likes_count + 1
  WHERE id = NEW.article_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 创建触发器函数: 减少点赞计数
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articles 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = OLD.article_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 5. 删除已存在的触发器（避免重复创建错误）
DROP TRIGGER IF EXISTS trg_like_inserted ON article_likes;
DROP TRIGGER IF EXISTS trg_like_deleted ON article_likes;

-- 6. 创建触发器: 插入点赞时增加计数
CREATE TRIGGER trg_like_inserted
  AFTER INSERT ON article_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_likes_count();

-- 7. 创建触发器: 删除点赞时减少计数
CREATE TRIGGER trg_like_deleted
  AFTER DELETE ON article_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_likes_count();

-- 8. 初始化现有文章的点赞数（基于现有点赞数据）
UPDATE articles 
SET likes_count = (
  SELECT COUNT(*) 
  FROM article_likes 
  WHERE article_likes.article_id = articles.id
);

-- 9. 创建索引优化点赞查询性能
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON article_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_created_at ON article_likes(created_at DESC);

-- 10. 启用 RLS (Row Level Security)
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;

-- 11. 创建 RLS 策略：用户只能看到自己的点赞
CREATE POLICY "Users can view all likes" ON article_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON article_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON article_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 12. 验证触发器是否创建成功
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'article_likes';
