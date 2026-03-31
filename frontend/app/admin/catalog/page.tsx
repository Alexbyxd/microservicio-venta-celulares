"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { catalogService } from "@/lib/catalog-service";
import { Product, ProductQuery } from "@/types/catalog";

const filterOptions = {
  brand: ["Apple", "Samsung", "Xiaomi", "Huawei", "Motorola", "OnePlus", "Google"],
  category: ["Celulares", "Tablets", "Accesorios", "Smartwatches"],
  color: ["Negro", "Blanco", "Azul", "Verde", "Dorado", "Rojo", "Plata"],
  storage: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  condition: ["Nuevo", "Usado", "Reacondicionado"],
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductQuery>({});
  
  const fetchProducts = useCallback(async (query: ProductQuery) => {
    setIsLoading(true);
    try {
      const data = await catalogService.getProducts(query);
      setProducts(data);
    } catch (error) {
      toast.error("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, fetchProducts]);

  const handleFilterChange = (key: keyof ProductQuery, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas deshabilitar este producto?")) return;
    try {
      await catalogService.deleteProduct(id);
      toast.success("Producto deshabilitado correctamente");
      fetchProducts(filters);
    } catch (error) {
      toast.error("Error al deshabilitar el producto");
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Catálogo de Productos</h1>
        <Button asChild>
          <Link href="/admin/catalog/create">
            <Plus className="size-4 mr-2" />
            Crear Nuevo Celular
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select onValueChange={(value) => handleFilterChange("brand", value)} value={filters.brand || ""}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.brand.map((brand) => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleFilterChange("category", value)} value={filters.category || ""}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.category.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleFilterChange("color", value)} value={filters.color || ""}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.color.map((color) => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleFilterChange("storage", value)} value={filters.storage || ""}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Storage" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.storage.map((storage) => (
                  <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => handleFilterChange("ram", value)} value={filters.ram || ""}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="RAM" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.ram.map((ram) => (
                  <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="size-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="size-full object-cover" 
                          />
                        ) : (
                          <Smartphone className="size-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>
                      {product.currency || "$"}{product.price?.toLocaleString()}
                    </TableCell>
                    <TableCell>{product.stock || 0}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive !== false ? "default" : "secondary"}>
                        {product.isActive !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon-sm" asChild>
                          <Link href={`/admin/catalog/${product._id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon-sm" 
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
