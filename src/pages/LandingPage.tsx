import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Trade Smarter, Safer, and Simpler — Only at Yavuli.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The trusted marketplace built by students, for students — verified by college email, powered by modern tech.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-shadow duration-300 ease-in-out shadow-lg hover:shadow-glow">Start Selling</Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-accent hover:text-accent-foreground animate-pulse">Explore Listings</Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Why Yavuli? Section */}
      <section className="py-16 md:py-24 bg-background" style={{ backgroundImage: "var(--pattern-dotted)", backgroundSize: "20px 20px" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Yavuli?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ 
              { title: "Verified College Users Only", description: "Ensuring a safe and trusted community for all transactions." },
              { title: "Easy Listing with Photos & Details", description: "Create beautiful and effective listings in just a few minutes." },
              { title: "Real-Time Chat System", description: "Communicate securely and instantly with buyers and sellers." },
              { title: "Secure Payments & Tracking", description: "Integrated payment system to protect your funds and track your deals." },
              { title: "Live Updates with Supabase", description: "Experience a modern, fast, and responsive marketplace." },
              { title: "Manual Review for Safety", description: "Our team manually reviews listings to maintain a high standard of quality." }
            ].map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-transparent hover:border-primary">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted" style={{ backgroundImage: "var(--pattern-lined)" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-card p-8 rounded-lg shadow-md text-center flex-1">
              <h3 className="text-2xl font-bold mb-2">1️⃣ Sign Up</h3>
              <p className="text-muted-foreground">Verify with your campus email.</p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md text-center flex-1">
              <h3 className="text-2xl font-bold mb-2">2️⃣ List or Browse</h3>
              <p className="text-muted-foreground">Upload or discover deals nearby.</p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md text-center flex-1">
              <h3 className="text-2xl font-bold mb-2">3️⃣ Chat & Complete</h3>
              <p className="text-muted-foreground">Secure communication and payments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Built with Confidence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">Frontend</h3>
              <p className="text-muted-foreground">React + Tailwind CSS for frontend precision.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">Backend</h3>
              <p className="text-muted-foreground">Node.js, Express, and Supabase for backend reliability.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">Deployment</h3>
              <p className="text-muted-foreground">Vercel for the frontend and Render for the backend.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">Security</h3>
              <p className="text-muted-foreground">JWT, HTTPS, and 2FA for robust security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Student Revolution CTA */}
      <section className="py-16 md:py-24 text-center text-white" style={{ backgroundImage: "var(--gradient-cta)" }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Yavuli is redefining campus commerce.</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">Safe, simple, and built for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Get Started</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-2">Yavuli</h3>
              <p className="text-sm">Made with 💛 by students — Yavuli, founded by Kishlaya and team.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Quick Links</h3>
              <ul className="text-sm">
                <li><a href="#" className="hover:text-primary">Home</a></li>
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Contact</h3>
              <ul className="text-sm">
                <li>support@yavuli.in</li>
                <li>www.yavuli.in</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm mt-8 pt-8 border-t border-muted-foreground">
            <p>Empowering students to trade smarter — one campus at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
