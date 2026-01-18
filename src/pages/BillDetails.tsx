import { getBillById } from "@/API/BillsAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Receipt } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface BillItem {
  productId: string;
  name: string;
  image:string;
  qty: number;
  unitPrice: number;
  discount?: number;
}

interface BillDetailsType {
  _id: string;
  userId: string;
  userDetails:{
    address:{
      addressLine1: string, 
      addressLine2: string, 
      city: string, 
      state: string, 
      pincode: string
    }
    contact:{
      name: string, 
      email: string,
      mobileNumber: string
    }
  }
  
  amount: number;
  status: string; // "not_paid" | "paid" | "yet to be dispatch" | ...
  created_at: string;
  items: BillItem[];
}

export default function BillDetails() {
  const navigate = useNavigate();
  const { billId } = useParams<{ billId: string }>();

  const {
    data: bill,
    isLoading,
    isError,
    error,
  } = useQuery<BillDetailsType>({
    queryKey: ["Get-Bill-By-Id", billId],
    queryFn: () => getBillById(billId as string),
    enabled: !!billId,
  });
  console.log(bill);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateItemTotal = (price: number, quantity: number, discount: number = 0) => {
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const getPaymentStatus = (status: string) => {
    if (status === "not_paid") return "Not Paid";
    return "Paid";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <p className="text-muted-foreground">Loading bill details...</p>
      </div>
    );
  }

  if (isError || !bill) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/bills")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <p className="text-destructive mt-4">
          Failed to load bill: {(error as Error)?.message || "Bill not found"}
        </p>
      </div>
    );
  }

  const paymentStatus = getPaymentStatus(bill.status);

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
          <p className="text-muted-foreground mt-1">Bill ID: {bill._id}</p>
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
              <p className="font-medium">{bill._id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(bill.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge
                variant={paymentStatus === "Paid" ? "default" : "secondary"}
                className={
                  paymentStatus === "Paid"
                    ? "bg-green-500/10 text-green-700"
                    : "bg-amber-500/10 text-amber-700"
                }
              >
                {paymentStatus}
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
              <p className="font-medium">{bill.userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {bill.userDetails.contact.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">
                {bill.userDetails.contact.email || "N/A"}
              </p>
            </div>

            
            {
            bill.userDetails.address.addressLine1 &&
            <div>
              <p className="text-sm text-muted-foreground">Address Lane</p>
              <p className="font-medium">
                {bill.userDetails.address.addressLine1}
              </p>
            </div>
            }
            {
              bill.userDetails.address.city &&
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p className="font-medium">
                {bill.userDetails.address.city}
              </p>
            </div>
            }
            {
              bill.userDetails.address.state &&
            <div>
              <p className="text-sm text-muted-foreground">State</p>
              <p className="font-medium">
                {bill.userDetails.address.state}
              </p>
            </div>
            }
            {
              bill.userDetails.address.pincode &&
            <div>
              <p className="text-sm text-muted-foreground">Zip Code</p>
              <p className="font-medium">
                {bill.userDetails.address.pincode}
              </p>
            </div>
            }
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bill.items?.map((item, index) => (
              <div key={item.productId || index}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.qty} × ₹{item.unitPrice.toLocaleString()}
                      {item.discount && item.discount > 0 && (
                        <span className="ml-2 text-accent">
                          ({item.discount}% off)
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹
                    {bill.amount}
                  </p>
                </div>
                {index < bill.items.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}

            <Separator className="my-4" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-primary">
                ₹{bill.amount.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
