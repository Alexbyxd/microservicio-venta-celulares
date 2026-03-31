"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, DeviceMobile } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { catalogService } from "@/lib/catalog-service";

const options = {
  currency: ["USD", "EUR", "MXN"],
  category: ["Celulares", "Tablets", "Accesorios", "Smartwatches"],
  color: ["Negro", "Blanco", "Azul", "Verde", "Dorado", "Rojo", "Plata", "Gris"],
  storage: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  condition: ["Nuevo", "Usado", "Reacondicionado"],
  os: ["Android", "iOS", "HarmonyOS", "Other"],
  processor: ["Snapdragon", "Exynos", "A-Series", "Dimensity", "Helio", "Tensor"],
  connectivity: ["5G", "4G", "3G", "WiFi", "Bluetooth", "NFC"],
};

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
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
  images: z.string().optional(),
  featured: z.boolean().optional(),
  stock: z.coerce.number().min(0).optional(),
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
  images?: string;
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

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      description: "",
      price: 0,
      currency: "USD",
      sku: "",
      barcode: "",
      category: "",
      subcategory: "",
      color: "",
      storage: "",
      ram: "",
      condition: "",
      carrierLock: "",
      images: "",
      featured: false,
      stock: 0,
      tags: "",
      specifications: {
        processor: "",
        screenSize: "",
        screenResolution: "",
        battery: "",
        mainCamera: "",
        frontCamera: "",
        os: "",
        connectivity: "",
        dimensions: "",
        weight: "",
        nfc: false,
        dualSim: false,
        fingerprint: false,
        faceUnlock: false,
        expandableMemory: false,
      },
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const imagesArray = data.images
        ? data.images.split(",").map((url) => url.trim()).filter(Boolean)
        : undefined;

      const tagsArray = data.tags
        ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : undefined;

      const connectivityArray = data.specifications?.connectivity
        ? data.specifications.connectivity.split(",").map((c) => c.trim()).filter(Boolean)
        : undefined;

      const productData = {
        ...data,
        images: imagesArray,
        tags: tagsArray,
        specifications: data.specifications
          ? {
              ...data.specifications,
              connectivity: connectivityArray,
            }
          : undefined,
      };

      await catalogService.createProduct(productData);
      toast.success("Producto creado exitosamente");
      router.push("/admin/catalog");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error al crear el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/catalog">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <DeviceMobile className="size-6" weight="fill" />
            Crear Nuevo Producto
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa los campos del formulario para registrar un nuevo producto
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Nombre *</FieldLabel>
              <Input id="name" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.brand}>
              <FieldLabel htmlFor="brand">Marca *</FieldLabel>
              <Input id="brand" {...form.register("brand")} />
              <FieldError errors={[form.formState.errors.brand]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.model}>
              <FieldLabel htmlFor="model">Modelo *</FieldLabel>
              <Input id="model" {...form.register("model")} />
              <FieldError errors={[form.formState.errors.model]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.price}>
              <FieldLabel htmlFor="price">Precio *</FieldLabel>
              <Input id="price" type="number" step="0.01" {...form.register("price")} />
              <FieldError errors={[form.formState.errors.price]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="currency">Moneda</FieldLabel>
              <Select
                value={form.watch("currency")}
                onValueChange={(value) => form.setValue("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Seleccionar moneda" />
                </SelectTrigger>
                <SelectContent>
                  {options.currency.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="sku">SKU</FieldLabel>
              <Input id="sku" {...form.register("sku")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="barcode">Código de Barras</FieldLabel>
              <Input id="barcode" {...form.register("barcode")} />
            </Field>

            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel htmlFor="description">Descripción *</FieldLabel>
              <Textarea id="description" {...form.register("description")} rows={3} />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atributos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="category">Categoría</FieldLabel>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {options.category.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="subcategory">Subcategoría</FieldLabel>
              <Input id="subcategory" {...form.register("subcategory")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="color">Color</FieldLabel>
              <Select
                value={form.watch("color")}
                onValueChange={(value) => form.setValue("color", value)}
              >
                <SelectTrigger id="color">
                  <SelectValue placeholder="Seleccionar color" />
                </SelectTrigger>
                <SelectContent>
                  {options.color.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="storage">Almacenamiento</FieldLabel>
              <Select
                value={form.watch("storage")}
                onValueChange={(value) => form.setValue("storage", value)}
              >
                <SelectTrigger id="storage">
                  <SelectValue placeholder="Seleccionar almacenamiento" />
                </SelectTrigger>
                <SelectContent>
                  {options.storage.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="ram">RAM</FieldLabel>
              <Select
                value={form.watch("ram")}
                onValueChange={(value) => form.setValue("ram", value)}
              >
                <SelectTrigger id="ram">
                  <SelectValue placeholder="Seleccionar RAM" />
                </SelectTrigger>
                <SelectContent>
                  {options.ram.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="condition">Condición</FieldLabel>
              <Select
                value={form.watch("condition")}
                onValueChange={(value) => form.setValue("condition", value)}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Seleccionar condición" />
                </SelectTrigger>
                <SelectContent>
                  {options.condition.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="carrierLock">Bloqueo de Operadora</FieldLabel>
              <Input id="carrierLock" {...form.register("carrierLock")} placeholder="ej: Liberado, AT&T, Verizon" />
            </Field>

            <Field>
              <FieldLabel htmlFor="stock">Stock</FieldLabel>
              <Input id="stock" type="number" {...form.register("stock")} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Imágenes y Otros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel htmlFor="images">Imágenes (URLs separadas por coma)</FieldLabel>
              <Input
                id="images"
                {...form.register("images")}
                placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="tags">Etiquetas (separadas por coma)</FieldLabel>
              <Input id="tags" {...form.register("tags")} placeholder="ej: Nuevo, 5G, Gama alta" />
            </Field>

            <FieldGroup>
              <Field className="flex-row items-center justify-between space-y-0">
                <FieldLabel htmlFor="featured">Producto Destacado</FieldLabel>
                <Switch
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", checked)}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Especificaciones Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="specifications.processor">Procesador</FieldLabel>
              <Select
                value={form.watch("specifications.processor")}
                onValueChange={(value) => form.setValue("specifications.processor", value)}
              >
                <SelectTrigger id="specifications.processor">
                  <SelectValue placeholder="Seleccionar procesador" />
                </SelectTrigger>
                <SelectContent>
                  {options.processor.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.screenSize">Tamaño de Pantalla</FieldLabel>
              <Input id="specifications.screenSize" {...form.register("specifications.screenSize")} placeholder="ej: 6.7 pulgadas" />
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.screenResolution">Resolución de Pantalla</FieldLabel>
              <Input id="specifications.screenResolution" {...form.register("specifications.screenResolution")} placeholder="ej: 2400 x 1080" />
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.battery">Batería</FieldLabel>
              <Input id="specifications.battery" {...form.register("specifications.battery")} placeholder="ej: 5000 mAh" />
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.mainCamera">Cámara Principal</FieldLabel>
              <Input id="specifications.mainCamera" {...form.register("specifications.mainCamera")} placeholder="ej: 108 MP" />
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.frontCamera">Cámara Frontal</FieldLabel>
              <Input id="specifications.frontCamera" {...form.register("specifications.frontCamera")} placeholder="ej: 32 MP" />
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.os">Sistema Operativo</FieldLabel>
              <Select
                value={form.watch("specifications.os")}
                onValueChange={(value) => form.setValue("specifications.os", value)}
              >
                <SelectTrigger id="specifications.os">
                  <SelectValue placeholder="Seleccionar SO" />
                </SelectTrigger>
                <SelectContent>
                  {options.os.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.connectivity">Conectividad</FieldLabel>
              <Input
                id="specifications.connectivity"
                {...form.register("specifications.connectivity")}
                placeholder="5G, 4G, WiFi, Bluetooth, NFC"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.dimensions">Dimensiones</FieldLabel>
              <Input id="specifications.dimensions" {...form.register("specifications.dimensions")} placeholder="ej: 160.9 x 76.5 x 8.3 mm" />
            </Field>

            <Field>
              <FieldLabel htmlFor="specifications.weight">Peso</FieldLabel>
              <Input id="specifications.weight" {...form.register("specifications.weight")} placeholder="ej: 200 g" />
            </Field>

            <FieldGroup>
              <Field className="flex-row items-center justify-between space-y-0">
                <FieldLabel htmlFor="specifications.nfc">NFC</FieldLabel>
                <Switch
                  id="specifications.nfc"
                  checked={form.watch("specifications.nfc")}
                  onCheckedChange={(checked) => form.setValue("specifications.nfc", checked)}
                />
              </Field>

              <Field className="flex-row items-center justify-between space-y-0">
                <FieldLabel htmlFor="specifications.dualSim">Dual SIM</FieldLabel>
                <Switch
                  id="specifications.dualSim"
                  checked={form.watch("specifications.dualSim")}
                  onCheckedChange={(checked) => form.setValue("specifications.dualSim", checked)}
                />
              </Field>

              <Field className="flex-row items-center justify-between space-y-0">
                <FieldLabel htmlFor="specifications.fingerprint">Huella Digital</FieldLabel>
                <Switch
                  id="specifications.fingerprint"
                  checked={form.watch("specifications.fingerprint")}
                  onCheckedChange={(checked) => form.setValue("specifications.fingerprint", checked)}
                />
              </Field>

              <Field className="flex-row items-center justify-between space-y-0">
                <FieldLabel htmlFor="specifications.faceUnlock">Desbloqueo Facial</FieldLabel>
                <Switch
                  id="specifications.faceUnlock"
                  checked={form.watch("specifications.faceUnlock")}
                  onCheckedChange={(checked) => form.setValue("specifications.faceUnlock", checked)}
                />
              </Field>

              <Field className="flex-row items-center justify-between space-y-0">
                <FieldLabel htmlFor="specifications.expandableMemory">Memoria Expandible</FieldLabel>
                <Switch
                  id="specifications.expandableMemory"
                  checked={form.watch("specifications.expandableMemory")}
                  onCheckedChange={(checked) => form.setValue("specifications.expandableMemory", checked)}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild type="button">
            <Link href="/admin/catalog">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Producto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
