import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

// Mock data - replace with actual API calls
const mockBills = [
  {
    id: "BILL001",
    userId: "USER123",
    totalAmount: 25000,
    paymentStatus: "Paid",
    createdAt: "2024-01-15T10:30:00Z",
    itemCount: 3,
  },
  {
    id: "BILL002",
    userId: "USER456",
    totalAmount: 15000,
    paymentStatus: "Pending",
    createdAt: "2024-01-14T15:45:00Z",
    itemCount: 2,
  },
  {
    id: "BILL003",
    userId: "USER789",
    totalAmount: 50000,
    paymentStatus: "Paid",
    createdAt: "2024-01-13T09:20:00Z",
    itemCount: 5,
  },
];

export default function Bills() {
  const navigate = useNavigate();
  const [bills] = useState(mockBills);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBills = bills.filter(
    (bill) =>
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map((bill) => (
              <TableRow key={bill.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{bill.id}</TableCell>
                <TableCell>{bill.userId}</TableCell>
                <TableCell className="text-right font-semibold">
                  ₹{bill.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">{bill.itemCount}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={bill.paymentStatus === "Paid" ? "default" : "secondary"}
                    className={
                      bill.paymentStatus === "Paid"
                        ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                        : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                    }
                  >
                    {bill.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(bill.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/bills/${bill.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
