
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Building, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-primary">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 animate-fade-up">
            {/* Contact Form */}
            <Card className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Rahul Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@college.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." rows={5} className="resize-none" />
                </div>
                <Button className="w-full bg-gradient-hero text-white">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="p-6 flex items-start gap-4 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Email Us</h3>
                  <p className="text-muted-foreground">support@yavuli.com</p>
                  <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start gap-4 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Live Chat</h3>
                  <p className="text-muted-foreground">Available Mon-Fri, 9am-6pm IST</p>
                  <p className="text-sm text-muted-foreground mt-1">Get instant help from our team</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start gap-4 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Office</h3>
                  <p className="text-muted-foreground">Delhi, India</p>
                  <p className="text-sm text-muted-foreground mt-1">Serving students across India</p>
                </div>
              </Card>

              <div className="text-center p-4 border border-dashed rounded-lg">
                  <h3 className="font-semibold text-primary">Quick Support</h3>
                  <p className="text-sm text-muted-foreground">For urgent issues, reach out directly via email and we'll prioritize your request.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
