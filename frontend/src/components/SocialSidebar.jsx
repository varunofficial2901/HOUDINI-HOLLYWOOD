import { useEffect, useRef, useState } from "react";
import { Linkedin, Instagram, Twitter, Youtube } from "lucide-react";

export default function SocialSidebar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current < 80) setVisible(true);
      else if (current > lastScrollY.current) setVisible(false);
      else setVisible(true);

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { icon: Linkedin, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  return (
    <div
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4 transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
      }`}
    >
      <div className="w-px h-10 bg-gradient-to-b from-transparent to-violet-500/40" />

      {links.map((item, i) => {
        const Icon = item.icon;
        return (
          <a
            key={i}
            href={item.href}
            className="w-10 h-10 rounded-xl flex items-center justify-center
            bg-white/5 border border-white/10 text-slate-400
            hover:text-violet-400 hover:border-violet-500/40 transition"
          >
            <Icon size={18} />
          </a>
        );
      })}

      <div className="w-px h-10 bg-gradient-to-t from-transparent to-violet-500/40" />
    </div>
  );
}