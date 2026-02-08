import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { FileText } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Terms of Service | Yavuli"
                description="Terms of Service for Yavuli - The trusted student marketplace."
            />
            <Navbar />

            <main className="container mx-auto px-6 py-20 max-w-4xl">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Terms of Service</h1>
                        <p className="text-slate-500 font-medium">Last updated: February 6, 2026</p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Yavuli, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">2. Eligibility</h2>
                        <p>
                            Yavuli is intended for use by college students. You must be at least 18 years old and currently enrolled in a recognized educational institution to use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">3. User Responsibilities</h2>
                        <p>
                            Users are responsible for the content they post and the transactions they engage in. You agree to provide accurate information and to use the platform in a lawful and respectful manner.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">4. Prohibited Items</h2>
                        <p>
                            Users may not list or sell illegal items, hazardous materials, or any other items prohibited by Yavuli's policies or applicable laws.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">5. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend access to our services immediately, without prior notice or liability, for any reason whatsoever, including breach of these Terms.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfService;
