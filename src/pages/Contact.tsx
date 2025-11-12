<<<<<<< HEAD

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Building, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
=======
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, MapPin } from "lucide-react";
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
<<<<<<< HEAD
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-block mb-4">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
=======
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            <h1 className="text-4xl font-bold text-primary">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

<<<<<<< HEAD
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
=======
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-6 animate-fade-up">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Rahul Sharma"
                    className="focus:ring-accent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@college.edu"
                    className="focus:ring-accent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    className="focus:ring-accent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={5}
                    className="focus:ring-accent resize-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-hero text-white hover:shadow-glow">
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
                  Send Message
                </Button>
              </form>
            </Card>

<<<<<<< HEAD
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
=======
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-sm text-muted-foreground">support@yavuli.com</p>
                    <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Available Mon-Fri, 9am-6pm IST</p>
                    <p className="text-sm text-muted-foreground">Get instant help from our team</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office</h3>
                    <p className="text-sm text-muted-foreground">Delhi, India</p>
                    <p className="text-sm text-muted-foreground">Serving students across India</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-hero text-white">
                <h3 className="font-semibold mb-2">Quick Support</h3>
                <p className="text-sm text-white/90 mb-4">
                  For urgent issues, reach out directly via email and we'll prioritize your request.
                </p>
                <Button variant="outline" className="w-full bg-white text-primary hover:bg-white/90">
                  Priority Support
                </Button>
              </Card>
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
