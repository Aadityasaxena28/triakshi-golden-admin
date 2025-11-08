import { ProductForm } from "@/components/products/ProductForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API call
const mockProduct = {
  name: "Ruby Gemstone",
  price: 15000,
  quantity: 25,
  discount: 10,
  availability: true,
  type: "Gemstone",
  category: "Precious Stones",
  description: "A beautiful natural ruby gemstone with excellent clarity",
  image: "",
};

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = (data: any) => {
    console.log("Updating product:", id, data);
    // TODO: Call API endpoint PUT /api/products/:id
    toast({
      title: "Product updated",
      description: "The product has been successfully updated.",
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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-1">
            Update the product details
          </p>
        </div>
      </div>

      <ProductForm initialData={mockProduct} onSubmit={handleSubmit} />
    </div>
  );
}
