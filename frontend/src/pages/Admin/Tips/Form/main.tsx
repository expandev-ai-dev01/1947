import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { minecraft } from '@/domain';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Button } from '@/core/components/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { toast } from 'sonner';
import { tipSchema, type TipFormInput, type TipFormOutput } from '@/domain/minecraft/validations';

function TipFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { navigate, goBack } = useNavigation();

  const { data: tip, isLoading: loadingTip } = minecraft.useAdminTip(id || '');
  const createTip = minecraft.useCreateTip();
  const updateTip = minecraft.useUpdateTip(id || '');

  const form = useForm<TipFormInput, any, TipFormOutput>({
    resolver: zodResolver(tipSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      category: 'Sobrevivência',
      content_body: '',
      status: 'Rascunho',
    },
  });

  useEffect(() => {
    if (tip) {
      form.reset({
        title: tip.title,
        category: tip.category,
        content_body: tip.content_body,
        status: tip.status,
      });
    }
  }, [tip, form]);

  const onSubmit = (data: TipFormOutput) => {
    if (isEdit) {
      updateTip.mutate(data, {
        onSuccess: () => {
          toast.success('Dica atualizada!');
          navigate('/admin/dashboard');
        },
        onError: () => toast.error('Erro ao atualizar dica.'),
      });
    } else {
      createTip.mutate(data, {
        onSuccess: () => {
          toast.success('Dica criada!');
          navigate('/admin/dashboard');
        },
        onError: () => toast.error('Erro ao criar dica.'),
      });
    }
  };

  if (isEdit && loadingTip)
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={goBack} className="font-mono">
          &larr; Voltar
        </Button>
        <h1 className="font-mono text-2xl font-bold">{isEdit ? 'Editar Dica' : 'Nova Dica'}</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono">Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da dica" {...field} className="font-mono" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="font-mono">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sobrevivência" className="font-mono">
                        Sobrevivência
                      </SelectItem>
                      <SelectItem value="Construção" className="font-mono">
                        Construção
                      </SelectItem>
                      <SelectItem value="Redstone" className="font-mono">
                        Redstone
                      </SelectItem>
                      <SelectItem value="Exploração" className="font-mono">
                        Exploração
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="font-mono">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rascunho" className="font-mono">
                        Rascunho
                      </SelectItem>
                      <SelectItem value="Publicado" className="font-mono">
                        Publicado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content_body"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono">Conteúdo (Markdown)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escreva o conteúdo da dica..."
                    className="min-h-[300px] font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full font-mono"
            disabled={createTip.isPending || updateTip.isPending}
          >
            {createTip.isPending || updateTip.isPending ? <LoadingSpinner /> : 'Salvar'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export { TipFormPage };
