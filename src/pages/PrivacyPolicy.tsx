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
                            At Yavuli, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. We are committed to protecting your personal data and your right to privacy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us, such as when you create an account, list an item for sale, or communicate with other users. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Profile Information:</strong> Name, email address, and profile picture.</li>
                            <li><strong>Google User Data:</strong> When you sign in via Google, we receive your Google ID, email address, name, and profile picture URL.</li>
                            <li><strong>Transaction Data:</strong> Details about items you list and purchases you make.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">3. How We Use Google User Data</h2>
                        <p>
                            We use your Google account information specifically for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Identity Verification:</strong> To ensure that users are genuine students and to prevent fraudulent accounts.</li>
                            <li><strong>Personalization:</strong> To display your name and profile picture within the app for a personalized experience.</li>
                            <li><strong>Communication:</strong> To send important updates regarding your account or transactions.</li>
                        </ul>
                        <p className="italic">We do not use your Google data for any purposes other than those described above. We do not sell your personal data to third parties.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">4. Data Sharing and Disclosure</h2>
                        <p>
                            We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processing via Stripe) or if required by law. We do not sell, trade, or otherwise transfer your Google user data to outside parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">5. Data Retention and Deletion</h2>
                        <p>
                            We retain your personal data for as long as your account is active. You have the right to request the deletion of your account and all associated data at any time.
                        </p>
                        <p>
                            To request data deletion, please email us at <strong>founder@yavuli.app</strong>. Upon receiving your request, we will delete your personal information from our active databases within 30 days.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">6. User Rights</h2>
                        <p>
                            Under certain privacy laws, you have rights regarding your personal data, including the right to access, correct, or delete your data. If you wish to exercise any of these rights, please contact us.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">7. Security</h2>
                        <p>
                            We implement reasonable security measures to protect your information from unauthorized access, loss, or misuse. However, no data transmission over the internet can be guaranteed to be 100% secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy or our data practices, please contact us at:
                            <br />
                            <strong>Email:</strong> founder@yavuli.app
                            <br />
                            <strong>Address:</strong> Yavuli Marketplace, Registered in India.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
