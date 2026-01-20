import { getProductByIdAPI, updateProductAPI } from "@/API/ProductAPI";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: product,
    isError,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["Get-Product-By-Id", id],
    queryFn: () => getProductByIdAPI(id as string),
    enabled: !!id,
  });

 

  const handleSubmit = async (formValues: any) => {
    if (!id) return;

    try {
      
      setIsSaving(true);
      console.log("Updating product:", id, formValues);

      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("price", formValues.price);
      formData.append("quantity", formValues.quantity);
      formData.append("type", formValues.type);
      formData.append("category", formValues.category || "");
      formData.append("description", formValues.description || "");
      formData.append("discount", String(formValues.discount ?? 0));
      formData.append("availability", String(formValues.availability));
      formData.append("benefits", formValues.benefits?.join() || []);
      formData.append("weight",String(formValues.Weight));
      // toDelete is an array -> send as JSON string
      if (Array.isArray(formValues.toDelete) && formValues.toDelete.length > 0) {
        formData.append("toDelete", JSON.stringify(formValues.toDelete));
      }

      // new images from form (ProductForm puts ONLY new files into image[])
      if (Array.isArray(formValues.image)) {
        formValues.image.forEach((file: File) => {
          formData.append("image", file);
        });
      }

      const resp = await updateProductAPI(formData, id);

      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
      await refetch();
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update",
        description: "The product could not be updated.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Basic loading / error handling
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="space-y-6 max-w-4xl">
        <p className="text-destructive">
          Failed to load product: {(error as Error)?.message || "Unknown error"}
        </p>
        <Button variant="outline" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  // Map API product to ProductForm initialData
  const initialData = {
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    discount: product.discount ?? 0,
    availability: product.availability ?? true,
    type: product.type,
    category: product.category ?? "",
    description: product.description ?? "",
    benefits: product.benefits || [],
    Weight: product.weight||0,
    // This is used by your ProductForm for previews
    existingImages: product.images || (product.image ? [product.image] : []),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-1">
            Update the product details
          </p>
        </div>
      </div>

      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
}
