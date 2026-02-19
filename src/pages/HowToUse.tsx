import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Search,
    MessageCircle,
    MapPin,
    ShoppingCart,
    Handshake,
    Trash2,
    AlertTriangle,
    CreditCard,
    ArrowRight,
} from "lucide-react";

const buyerSteps = [
    {
        icon: Search,
        title: "Go to the Explore Page",
        description: "Browse through all the listings posted by students on your campus.",
        color: "from-blue-500 to-cyan-500",
        link: "/explore",
    },
    {
        icon: ShoppingCart,
        title: "Find What You Want & Add to Cart",
        description:
            "Search for the item you need — books, electronics, fashion, anything. Add it to your cart.",
        color: "from-violet-500 to-purple-500",
    },
    {
        icon: MessageCircle,
        title: "Contact or Chat with the Seller",
        description:
            "Use the in-app chat or call button to reach out to the seller directly.",
        color: "from-emerald-500 to-green-500",
    },
    {
        icon: MapPin,
        title: "Decide a Place to Meet",
        description:
            "Agree on a safe spot on campus to meet and inspect the item in person.",
        color: "from-amber-500 to-orange-500",
    },
    {
        icon: Handshake,
        title: "Make the Deal",
        description:
            "Meet the seller, check the item, and complete the purchase. Simple as that.",
        color: "from-rose-500 to-pink-500",
    },
];

const sellerSteps = [
    {
        icon: Trash2,
        title: "Delete Your Listing After Selling",
        description:
            "Once a buyer has purchased your item, go to your Listings and delete the sold listing so other buyers don't keep contacting you.",
        color: "from-red-500 to-rose-500",
        link: "/profile?tab=listings",
    },
];

const StepCard = ({
    step,
    index,
}: {
    step: (typeof buyerSteps)[0];
    index: number;
}) => {
    const Icon = step.icon;
    const content = (
        <div className="relative flex gap-5 items-start group">
            <div className="relative z-10 shrink-0">
                <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                </span>
            </div>
            <Card className="flex-1 p-5 hover:shadow-md transition-shadow border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    {step.title}
                    <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    {step.description}
                </p>
            </Card>
        </div>
    );

    if (step.link) {
        return (
            <Link to={step.link} className="block no-underline">
                {content}
            </Link>
        );
    }
    return content;
};

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
                <div className="text-center mb-14 space-y-4">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                        How to Use Yavuli
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Everything you need to know to start buying and selling on campus.
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
                                    Online Payments — Coming Soon
                                </h3>
                                <Badge className="bg-amber-500 text-white text-[10px] px-2">
                                    IN PROGRESS
                                </Badge>
                            </div>
                            <p className="text-amber-800 text-sm leading-relaxed">
                                Razorpay payment integration is still being set up, so online
                                payments may not work as expected right now. For the time being,
                                please meet the seller in person and settle the transaction
                                directly.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* FOR BUYERS */}
                <section className="mb-16">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-8">
                        For Buyers
                    </h2>
                    <div className="relative">
                        <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 hidden md:block" />
                        <div className="space-y-6">
                            {buyerSteps.map((step, i) => (
                                <StepCard key={i} step={step} index={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOR SELLERS */}
                <section className="mb-14">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-8">
                        For Sellers
                    </h2>
                    <div className="space-y-6">
                        {sellerSteps.map((step, i) => (
                            <StepCard key={i} step={step} index={i} />
                        ))}
                    </div>
                    <Card className="mt-6 p-5 border-slate-200 bg-slate-50">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 rounded-xl bg-slate-200 shrink-0">
                                <AlertTriangle className="h-5 w-5 text-slate-600" />
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                We're working on making this automatic — once a buyer completes
                                a purchase, the listing will be removed from the marketplace on
                                its own. Until then, please delete it manually from your
                                profile.
                            </p>
                        </div>
                    </Card>
                </section>

                {/* DISCORD CTA */}
                <Card className="p-6 border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50">
                    <div className="flex gap-4 items-start">
                        <div className="p-2.5 rounded-xl bg-indigo-100 shrink-0">
                            <svg
                                className="h-6 w-6 text-indigo-600"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 mb-1.5">
                                Join Our Discord Community
                            </h3>
                            <p className="text-indigo-800 text-sm leading-relaxed mb-3">
                                Be part of the early community! Report bugs, request features,
                                get announcements, or just hang out with other students.
                            </p>
                            <a
                                href="https://discord.gg/2Y5tPhMPqn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                                </svg>
                                Join Discord
                            </a>
                        </div>
                    </div>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default HowToUse;
