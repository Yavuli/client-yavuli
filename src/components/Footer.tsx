import { useNavigate } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
    const navigate = useNavigate();

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
                            <li><button onClick={() => navigate('/login')} className="hover:text-primary transition-colors">Sign In</button></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Policy</h4>
                        <ul className="space-y-2 text-sm text-slate-500 font-medium">
                            <li><button onClick={() => toast.info("Safety Tips coming soon!")} className="hover:text-primary transition-colors">Safety Tips</button></li>
                            <li><button onClick={() => navigate('/policy')} className="hover:text-primary transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">Terms of Service</button></li>
                        </ul>
                    </div>
                    <div className="space-y-4 col-span-2 lg:col-span-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Contact</h4>
                        <div className="space-y-2 text-sm text-slate-500 font-medium">
                            <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> +91 8000363769</p>
                            <p className="flex items-center gap-2 max-w-[200px] break-all"><Mail className="h-3 w-3" /> founder@yavuli.app</p>
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
