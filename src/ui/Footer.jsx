import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  MessageCircleMore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <footer className="bg-stone-950 text-slate-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Tag Enterprises
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your trusted partner for premium products and exceptional
                service. Serving customers worldwide with quality and
                reliability.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-white">
                    Tag Enterprises (London) Limited
                  </p>
                  <p>32 George V Avenue</p>
                  <p>Pinner, London HA5 5SE</p>
                  <p>United Kingdom</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a
                  href="tel:+44..."
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  +44 (0) 20 1234 5678
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a
                  href="mailto:info@tagenterprises.co.uk"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  info@tagenterprises.co.uk
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Our Products",
                "Services",
                "Contact",
                "Careers",
                "Blog",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {[
                "Track Your Order",
                "Shipping Info",
                "Returns & Exchanges",
                "Size Guide",
                "FAQ",
                "Support Center",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Indicators */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Why Choose Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Free Shipping
                  </p>
                  <p className="text-xs text-slate-400">On orders over £50</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Easy Returns</p>
                  <p className="text-xs text-slate-400">30-day return policy</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Secure Payment
                  </p>
                  <p className="text-xs text-slate-400">SSL encrypted</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Multiple Payment
                  </p>
                  <p className="text-xs text-slate-400">
                    Cards & PayPal accepted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-400">
              © 2025 Tag Enterprises (London) Limited. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Company No. 12345678 | VAT No. GB123456789
            </p>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">
              Follow us:
            </span>
            {[
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: Twitter, label: "Twitter", href: "#" },
              { icon: Instagram, label: "Instagram", href: "#" },
              { icon: Linkedin, label: "LinkedIn", href: "#" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group"
                aria-label={label}
              >
                <Icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>

      {!location?.pathname.includes("chat") && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-1">
          <Button className={"rounded-full"} onClick={() => navigate("chat")}>
            <MessageCircleMore />
          </Button>
        </div>
      )}
    </footer>
  );
}
