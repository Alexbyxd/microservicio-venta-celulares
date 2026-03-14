"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { apiClient } from "@/lib/api-client";
import { AuthResponse, User, AxiosApiError } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginModalProps {
  children: React.ReactNode;
  onLoginSuccess?: (token: string, user: User) => void;
}

export function LoginModal({ children, onLoginSuccess }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
      const { token, user } = response.data;

      if (onLoginSuccess) {
        onLoginSuccess(token, user);
      }

      setOpen(false);
      form.reset();
    } catch (err: unknown) {
      const error = err as AxiosApiError;
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Error al iniciar sesión";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border border-white/10 bg-black/60 px-8 py-10 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, rotateX: -15, y: 30 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          <DialogHeader className="mb-6">
            <DialogTitle
              className="text-3xl font-semibold tracking-tight text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(144.5deg, rgba(255,255,255,1) 28%, rgba(255,255,255,0.4) 115%)",
              }}
            >
              Iniciar sesión
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm mt-2">
              Ingresa a tu cuenta para experimentar el futuro de la Web3.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Field data-invalid={!!form.formState.errors.email}>
                  <FieldLabel htmlFor="email" className="text-white/80 font-medium">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="h-11 rounded-lg border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 focus-visible:bg-white/10 transition-all"
                    {...form.register("email")}
                  />
                  <FieldError errors={[form.formState.errors.email]} />
                </Field>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Field data-invalid={!!form.formState.errors.password}>
                  <FieldLabel htmlFor="password" className="text-white/80 font-medium">
                    Contraseña
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 rounded-lg border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 focus-visible:bg-white/10 transition-all pr-10"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FieldError errors={[form.formState.errors.password]} />
                </Field>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-2"
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-full border border-white/80 bg-white px-4 py-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:bg-black hover:border-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute top-0 left-1/2 h-[8px] w-[50%] -translate-x-1/2 rounded-full bg-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] opacity-100 transition-opacity group-hover:opacity-0" />
                  <div className="absolute bottom-0 left-1/2 h-[8px] w-[50%] -translate-x-1/2 rounded-full bg-white opacity-0 blur-sm transition-opacity group-hover:opacity-60" />
                  <span className="relative z-10 text-[14px] font-semibold text-black transition-colors group-hover:text-white">
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </span>
                </motion.button>
              </motion.div>
            </FieldGroup>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-white/40">
              <span className="bg-black/60 px-3 backdrop-blur-md">
                O continuar con
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-black/40 px-4 py-3 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all hover:border-white/40 hover:bg-white/5"
            >
              <div className="absolute -top-[4px] left-1/2 h-[12px] w-[40%] -translate-x-1/2 rounded-full bg-white opacity-20 blur-md transition-opacity group-hover:opacity-50" />
              <svg className="h-5 w-5 relative z-10" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="relative z-10 text-[14px] font-medium text-white/90">
                Iniciar sesión con Google
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
