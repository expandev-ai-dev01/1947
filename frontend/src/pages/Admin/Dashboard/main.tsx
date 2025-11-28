import { minecraft } from '@/domain';
import { useAuthStore } from '@/core/stores/auth';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Button } from '@/core/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/tabs';
import { TipCard } from '@/domain/minecraft/components/TipCard';
import { PostCard } from '@/domain/minecraft/components/PostCard';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { toast } from 'sonner';

function AdminDashboardPage() {
  const { logout } = useAuthStore();
  const { navigate } = useNavigation();

  const { data: tips, isLoading: loadingTips } = minecraft.useAdminTips();
  const { data: posts, isLoading: loadingPosts } = minecraft.usePosts();

  const deleteTip = minecraft.useDeleteTip();
  const deletePost = minecraft.useDeletePost();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDeleteTip = (id: string) => {
    if (confirm('Tem certeza que deseja apagar esta dica?')) {
      deleteTip.mutate(id, { onSuccess: () => toast.success('Dica removida') });
    }
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Tem certeza que deseja remover este post?')) {
      deletePost.mutate(id, { onSuccess: () => toast.success('Post removido') });
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-3xl font-bold">Painel Administrativo</h1>
        <Button variant="outline" onClick={handleLogout} className="font-mono">
          Sair
        </Button>
      </div>

      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tips" className="font-mono">
            Gerenciar Dicas
          </TabsTrigger>
          <TabsTrigger value="community" className="font-mono">
            Moderar Comunidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate('/admin/tips/new')} className="bg-primary font-mono">
              Nova Dica
            </Button>
          </div>
          {loadingTips ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tips?.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  adminView
                  onEdit={() => navigate(`/admin/tips/${tip.id}/edit`)}
                  onDelete={() => handleDeleteTip(tip.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {loadingPosts ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid gap-4">
              {posts?.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  adminView
                  onDelete={() => handleDeletePost(post.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { AdminDashboardPage };
