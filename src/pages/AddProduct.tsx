import { ProductForm } from "@/components/products/ProductForm";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddProduct() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Adding product:", data);
    // TODO: Call API endpoint POST /api/products/add-product
    toast({
      title: "Product added",
      description: "The product has been successfully added to your inventory.",
    });
    navigate("/products");
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

      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
