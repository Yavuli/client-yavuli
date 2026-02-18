import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Search,
    MessageCircle,
    MapPin,
    Phone,
    ShoppingCart,
    Trash2,
    AlertTriangle,
    ArrowRight,
    CreditCard,
} from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Browse & Explore",
        description:
            "Head to the Explore page to discover listings from your campus community. Use the search bar to find exactly what you need — books, electronics, fashion, and more.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: MessageCircle,
        title: "Chat with the Seller",
        description:
            "Found something you like? Use the built-in chat to negotiate the price, ask questions, and finalize the deal directly with the seller.",
        color: "from-violet-500 to-purple-500",
    },
    {
        icon: MapPin,
        title: "Pick a Location & Meet",
        description:
            "Agree on a safe meeting spot on campus. You can also call the seller directly from the product page to coordinate pickup.",
        color: "from-emerald-500 to-green-500",
    },
    {
        icon: Phone,
        title: "Call the Seller",
        description:
            "If you prefer a quick call over chat, tap the 'Call Seller' button on any product page to reach them instantly.",
        color: "from-amber-500 to-orange-500",
    },
    {
        icon: ShoppingCart,
        title: "Complete Your Purchase",
        description:
            "Add items to your cart and proceed to checkout. You'll see a summary of your order before confirming.",
        color: "from-rose-500 to-pink-500",
    },
    {
        icon: Trash2,
        title: "Remove Your Listing After Sale",
        description:
            "Once you've sold an item, go to your Profile → Listings tab and delete the listing so it's no longer visible to other buyers.",
        color: "from-red-500 to-rose-500",
    },
];

const HowToUse = () => {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="How to Use Yavuli | Step-by-Step Guide"
                description="Learn how to buy and sell on Yavuli, the student marketplace. Browse listings, chat with sellers, and complete purchases easily."
            />
            <Navbar />

            <main className="container mx-auto px-6 py-16 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                        How to Use Yavuli
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Your step-by-step guide to buying and selling on the student
                        marketplace.
                    </p>
                </div>

                {/* Payment Disclaimer */}
                <Card className="mb-14 p-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex gap-4 items-start">
                        <div className="p-2.5 rounded-xl bg-amber-100 shrink-0">
                            <CreditCard className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="font-bold text-amber-900">
                                    Payments — Work in Progress
                                </h3>
                                <Badge className="bg-amber-500 text-white text-[10px] px-2">
                                    BETA
                                </Badge>
                            </div>
                            <p className="text-amber-800 text-sm leading-relaxed">
                                Razorpay payment integration is currently under development.
                                Online payments may not work as expected yet. For now, we
                                recommend meeting the seller in person to complete transactions
                                safely.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 hidden md:block" />

                    <div className="space-y-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className="relative flex gap-6 items-start group"
                                >
                                    {/* Step Number + Icon */}
                                    <div className="relative z-10 shrink-0">
                                        <div
                                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <Card className="flex-1 p-5 hover:shadow-md transition-shadow border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                                            {step.title}
                                            <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Important Note */}
                <Card className="mt-14 p-6 border-slate-200 bg-slate-50">
                    <div className="flex gap-4 items-start">
                        <div className="p-2.5 rounded-xl bg-slate-200 shrink-0">
                            <AlertTriangle className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1.5">
                                Important Note
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                After selling an item, please remember to{" "}
                                <strong>delete your listing</strong> from your profile. If you
                                don't, the app will continue to display the listing as
                                available, and you may receive messages from interested buyers.
                                Payment setup reminders will also appear if your bank details
                                haven't been configured yet.
                            </p>
                        </div>
                    </div>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default HowToUse;
