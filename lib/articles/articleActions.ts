'use server';

import { revalidatePath } from 'next/cache';

export async function likeArticle(formData: FormData) {
  const articleId = formData.get('articleId');
  
  if (!articleId || typeof articleId !== 'string') {
    throw new Error('Invalid article ID');
  }
  
  const userId = 'user-123';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to like article');
  }
  
  revalidatePath(`/article/${articleId}`);
  
  return { success: true };
}

export async function bookmarkArticle(formData: FormData) {
  const articleId = formData.get('articleId');
  
  if (!articleId || typeof articleId !== 'string') {
    throw new Error('Invalid article ID');
  }
  
  const userId = 'user-123';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/bookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to bookmark article');
  }
  
  revalidatePath(`/article/${articleId}`);
  
  return { success: true };
}

export async function submitComment(formData: FormData) {
  const articleId = formData.get('articleId');
  const content = formData.get('content');
  
  if (!articleId || typeof articleId !== 'string') {
    throw new Error('Invalid article ID');
  }
  
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Comment content is required');
  }
  
  if (content.length > 500) {
    throw new Error('Comment content is too long');
  }
  
  const userId = 'user-123';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit comment');
  }
  
  revalidatePath(`/article/${articleId}`);
  
  return { success: true };
}

export async function likeComment(formData: FormData) {
  const commentId = formData.get('commentId');
  
  if (!commentId || typeof commentId !== 'string') {
    throw new Error('Invalid comment ID');
  }
  
  const userId = 'user-123';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to like comment');
  }
  
  return { success: true };
}
