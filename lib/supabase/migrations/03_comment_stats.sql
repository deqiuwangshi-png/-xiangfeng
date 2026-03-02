-- =====================================================
-- 评论统计自动更新触发器
-- 作用: 当评论被添加或删除时，自动更新文章的 comments_count 字段
-- =====================================================

-- 1. 首先确保 articles 表有 comments_count 字段
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- 2. 创建触发器函数: 增加评论计数
CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articles 
  SET comments_count = comments_count + 1
  WHERE id = NEW.article_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 创建触发器函数: 减少评论计数
CREATE OR REPLACE FUNCTION decrement_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articles 
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = OLD.article_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 4. 删除已存在的触发器（避免重复创建错误）
DROP TRIGGER IF EXISTS trg_comment_inserted ON comments;
DROP TRIGGER IF EXISTS trg_comment_deleted ON comments;

-- 5. 创建触发器: 插入评论时增加计数
CREATE TRIGGER trg_comment_inserted
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_comments_count();

-- 6. 创建触发器: 删除评论时减少计数
CREATE TRIGGER trg_comment_deleted
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_comments_count();

-- 7. 初始化现有文章的评论数（基于现有评论数据）
UPDATE articles 
SET comments_count = (
  SELECT COUNT(*) 
  FROM comments 
  WHERE comments.article_id = articles.id
);

-- 8. 创建索引优化评论查询性能
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 9. 验证触发器是否创建成功
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'comments';
