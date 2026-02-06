import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Privacy Policy | Yavuli"
                description="Privacy Policy for Yavuli - The trusted student marketplace."
            />
            <Navbar />

            <main className="container mx-auto px-6 py-20 max-w-4xl">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Privacy Policy</h1>
                        <p className="text-slate-500 font-medium">Last updated: February 6, 2026</p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
                        <p>
                            At Yavuli, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us, such as when you create an account, list an item for sale, or communicate with other users. This may include your name, email address (typically your college email), and any other information you choose to provide.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, to facilitate transactions between users, and to communicate with you about your account and our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">4. Data Security</h2>
                        <p>
                            We implement reasonable security measures to protect your information from unauthorized access, loss, or misuse. However, no data transmission over the internet can be guaranteed to be 100% secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at founder@yavuli.app.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
