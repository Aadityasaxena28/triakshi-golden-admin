import { getBills, updateBillStatusAPI } from "@/API/BillsAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Bill {
  _id: string;
  userId: string;
  amount: number;
  status: string;        // "not_paid" | "paid" | "yet to be dispatch" | "dispatch" | "Delivered"
  created_at: string;
  items: any[];
}

export default function Bills() {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<Bill[]>({
    queryKey: ["Get-Bills"],
    queryFn: () => getBills(),
    staleTime: 3 * 60 * 1000,
  });

  // integrate queried data into local state
  useEffect(() => {
    if (data) {
      setBills(data);
    }
  }, [data]);
const queryClient = useQueryClient();

const statusMutation = useMutation({
  mutationFn: updateBillStatusAPI,
  onSuccess: () => {
    toast({
      title: "Status Updated",
      description: "The bill status has been successfully updated.",
    });
    queryClient.invalidateQueries(["Get-Bills"]); // refresh table
  },
  onError: (error: any) => {
    toast({
      title: "Update Failed",
      description: error?.message || "Failed to update bill status",
      variant: "destructive",
    });
  },
});

const handleStatusChange = (billId: string, newStatus: string) => {
  // Optimistic UI update
  const previousBills = [...bills];

  setBills((prevBills) =>
    prevBills.map((bill) =>
      bill._id === billId ? { ...bill, status: newStatus } : bill
    )
  );

  // API call
  statusMutation.mutate(
    { id: billId, status: newStatus },
    {
      onError: () => {
        // rollback on failure
        setBills(previousBills);      
      },
    }
  );
};

  const filteredBills = bills.filter(
    (bill) =>
      bill._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // derive payment status from single `status` field
  const getPaymentStatus = (status: string) => {
    if (status === "not_paid") return "Not Paid";
    return "Paid";
  };

  // derive delivery status from single `status` field
  const getDeliveryStatus = (status: string) => {
    switch (status) {
      case "not_paid":
        return "Payment Pending";
      case "paid":
        return "Yet to be Dispatched";
      case "yet to be dispatch":
        return "Yet to be Dispatched";
      case "dispatch":
        return "Dispatched";
      case "Delivered":
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Loading bills...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">
          Failed to load bills: {(error as Error)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders & Bills</h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer orders and billing information
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by bill ID or user ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border border-border bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Bill ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-center">Payment Status</TableHead>
              <TableHead className="text-center">Order Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map((bill) => {
              const paymentStatus = getPaymentStatus(bill.status);
              const deliveryStatus = getDeliveryStatus(bill.status);

              return (
                <TableRow key={bill._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{bill._id}</TableCell>
                  <TableCell>{bill.userId}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{bill.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {bill.items?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={paymentStatus === "Paid" ? "default" : "secondary"}
                      className={
                        paymentStatus === "Paid"
                          ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                          : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                      }
                    >
                      {paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Select
                        value={bill.status}
                        onValueChange={(value) =>
                          handleStatusChange(bill._id, value)
                        }
                      >
                        <SelectTrigger className="w-[200px] bg-card">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          <SelectItem value="not_paid">Not Paid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="yet to be dispatch">
                            Yet to be Dispatched
                          </SelectItem>
                          <SelectItem value="dispatch">Dispatched</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground">
                        {deliveryStatus}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(bill.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/bills/${bill._id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
