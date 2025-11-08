import { useState } from "react";
import { Plus, Search, Filter, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/products/ProductTable";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: "1",
    name: "Ruby Gemstone",
    price: 15000,
    quantity: 25,
    discount: 10,
    availability: true,
    type: "Gemstone",
    category: "Precious Stones",
    image: "",
  },
  {
    id: "2",
    name: "Shri Yantra",
    price: 5000,
    quantity: 50,
    discount: 0,
    availability: true,
    type: "Yantra",
    category: "Sacred Items",
    image: "",
  },
  {
    id: "3",
    name: "Emerald Stone",
    price: 20000,
    quantity: 0,
    discount: 15,
    availability: false,
    type: "Gemstone",
    category: "Precious Stones",
    image: "",
  },
];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gemstones, yantras, and sacred items
          </p>
        </div>
        <Button
          onClick={() => navigate("/products/add")}
          className="bg-gradient-saffron"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, type, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search query"
              : "Get started by adding your first product"}
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate("/products/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      ) : (
        <ProductTable products={filteredProducts} onDelete={handleDelete} />
      )}
    </div>
  );
}
