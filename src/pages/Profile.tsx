import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Package,
  TrendingUp,
  ShoppingBag,
  Heart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { paymentsAPI } from "@/lib/api";

interface Transaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_date: string;
  created_at: string;
}

interface PurchasesResponse {
  success: boolean;
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SalesResponse {
  success: boolean;
  transactions: Transaction[];
  totalEarnings: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for purchases and sales
  const [purchases, setPurchases] = useState<Transaction[]>([]);
  const [sales, setSales] = useState<Transaction[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [errorPurchases, setErrorPurchases] = useState<string | null>(null);
  const [errorSales, setErrorSales] = useState<string | null>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;

      try {
        setLoadingPurchases(true);
        setErrorPurchases(null);
        const response = (await paymentsAPI.getPurchases(1, 10)) as PurchasesResponse;

        if (response.success) {
          setPurchases(response.transactions || []);
        } else {
          setErrorPurchases("Failed to load purchases");
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setErrorPurchases("Failed to load purchases");
      } finally {
        setLoadingPurchases(false);
      }
    };

    fetchPurchases();
  }, [user]);

  // Fetch sales
  useEffect(() => {
    const fetchSales = async () => {
      if (!user) return;

      try {
        setLoadingSales(true);
        setErrorSales(null);
        const response = (await paymentsAPI.getSales(1, 10)) as SalesResponse;

        if (response.success) {
          setSales(response.transactions || []);
          setTotalEarnings(response.totalEarnings || 0);
        } else {
          setErrorSales("Failed to load sales");
        }
      } catch (err) {
        console.error("Error fetching sales:", err);
        setErrorSales("Failed to load sales");
      } finally {
        setLoadingSales(false);
      }
    };

    fetchSales();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="mb-4">Please sign in to view your profile</p>
          <Button onClick={() => navigate("/auth/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const userInitials = user.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-hero text-white text-2xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {user.user_metadata?.full_name || "User"}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Badge className="bg-accent text-white">✓ Verified</Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Member since{" "}
                    {new Date(user.created_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Purchases</p>
                <p className="text-3xl font-bold">{purchases.length}</p>
              </div>
              <ShoppingBag className="h-10 w-10 text-blue-600 dark:text-blue-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">₹{totalEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 dark:text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sales</p>
                <p className="text-3xl font-bold">{sales.length}</p>
              </div>
              <Package className="h-10 w-10 text-purple-600 dark:text-purple-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="purchases" className="space-y-6 animate-fade-up">
          <TabsList className="grid w-full max-w-2xl grid-cols-2">
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
            <TabsTrigger value="sales">My Sales</TabsTrigger>
          </TabsList>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-4">
            {loadingPurchases ? (
              <Card className="p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="ml-3 text-muted-foreground">Loading purchases...</p>
              </Card>
            ) : errorPurchases ? (
              <Card className="p-6 border-destructive bg-destructive/5">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">{errorPurchases}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try refreshing the page
                    </p>
                  </div>
                </div>
              </Card>
            ) : purchases.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping by exploring our listings
                </p>
                <Button onClick={() => navigate("/explore")}>
                  Browse Listings
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <Card
                    key={purchase.id}
                    className="p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          Transaction ID: {purchase.id.substring(0, 8)}...
                        </p>
                        <p className="font-semibold text-lg">
                          ₹{purchase.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(
                            purchase.transaction_date || purchase.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            purchase.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            purchase.status === "completed"
                              ? "bg-green-600"
                              : ""
                          }
                        >
                          {purchase.status.charAt(0).toUpperCase() +
                            purchase.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-4">
            {loadingSales ? (
              <Card className="p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="ml-3 text-muted-foreground">Loading sales...</p>
              </Card>
            ) : errorSales ? (
              <Card className="p-6 border-destructive bg-destructive/5">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">{errorSales}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try refreshing the page
                    </p>
                  </div>
                </div>
              </Card>
            ) : sales.length === 0 ? (
              <Card className="p-8 text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No sales yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create listings and start selling your items
                </p>
                <Button onClick={() => navigate("/sell")}>Sell Now</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <Card
                    key={sale.id}
                    className="p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">
                          Transaction ID: {sale.id.substring(0, 8)}...
                        </p>
                        <p className="font-semibold text-lg text-green-600">
                          +₹{sale.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(
                            sale.transaction_date || sale.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            sale.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            sale.status === "completed"
                              ? "bg-green-600"
                              : ""
                          }
                        >
                          {sale.status.charAt(0).toUpperCase() +
                            sale.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
