-- =====================================================
-- 评论表创建和初始化
-- 作用: 创建评论表、索引和触发器
-- =====================================================

-- 1. 创建评论表（如果不存在）
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.1 如果表已存在但缺少 likes 字段，添加该字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'likes'
  ) THEN
    ALTER TABLE comments ADD COLUMN likes INTEGER DEFAULT 0;
  END IF;
END $$;

-- 2. 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 3. 创建复合索引（用于分页查询）
CREATE INDEX IF NOT EXISTS idx_comments_article_created 
ON comments(article_id, created_at DESC);

-- 4. 启用 RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 5. 删除已存在的策略（避免重复创建错误）
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- 6. 创建 RLS 策略
-- 所有人可以查看评论
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

-- 登录用户可以插入自己的评论
CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 用户可以更新自己的评论
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

-- 用户可以删除自己的评论
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- 7. 创建自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. 添加 comments_count 触发器（如果 articles 表有此字段）
DO $$
BEGIN
  -- 检查 articles 表是否有 comments_count 字段
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'comments_count'
  ) THEN
    -- 创建增加评论计数触发器
    CREATE OR REPLACE FUNCTION increment_comments_count()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE articles 
      SET comments_count = comments_count + 1
      WHERE id = NEW.article_id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- 创建减少评论计数触发器
    CREATE OR REPLACE FUNCTION decrement_comments_count()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE articles 
      SET comments_count = GREATEST(comments_count - 1, 0)
      WHERE id = OLD.article_id;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;

    -- 删除已存在的触发器
    DROP TRIGGER IF EXISTS trg_comment_inserted ON comments;
    DROP TRIGGER IF EXISTS trg_comment_deleted ON comments;

    -- 创建触发器
    CREATE TRIGGER trg_comment_inserted
      AFTER INSERT ON comments
      FOR EACH ROW
      EXECUTE FUNCTION increment_comments_count();

    CREATE TRIGGER trg_comment_deleted
      AFTER DELETE ON comments
      FOR EACH ROW
      EXECUTE FUNCTION decrement_comments_count();

    -- 初始化现有文章的评论数
    UPDATE articles 
    SET comments_count = (
      SELECT COUNT(*) 
      FROM comments 
      WHERE comments.article_id = articles.id
    );
  END IF;
END $$;

-- 9. 验证表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- 10. 验证触发器
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'comments';
