import { useNavigate, Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <footer className="relative z-20 border-t border-slate-100 py-20 px-6 bg-white/60 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-6">
                    <div className="text-3xl font-black tracking-tighter text-slate-900">YAVULI</div>
                    <p className="text-slate-400 font-medium max-w-xs uppercase text-xs tracking-[0.2em]">
                        The premier marketplace for the next generation of students.
                    </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Navigation</h4>
                        <ul className="space-y-2 text-sm text-slate-500 font-medium">
                            <li><button onClick={() => navigate('/explore')} className="hover:text-primary transition-colors">Explore</button></li>
                            <li><button onClick={() => navigate('/sell')} className="hover:text-primary transition-colors">Sell Items</button></li>
                            <li>
                                {user ? (
                                    <button onClick={() => navigate('/profile')} className="hover:text-primary transition-colors">Profile</button>
                                ) : (
                                    <button onClick={() => navigate('/login')} className="hover:text-primary transition-colors">Sign In</button>
                                )}
                            </li>
                            <li><button onClick={() => navigate('/how-to-use')} className="hover:text-primary transition-colors">How to Use</button></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Policy</h4>
                        <ul className="space-y-2 text-sm text-slate-500 font-medium">
                            <li><button onClick={() => toast.info("Safety Tips coming soon!")} className="hover:text-primary transition-colors">Safety Tips</button></li>
                            <li><Link to="/policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4 col-span-2 lg:col-span-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Contact</h4>
                        <div className="space-y-2 text-sm text-slate-500 font-medium">
                            <a href="tel:+918000363769" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-3 w-3" /> +91 8000363769</a>
                            <a href="mailto:founder@yavuli.app" className="flex items-center gap-2 max-w-[200px] break-all hover:text-primary transition-colors"><Mail className="h-3 w-3" /> founder@yavuli.app</a>
                            <a href="https://discord.gg/2Y5tPhMPqn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" /></svg>
                                Join our Discord
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-20 text-center">
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.5em] uppercase opacity-50 pt-4">
                    © {new Date().getFullYear()} Yavuli Marketplace • Built For Students
                </p>
            </div>
        </footer>
    );
}
