import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-secondary/30 pt-16 pb-8 border-t border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
                                <span className="text-lg font-bold">Y</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                Yavuli
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            The trusted marketplace for students. Buy, sell, and connect with your campus community securely.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Marketplace</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/explore" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Browse Items
                                </Link>
                            </li>
                            <li>
                                <Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Sell an Item
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/safety" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Safety Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/feedback" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Give Feedback
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/guidelines" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Community Guidelines
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Yavuli. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
                        <span>for students</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
