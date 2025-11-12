import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Shield, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-block mb-4">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-primary">About Yavuli</h1>
            <p className="text-xl text-muted-foreground">
              The Student Marketplace — Where Ideas, Skills, and Things Find New Homes
            </p>
          </div>

          <Card className="p-8 space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Yavuli was born from a simple idea — students helping students.
              We noticed that college life comes with limited budgets, unique needs, and endless creativity. So, we built a platform that brings all of it together — a safe, smart, and sustainable marketplace made exclusively for students across India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From second-hand textbooks and dorm furniture to gadgets and creative services — Yavuli makes it easy to buy, sell, or exchange what you need, all within your verified college community.
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 animate-fade-up">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Verified & Safe</h3>
              <p className="text-muted-foreground">
                Every member of Yavuli is verified through their college email, ensuring a trusted environment where real students connect and trade confidently.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Student Community</h3>
              <p className="text-muted-foreground">
                Built by students, for students, Yavuli is more than a marketplace — it’s a growing community of learners, creators, and entrepreneurs who believe in collaboration and value-sharing.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Easy Trading</h3>
              <p className="text-muted-foreground">
                List what you want to sell or offer in just a few clicks. Our intuitive design makes trading effortless — because college life is busy enough already.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Smart Pricing</h3>
              <p className="text-muted-foreground">
                Find quality items at fair prices. Every deal is powered by real student needs, not inflated rates — so you save more and waste less.
              </p>
            </Card>
          </div>

          <Card className="p-8 text-center space-y-4 animate-fade-up">
            <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              “Buy what you need. Sell what you don’t. Build your own circle of value.”
            </p>
            <p className="text-muted-foreground">
              We’re on a mission to empower every student to make smarter choices, support sustainable living, and build a trusted community that thrives on sharing and connection.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
