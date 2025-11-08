import { ArrowLeft, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";

// Mock data - replace with actual API call
const mockBillDetails = {
  id: "BILL001",
  userId: "USER123",
  userName: "Rajesh Kumar",
  userEmail: "rajesh@example.com",
  totalAmount: 25000,
  paymentStatus: "Paid",
  createdAt: "2024-01-15T10:30:00Z",
  items: [
    {
      productId: "1",
      productName: "Ruby Gemstone",
      quantity: 1,
      price: 15000,
      discount: 10,
    },
    {
      productId: "2",
      productName: "Shri Yantra",
      quantity: 2,
      price: 5000,
      discount: 0,
    },
  ],
};

export default function BillDetails() {
  const navigate = useNavigate();
  const { billId } = useParams();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateItemTotal = (price: number, quantity: number, discount: number) => {
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/bills")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bill Details</h1>
          <p className="text-muted-foreground mt-1">Bill ID: {billId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Bill Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Bill ID</p>
              <p className="font-medium">{mockBillDetails.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(mockBillDetails.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge
                variant={mockBillDetails.paymentStatus === "Paid" ? "default" : "secondary"}
                className={
                  mockBillDetails.paymentStatus === "Paid"
                    ? "bg-green-500/10 text-green-700"
                    : "bg-amber-500/10 text-amber-700"
                }
              >
                {mockBillDetails.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium">{mockBillDetails.userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{mockBillDetails.userName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{mockBillDetails.userEmail}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBillDetails.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                      {item.discount > 0 && (
                        <span className="ml-2 text-accent">
                          ({item.discount}% off)
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{calculateItemTotal(item.price, item.quantity, item.discount).toLocaleString()}
                  </p>
                </div>
                {index < mockBillDetails.items.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}

            <Separator className="my-4" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-primary">
                ₹{mockBillDetails.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
