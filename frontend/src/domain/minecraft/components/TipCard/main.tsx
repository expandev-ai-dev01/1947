import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/core/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { Button } from '@/core/components/button';
import { Link } from 'react-router-dom';
import type { Tip } from '../../types';

const tipCardVariants = cva('transition-all duration-200 hover:shadow-md border-2', {
  variants: {
    category: {
      Sobrevivência: 'border-green-700 bg-green-50/50',
      Construção: 'border-amber-700 bg-amber-50/50',
      Redstone: 'border-red-700 bg-red-50/50',
      Exploração: 'border-blue-700 bg-blue-50/50',
    },
  },
  defaultVariants: {
    category: 'Sobrevivência',
  },
});

interface TipCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tipCardVariants> {
  tip: Tip;
  adminView?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function TipCard({ className, tip, adminView, onEdit, onDelete, ...props }: TipCardProps) {
  return (
    <Card className={cn(tipCardVariants({ category: tip.category }), className)} {...props}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-mono text-xl font-bold">{tip.title}</CardTitle>
          <Badge variant="outline" className="bg-background">
            {tip.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 font-mono text-sm">{tip.content_body}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="link" className="px-0">
          <Link to={adminView ? `/admin/tips/${tip.id}` : `/tips/${tip.id}`}>Ler mais</Link>
        </Button>
        {adminView && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Apagar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export { TipCard, tipCardVariants };
