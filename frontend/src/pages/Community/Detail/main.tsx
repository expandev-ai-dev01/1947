import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { minecraft } from '@/domain';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/core/components/form';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import { Checkbox } from '@/core/components/checkbox';
import { Separator } from '@/core/components/separator';
import { toast } from 'sonner';
import {
  commentSchema,
  type CommentFormInput,
  type CommentFormOutput,
} from '@/domain/minecraft/validations';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading } = minecraft.usePost(id!);
  const createComment = minecraft.useCreateComment(id!);
  const { goBack } = useNavigation();

  const form = useForm<CommentFormInput, any, CommentFormOutput>({
    resolver: zodResolver(commentSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: '',
      comment_body: '',
      captcha_response: '',
    },
  });

  const onSubmit = (data: CommentFormOutput) => {
    createComment.mutate(data, {
      onSuccess: () => {
        toast.success('Comentário adicionado!');
        form.reset();
      },
      onError: () => {
        toast.error('Erro ao comentar.');
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );
  if (!post) return <div className="p-12 text-center font-mono">Post não encontrado.</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <Button variant="ghost" onClick={goBack} className="font-mono">
        &larr; Voltar
      </Button>

      <div className="bg-card rounded-lg border-2 border-stone-400 p-6">
        <h1 className="mb-2 font-mono text-2xl font-bold">{post.post_title}</h1>
        <div className="text-muted-foreground mb-4 font-mono text-sm">
          Por <span className="font-bold">{post.nickname || 'Anônimo'}</span> •{' '}
          {post.created_at &&
            formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
        </div>
        <p className="whitespace-pre-wrap font-mono">{post.post_body}</p>
      </div>

      <div className="space-y-6">
        <h3 className="font-mono text-xl font-bold">Comentários</h3>

        <div className="space-y-4">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="bg-muted/50 border-border rounded-md border p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm font-bold">{comment.nickname || 'Anônimo'}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  {comment.created_at &&
                    formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                </span>
              </div>
              <p className="whitespace-pre-wrap font-mono text-sm">{comment.comment_body}</p>
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <p className="text-muted-foreground font-mono italic">Nenhum comentário ainda.</p>
          )}
        </div>

        <Separator />

        <div className="bg-card border-border rounded-lg border p-6">
          <h4 className="mb-4 font-mono text-lg font-bold">Adicionar Comentário</h4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono">Apelido (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nick" {...field} className="font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment_body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono">Comentário</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escreva seu comentário..."
                        {...field}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="captcha_response"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value === 'verified'}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? 'verified' : '');
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-mono">
                        Não sou um Zombie (Captcha Simulado)
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="font-mono" disabled={createComment.isPending}>
                {createComment.isPending ? <LoadingSpinner /> : 'Enviar Comentário'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export { CommunityDetailPage };
