"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Smartphone,
  Upload,
  Loader2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { ImagePreview } from "@/components/ui/image-preview";
import { catalogService } from "@/lib/catalog-service";
import { CreateProductDto } from "@/types/catalog";

const options = {
  currency: ["USD", "EUR", "BOB"],
  category: ["Celulares", "Tablets", "Accesorios", "Smartwatches"],
  color: ["Negro", "Blanco", "Azul", "Verde", "Dorado", "Rojo", "Plata", "Gris"],
  storage: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  condition: ["Nuevo", "Usado", "Reacondicionado"],
  os: ["Android", "iOS", "HarmonyOS", "Other"],
  processor: ["Snapdragon", "Exynos", "A-Series", "Dimensity", "Helio", "Tensor"],
};

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  currency: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  color: z.string().optional(),
  storage: z.string().optional(),
  ram: z.string().optional(),
  condition: z.string().optional(),
  carrierLock: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  stock: z.number().min(0).optional(),
  tags: z.string().optional(),
  specifications: z.object({
    processor: z.string().optional(),
    screenSize: z.string().optional(),
    screenResolution: z.string().optional(),
    battery: z.string().optional(),
    mainCamera: z.string().optional(),
    frontCamera: z.string().optional(),
    os: z.string().optional(),
    connectivity: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    nfc: z.boolean().optional(),
    dualSim: z.boolean().optional(),
    fingerprint: z.boolean().optional(),
    faceUnlock: z.boolean().optional(),
    expandableMemory: z.boolean().optional(),
  }).optional(),
});

type ProductFormValues = {
  name: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  currency?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  subcategory?: string;
  color?: string;
  storage?: string;
  ram?: string;
  condition?: string;
  carrierLock?: string;
  images?: string[];
  featured?: boolean;
  stock?: number;
  tags?: string;
  specifications?: {
    processor?: string;
    screenSize?: string;
    screenResolution?: string;
    battery?: string;
    mainCamera?: string;
    frontCamera?: string;
    os?: string;
    connectivity?: string;
    dimensions?: string;
    weight?: string;
    nfc?: boolean;
    dualSim?: boolean;
    fingerprint?: boolean;
    faceUnlock?: boolean;
    expandableMemory?: boolean;
  };
};

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLocalFiles((prev) => [...prev, ...acceptedFiles].slice(0, 10));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxFiles: 10 - localFiles.length,
    disabled: localFiles.length >= 10,
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", brand: "", model: "", description: "", price: 0, currency: "USD",
      featured: false, stock: 0, tags: "", images: [],
      specifications: { nfc: false, dualSim: false, fingerprint: false, faceUnlock: false, expandableMemory: false }
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags?.split(",").map(t => t.trim()).filter(Boolean);
      const connectivityArray = data.specifications?.connectivity?.split(",").map(c => c.trim()).filter(Boolean);

      const productData = {
        ...data,
        tags: tagsArray,
        specifications: data.specifications ? { ...data.specifications, connectivity: connectivityArray } : undefined,
      };

      if (localFiles.length > 0) {
        await catalogService.createProductWithImages({ product: productData as CreateProductDto, images: localFiles });
      } else {
        await catalogService.createProduct(productData as CreateProductDto);
      }

      toast.success("Producto creado exitosamente");
      router.push("/admin/catalog");
    } catch {
      toast.error("Error al crear el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-black text-white selection:bg-white/20">
      <div className="flex items-center gap-6 mb-10">
        <Button variant="ghost" size="icon" className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10" asChild>
          <Link href="/admin/catalog">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-medium tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent flex items-center gap-3">
            <Smartphone className="size-8 text-white" />
            Nuevo Producto
          </h1>
          <p className="text-white/40 mt-1">Registra un nuevo dispositivo en el ecosistema.</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-white/90">Información Principal</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel className="text-white/60">Nombre *</FieldLabel>
              <Input className="bg-white/5 border-white/10 focus:border-white/30 transition-colors" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.brand}>
              <FieldLabel className="text-white/60">Marca *</FieldLabel>
              <Input className="bg-white/5 border-white/10 focus:border-white/30" {...form.register("brand")} />
              <FieldError errors={[form.formState.errors.brand]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.model}>
              <FieldLabel className="text-white/60">Modelo *</FieldLabel>
              <Input className="bg-white/5 border-white/10 focus:border-white/30" {...form.register("model")} />
              <FieldError errors={[form.formState.errors.model]} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!form.formState.errors.price}>
                <FieldLabel className="text-white/60">Precio *</FieldLabel>
                <Input type="number" step="0.01" className="bg-white/5 border-white/10" {...form.register("price", { valueAsNumber: true })} />
                <FieldError errors={[form.formState.errors.price]} />
              </Field>
              <Field>
                <FieldLabel className="text-white/60">Moneda</FieldLabel>
                <Select value={form.watch("currency")} onValueChange={(v) => form.setValue("currency", v)}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/10 text-white">
                    {options.currency.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field className="md:col-span-2" data-invalid={!!form.formState.errors.description}>
              <FieldLabel className="text-white/60">Descripción *</FieldLabel>
              <Textarea className="bg-white/5 border-white/10 min-h-[100px]" {...form.register("description")} />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader><CardTitle className="text-xl font-medium text-white/90">Galería & Multimedia</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div {...getRootProps()} className={`
              group border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
              ${isDragActive ? "border-white bg-white/5" : "border-white/10 hover:border-white/30 hover:bg-white/5"}
              ${localFiles.length >= 10 ? "opacity-30 cursor-not-allowed" : ""}
            `}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  <Upload className="size-8 text-white/70" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-medium">Suelta o selecciona imágenes</p>
                  <p className="text-sm text-white/30">Máximo 10 archivos de alta calidad</p>
                </div>
              </div>
            </div>

            <ImagePreview 
              files={localFiles} 
              onFilesChange={setLocalFiles}
              urls={form.watch("images")?.join(", ") ?? ""}
              onUrlsChange={(v) => form.setValue("images", v.split(", ").filter(Boolean))}
            />

            <Field>
              <FieldLabel className="text-white/60">URLs Externas (separadas por coma)</FieldLabel>
              <Input 
                className="bg-white/5 border-white/10" 
                placeholder="https://..." 
                value={form.watch("images")?.join(", ") ?? ""}
                onChange={(e) => form.setValue("images", e.target.value.split(",").map(i => i.trim()).filter(Boolean))}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader><CardTitle className="text-xl font-medium text-white/90">Especificaciones Técnicas</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field>
              <FieldLabel className="text-white/60">Procesador</FieldLabel>
              <Select value={form.watch("specifications.processor")} onValueChange={(v) => form.setValue("specifications.processor", v)}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Chipset" /></SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10 text-white">
                  {options.processor.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel className="text-white/60">RAM</FieldLabel>
              <Select value={form.watch("ram")} onValueChange={(v) => form.setValue("ram", v)}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Memoria" /></SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10 text-white">
                  {options.ram.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel className="text-white/60">Almacenamiento</FieldLabel>
              <Select value={form.watch("storage")} onValueChange={(v) => form.setValue("storage", v)}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Capacidad" /></SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10 text-white">
                  {options.storage.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-6 items-center">
          <Link href="/admin/catalog" className="text-white/40 hover:text-white transition-colors text-sm font-medium">Cancelar</Link>
          <Button type="submit" size="lg" disabled={isSubmitting} className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
            {isSubmitting ? <><Loader2 className="size-4 mr-2 animate-spin" /> Procesando...</> : "Crear Dispositivo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
