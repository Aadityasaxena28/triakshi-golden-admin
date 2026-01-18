import { deleteProduct, getProducts, getProductsCount } from "@/API/ProductAPI";
import { Pagination } from "@/components/products/Pagination";
import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Filter, Package, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productQuery = useQuery({
    queryKey: ["GetAllProducts", currentPage, ITEMS_PER_PAGE],
    queryFn: () => getProducts(currentPage, ITEMS_PER_PAGE),
  });

  const countQuery = useQuery({
    queryKey: ["GetProductsCount"],
    queryFn: () => getProductsCount(),
  });

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredProducts = productQuery.data?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Pagination calculations
  const totalItems = countQuery.data || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await productQuery.refetch();
    await countQuery.refetch();

    // Adjust current page if needed after deletion
    const newTotalItems = totalItems - 1;
    const newTotalPages = Math.ceil(newTotalItems / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    toast({
      title: "Product deleted",
      description: "The product has been successfully deleted.",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (productQuery.isLoading || productQuery.isFetching) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (productQuery.isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">
          Failed to load products:{" "}
          {(productQuery.error as Error)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gemstones, yantras, and sacred items
          </p>
          {countQuery.data && (
            <p className="text-sm text-muted-foreground mt-1">
              Total: {countQuery.data} products
            </p>
          )}
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
        <div className="space-y-4">
          <ProductTable products={filteredProducts} onDelete={handleDelete} />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
}