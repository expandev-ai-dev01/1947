import * as React from 'react';
import { cn } from '@/core/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  adminView?: boolean;
  onDelete?: () => void;
}

function PostCard({ className, post, adminView, onDelete, ...props }: PostCardProps) {
  return (
    <Card className={cn('border-2 border-stone-400 bg-stone-100', className)} {...props}>
      <CardHeader>
        <CardTitle className="font-mono text-lg font-bold">{post.post_title}</CardTitle>
        <div className="text-muted-foreground font-mono text-xs">
          Por <span className="font-bold">{post.nickname || 'Anônimo'}</span> •{' '}
          {post.created_at &&
            formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 whitespace-pre-wrap font-mono text-sm">{post.post_body}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="secondary" size="sm">
          <Link to={`/community/${post.id}`}>Ver discussão</Link>
        </Button>
        {adminView && (
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Remover
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export { PostCard };
