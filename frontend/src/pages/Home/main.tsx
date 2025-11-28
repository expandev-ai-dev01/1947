import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { minecraft } from '@/domain';
import { PostCard } from '@/domain/minecraft/components/PostCard';
import { LoadingSpinner } from '@/core/components/loading-spinner';

function HomePage() {
  const { navigate } = useNavigation();
  const { data: posts, isLoading } = minecraft.usePosts();

  const categories = [
    { name: 'Sobrevivência', color: 'bg-green-600 hover:bg-green-700' },
    { name: 'Construção', color: 'bg-amber-600 hover:bg-amber-700' },
    { name: 'Redstone', color: 'bg-red-600 hover:bg-red-700' },
    { name: 'Exploração', color: 'bg-blue-600 hover:bg-blue-700' },
  ];

  return (
    <div className="space-y-12 py-8">
      <section className="space-y-4 text-center">
        <h1 className="text-primary-foreground bg-primary inline-block rounded-sm px-4 py-2 font-mono text-4xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] md:text-6xl">
          Minecraft Tips
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl font-mono text-xl">
          Dicas rápidas, tutoriais e uma comunidade aberta para todos os jogadores.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="border-secondary inline-block border-b-4 pb-2 font-mono text-2xl font-bold">
          Categorias de Dicas
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              className={`h-24 font-mono text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${cat.color}`}
              onClick={() => navigate(`/tips?category=${cat.name}`)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="border-secondary inline-block border-b-4 pb-2 font-mono text-2xl font-bold">
            Últimos Posts da Comunidade
          </h2>
          <Button onClick={() => navigate('/community')} variant="outline" className="font-mono">
            Ver Comunidade
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts?.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export { HomePage };
