import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { ShoppingBag, Shield, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
=======
import { ShoppingBag, Shield, Users, TrendingUp } from "lucide-react";
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
<<<<<<< HEAD
        <Link to="/" className="inline-block mb-4">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
=======
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
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
<<<<<<< HEAD
              Yavuli was born from a simple idea — students helping students.
              We noticed that college life comes with limited budgets, unique needs, and endless creativity. So, we built a platform that brings all of it together — a safe, smart, and sustainable marketplace made exclusively for students across India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From second-hand textbooks and dorm furniture to gadgets and creative services — Yavuli makes it easy to buy, sell, or exchange what you need, all within your verified college community.
=======
              Yavuli was born from a simple observation: college students have unique needs and limited budgets. 
              We created a trusted marketplace exclusively for the student community in India, where you can buy, 
              sell, or exchange items and services with verified peers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform ensures safety through college email verification, making every transaction trustworthy. 
              Whether you're looking for textbooks, electronics, furniture, or services, Yavuli connects you with 
              fellow students who understand your needs.
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 animate-fade-up">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Verified & Safe</h3>
              <p className="text-muted-foreground">
<<<<<<< HEAD
                Every member of Yavuli is verified through their college email, ensuring a trusted environment where real students connect and trade confidently.
=======
                Every user is verified through their college email. Trade with confidence knowing 
                you're dealing with real students.
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Student Community</h3>
              <p className="text-muted-foreground">
<<<<<<< HEAD
                Built by students, for students, Yavuli is more than a marketplace — it’s a growing community of learners, creators, and entrepreneurs who believe in collaboration and value-sharing.
=======
                Built by students, for students. Connect with peers from colleges across India 
                and build your own circle of value.
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Easy Trading</h3>
              <p className="text-muted-foreground">
<<<<<<< HEAD
                List what you want to sell or offer in just a few clicks. Our intuitive design makes trading effortless — because college life is busy enough already.
=======
                Simple, intuitive interface makes buying and selling effortless. List items in 
                minutes and start trading immediately.
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Smart Pricing</h3>
              <p className="text-muted-foreground">
<<<<<<< HEAD
                Find quality items at fair prices. Every deal is powered by real student needs, not inflated rates — so you save more and waste less.
=======
                Get the best deals from motivated student sellers. Find quality items at 
                prices that fit your budget.
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
              </p>
            </Card>
          </div>

<<<<<<< HEAD
          <Card className="p-8 text-center space-y-4 animate-fade-up">
            <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              “Buy what you need. Sell what you don’t. Build your own circle of value.”
            </p>
            <p className="text-muted-foreground">
              We’re on a mission to empower every student to make smarter choices, support sustainable living, and build a trusted community that thrives on sharing and connection.
=======
          <Card className="p-8 bg-gradient-hero text-white text-center space-y-4 animate-fade-up">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              "Buy what you need. Sell what you don't. Build your own circle of value."
            </p>
            <p className="text-white/80">
              Empowering students to make smarter choices while building a sustainable, 
              trusted community marketplace.
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
