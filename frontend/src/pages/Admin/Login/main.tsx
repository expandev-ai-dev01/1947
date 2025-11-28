import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@/domain';
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
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { toast } from 'sonner';
import { loginSchema, type LoginFormInput, type LoginFormOutput } from '@/domain/auth/validations';

function AdminLoginPage() {
  const login = auth.useLogin();

  const form = useForm<LoginFormInput, any, LoginFormOutput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      admin_username: '',
      admin_password: '',
    },
  });

  const onSubmit = (data: LoginFormOutput) => {
    login.mutate(data, {
      onError: () => {
        toast.error('Credenciais inválidas ou acesso bloqueado.');
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-900">
      <div className="bg-card w-full max-w-md space-y-8 rounded-lg border-2 border-stone-600 p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-primary font-mono text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Acesso restrito a administradores
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="admin_username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admin_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-mono" disabled={login.isPending}>
              {login.isPending ? <LoadingSpinner /> : 'Entrar'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export { AdminLoginPage };
