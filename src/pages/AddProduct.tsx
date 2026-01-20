import { AddProductAPI } from "@/API/ProductAPI";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ProductSubmitPayload = {
  name: string;
  price: number;
  quantity: number;
  type: string;
  category?: string;
  description?: string;
  discount?: number;
  availability: boolean;
  benefits: [string];   // from ProductForm
  Weight?:number;
  image: File[];      // from ProductForm
  toDelete: string[];
};
export default function AddProduct() {
  const navigate = useNavigate();
  const [isLoading,setLoading] = useState<boolean>(false)
  const handleSubmit = async (data: ProductSubmitPayload) => {
    try {
      // console.log("Form payload (before FormData):", data);
      // setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      formData.append("quantity", String(data.quantity));
      formData.append("type", data.type);
      formData.append("category", data.category || "");
      formData.append("description", data.description || "");
      formData.append("discount", String(data.discount ?? 0));
      formData.append("availability", String(data.availability));
      formData.append("benefits", data.benefits?.join());
      formData.append("weight",String(data.Weight));
      // multiple images – backend should read `req.files` for "images"
      data.image.forEach((file) => {
        formData.append("image", file);
      });

      const resp = await AddProductAPI(formData);

      if (!resp.success) {
        throw new Error("Product ADD Failed");
      }

      toast({
        title: "Product added",
        description: "The product has been successfully added to your inventory.",
      });
      navigate("/products");
    } catch (error) {
      console.error(error);
      toast({
        title: "Product add failed",
        description: "The product could not be added to your inventory.",
      });
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to add a new gemstone or yantra
          </p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
