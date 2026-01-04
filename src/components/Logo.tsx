import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-warm flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
          <Flame className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Tank<span className="text-primary">Smart24</span><span className="text-muted-foreground text-sm">.de</span>
      </span>
    </Link>
  );
}
