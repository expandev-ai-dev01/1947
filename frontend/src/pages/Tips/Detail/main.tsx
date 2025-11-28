import { useParams } from 'react-router-dom';
import { minecraft } from '@/domain';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { useNavigation } from '@/core/hooks/useNavigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function TipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tip, isLoading } = minecraft.useTip(id!);
  const { goBack } = useNavigation();

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );
  if (!tip) return <div className="p-12 text-center font-mono">Dica não encontrada.</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <Button variant="ghost" onClick={goBack} className="font-mono">
        &larr; Voltar
      </Button>

      <article className="bg-card border-border rounded-lg border-2 p-8 shadow-sm">
        <header className="mb-8 space-y-4 border-b pb-4">
          <div className="flex items-start justify-between">
            <h1 className="text-primary font-mono text-3xl font-bold md:text-4xl">{tip.title}</h1>
            <Badge className="px-3 py-1 font-mono text-lg">{tip.category}</Badge>
          </div>
          <div className="text-muted-foreground font-mono text-sm">
            Publicado em{' '}
            {tip.created_at &&
              format(new Date(tip.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        </header>

        <div className="prose prose-stone dark:prose-invert max-w-none whitespace-pre-wrap font-mono">
          {tip.content_body}
        </div>
      </article>
    </div>
  );
}

export { TipDetailPage };
