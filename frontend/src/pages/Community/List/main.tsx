import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { minecraft } from '@/domain';
import { PostCard } from '@/domain/minecraft/components/PostCard';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Button } from '@/core/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/components/dialog';
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
import { toast } from 'sonner';
import {
  postSchema,
  type PostFormInput,
  type PostFormOutput,
} from '@/domain/minecraft/validations';

function CommunityListPage() {
  const { data: posts, isLoading } = minecraft.usePosts();
  const createPost = minecraft.useCreatePost();
  const [open, setOpen] = useState(false);

  const form = useForm<PostFormInput, any, PostFormOutput>({
    resolver: zodResolver(postSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: '',
      post_title: '',
      post_body: '',
      captcha_response: '',
    },
  });

  const onSubmit = (data: PostFormOutput) => {
    createPost.mutate(data, {
      onSuccess: () => {
        toast.success('Post criado com sucesso!');
        setOpen(false);
        form.reset();
      },
      onError: () => {
        toast.error('Erro ao criar post. Tente novamente.');
      },
    });
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-3xl font-bold">Comunidade</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono">
              Criar Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-mono">Novo Post</DialogTitle>
            </DialogHeader>
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
                  name="post_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do post" {...field} className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="post_body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Escreva aqui..." {...field} className="font-mono" />
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
                          Não sou um Creeper (Captcha Simulado)
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full font-mono" disabled={createPost.isPending}>
                  {createPost.isPending ? <LoadingSpinner /> : 'Publicar'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-4">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export { CommunityListPage };
