import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import AddProduct from "./pages/AddProduct";
import AdminLogin from "./pages/admin_login";
import BillDetails from "./pages/BillDetails";
import Bills from "./pages/Bills";
import Dashboard from "./pages/Dashboard";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import RequireAuth from "./pages/RequireAuth";
import SlotManagement from "./pages/slot-booking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<AdminLogin/>}/>
          <Route element={<RequireAuth/>}>
          <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/products" element={<AdminLayout><Products /></AdminLayout>} />
          <Route path="/products/add" element={<AdminLayout><AddProduct /></AdminLayout>} />
          <Route path="/products/edit/:id" element={<AdminLayout><EditProduct /></AdminLayout>} />
          <Route path="/bills" element={<AdminLayout><Bills /></AdminLayout>} />
          <Route path="/bills/:billId" element={<AdminLayout><BillDetails /></AdminLayout>} />
          <Route path="/manage-slots" element={<AdminLayout><SlotManagement/></AdminLayout>}/>
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
