import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  location_city: string;
  college_name: string;
  condition: string;
  verified?: boolean;
  seller_phone?: string;
  seller_name?: string;
}

const ProductCard = ({
  id,
  title,
  price,
  images,
  location_city,
  college_name,
  condition,
  verified,
  seller_phone,
  seller_name,
}: ProductCardProps) => {

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 border-slate-100 rounded-[2rem]">
      {/* Container for Image + Badge */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* LINK: Wraps the image */}
        <Link to={`/product/${id}`} className="block h-full w-full">
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* BADGE: Outside the link */}
        <Badge className="absolute top-2 left-2 bg-accent text-white pointer-events-none z-10">
          {condition}
        </Badge>
      </div>

      {/* Card Details Section */}
      <div className="p-3 space-y-2">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-lg font-bold text-primary">₹{price.toLocaleString()}</p>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{location_city}</span>
          {verified && (
            <Badge variant="outline" className="ml-auto text-xs h-5 px-1 border-accent text-accent">
              ✓ Verified
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-1">{college_name}</p>

        {seller_phone && (
          <p className="text-xs font-medium text-primary line-clamp-1">
            📞 {seller_phone} {seller_name ? `• ${seller_name}` : ''}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;