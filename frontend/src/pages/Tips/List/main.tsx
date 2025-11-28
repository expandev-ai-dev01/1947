import { useSearchParams } from 'react-router-dom';
import { minecraft } from '@/domain';
import { TipCard } from '@/domain/minecraft/components/TipCard';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';

function TipsListPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const { data: tips, isLoading } = minecraft.useTips(category);
  const { goBack } = useNavigation();

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={goBack} className="font-mono">
          &larr; Voltar
        </Button>
        <h1 className="font-mono text-3xl font-bold">
          {category ? `Dicas de ${category}` : 'Todas as Dicas'}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tips?.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center font-mono">
              Nenhuma dica encontrada nesta categoria.
            </p>
          ) : (
            tips?.map((tip) => <TipCard key={tip.id} tip={tip} />)
          )}
        </div>
      )}
    </div>
  );
}

export { TipsListPage };
