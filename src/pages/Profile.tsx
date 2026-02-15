import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Calendar,
  Package,
  TrendingUp,
  ShoppingBag,
  Heart,
  Loader2,
  AlertCircle,
  Settings,
  Landmark,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { listingsAPI, paymentsAPI, usersAPI } from "@/lib/api";

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
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [errorListings, setErrorListings] = useState<string | null>(null);

  // Bank details state
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [holderName, setHolderName] = useState("");
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({});
  const [loadingBank, setLoadingBank] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [bankFetched, setBankFetched] = useState(false);

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

  // Fetch user's listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;

      try {
        setLoadingListings(true);
        setErrorListings(null);
        const listings = await listingsAPI.getMine();
        setMyListings(listings);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setErrorListings("Failed to load listings");
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings();
  }, [user]);

  const handleDeleteListing = async (listingId: string) => {
    if (!listingId) return;

    try {
      await listingsAPI.remove(listingId);
      setMyListings((prev) => prev.filter((listing) => listing.id !== listingId));
      toast.success("Listing removed successfully");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to remove listing. Please try again.");
    }
  };

  // Fetch bank details (called once when Settings tab is first opened)
  const fetchBankDetails = useCallback(async () => {
    if (bankFetched || !user) return;
    try {
      setLoadingBank(true);
      const data = await usersAPI.getBankDetails();
      setBankAccount(data.bank_account_number || "");
      setIfscCode(data.bank_ifsc || "");
      setHolderName(data.bank_holder_name || "");
      setBankFetched(true);
    } catch (err: any) {
      // 404 means no details saved yet — that's fine
      if (err?.response?.status !== 404) {
        console.error("Error fetching bank details:", err);
      }
      setBankFetched(true);
    } finally {
      setLoadingBank(false);
    }
  }, [bankFetched, user]);

  // Validate bank form
  const validateBankForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!bankAccount.trim()) {
      errors.bankAccount = "Account number is required";
    } else if (!/^\d+$/.test(bankAccount.trim())) {
      errors.bankAccount = "Account number must contain only digits";
    } else if (bankAccount.trim().length < 9 || bankAccount.trim().length > 18) {
      errors.bankAccount = "Account number must be 9–18 digits";
    }

    if (!ifscCode.trim()) {
      errors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode.trim())) {
      errors.ifscCode = "Enter a valid IFSC code (e.g. SBIN0001234)";
    }

    if (!holderName.trim()) {
      errors.holderName = "Account holder name is required";
    } else if (holderName.trim().length < 2) {
      errors.holderName = "Name must be at least 2 characters";
    }

    setBankErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save bank details
  const handleSaveBankDetails = async () => {
    if (!validateBankForm()) return;

    try {
      setSavingBank(true);
      await usersAPI.saveBankDetails({
        bankAccount: bankAccount.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        holderName: holderName.trim(),
      });
      setIfscCode((prev) => prev.toUpperCase());
      toast.success("Bank details saved successfully!");
    } catch (error) {
      console.error("Error saving bank details:", error);
      toast.error("Failed to save bank details. Please try again.");
    } finally {
      setSavingBank(false);
    }
  };

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
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
            <TabsTrigger value="sales">My Sales</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="settings" onClick={fetchBankDetails}>
              <Settings className="h-4 w-4 mr-1.5" />
              Settings
            </TabsTrigger>
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

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            {loadingListings ? (
              <Card className="p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="ml-3 text-muted-foreground">Loading listings...</p>
              </Card>
            ) : errorListings ? (
              <Card className="p-6 border-destructive bg-destructive/5">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">{errorListings}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try refreshing the page
                    </p>
                  </div>
                </div>
              </Card>
            ) : myListings.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first listing to start selling
                </p>
                <Button onClick={() => navigate("/sell")}>Create Listing</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {myListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="p-4 md:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={listing.images?.[0] || "/placeholder.jpg"}
                        alt={listing.title}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{listing.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          ₹{Number(listing.price).toLocaleString()} · {listing.condition}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Posted on {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'} className="mt-2 w-fit">
                          {listing.status === 'active' ? 'Published' : listing.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => navigate(`/product/${listing.id}`)}>
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab — Bank Details */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10">
                  <Landmark className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Bank Details</h2>
                  <p className="text-sm text-muted-foreground">
                    Add your bank account for receiving payouts from sales
                  </p>
                </div>
              </div>

              <Separator className="mb-6" />

              {loadingBank ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <p className="ml-3 text-muted-foreground">Loading bank details…</p>
                </div>
              ) : (
                <div className="space-y-5 max-w-lg">
                  {/* Account Number */}
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount" className="text-sm font-medium">
                      Account Number
                    </Label>
                    <Input
                      id="bankAccount"
                      placeholder="Enter your bank account number"
                      value={bankAccount}
                      onChange={(e) => {
                        setBankAccount(e.target.value);
                        setBankErrors((prev) => ({ ...prev, bankAccount: "" }));
                      }}
                      className={bankErrors.bankAccount ? "border-destructive" : ""}
                    />
                    {bankErrors.bankAccount && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {bankErrors.bankAccount}
                      </p>
                    )}
                  </div>

                  {/* IFSC Code */}
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode" className="text-sm font-medium">
                      IFSC Code
                    </Label>
                    <Input
                      id="ifscCode"
                      placeholder="e.g. SBIN0001234"
                      value={ifscCode}
                      maxLength={11}
                      onChange={(e) => {
                        setIfscCode(e.target.value.toUpperCase());
                        setBankErrors((prev) => ({ ...prev, ifscCode: "" }));
                      }}
                      className={bankErrors.ifscCode ? "border-destructive" : ""}
                    />
                    {bankErrors.ifscCode && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {bankErrors.ifscCode}
                      </p>
                    )}
                  </div>

                  {/* Account Holder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="holderName" className="text-sm font-medium">
                      Account Holder Name
                    </Label>
                    <Input
                      id="holderName"
                      placeholder="Name as per bank records"
                      value={holderName}
                      onChange={(e) => {
                        setHolderName(e.target.value);
                        setBankErrors((prev) => ({ ...prev, holderName: "" }));
                      }}
                      className={bankErrors.holderName ? "border-destructive" : ""}
                    />
                    {bankErrors.holderName && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {bankErrors.holderName}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleSaveBankDetails}
                    disabled={savingBank}
                    className="mt-2 min-w-[140px]"
                  >
                    {savingBank ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Save Bank Details
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
