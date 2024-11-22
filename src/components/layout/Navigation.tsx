import { useState, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils"
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
 } from '@/components/ui/navigation-menu';
 import { Session } from '@supabase/supabase-js';
 import { AuthForm } from '@/components/auth/AuthForm';
 import {
  Dialog,
  DialogContent,
  //DialogDescription,
  DialogHeader,
  //DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const freeTools: { title: string; href: string; description: string }[] = [
  {
    title: "CSV Reducer",
    href: "/csv-reducer",
    description:
      "Remove and rearrange columns, plus limit the number of rows.",
  }
];

const aiTools: { title: string; href: string; description: string }[] = [
  {
    title: "AI Contact Names",
    href: "/contact-names",
    description:
      "Standardize contact names using AI PLACEHOLDER",
  },
  {
    title: "AI Smart Merge",
    href: "/smart-merge",
    description:
      "Intelligently merge CSV files with automatic duplicate detection PLACEHOLDER",
  }
];

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-sm p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/30 focus:bg-accent/30",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

export function Navigation({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path || (path === '/csv-reducer' && location.pathname === '/');
  };

  return (
    <nav className="top-0 z-50 bg-white backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/assets/SwagSheet200.jpg" alt="SwagSheet Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden z-50 md:flex md:items-center md:space-x-8 text-md font-light">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Free CSV Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {freeTools.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>AI Powered Sheets</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {aiTools.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    to="/pricing"
                    className="px-6 py-2 text-md font-light transition-colors relative rounded-sm hover:bg-accent/30"
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {session ? (
              <Button
                variant="default"
                className="bg-primary-bright text-primary-dark hover:bg-primary-bright/90 py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                asChild
              >
                <Link to="/my-account">My Account</Link>
              </Button>
            ) : (
              <Dialog>

                <DialogTrigger>
                    <Button className="block bg-primary-bright text-primary-dark hover:bg-primary-bright/90 py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">Sign In</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <AuthForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black/80 hover:text-primary-bright focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden z-50"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
            {/* Free Tools Section */}
            <div className="px-3 py-2 text-sm font-semibold text-gray-400">
              Free CSV Tools
            </div>
            {freeTools.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-6 py-2 rounded-md text-base ${
                  isActivePath(item.href)
                    ? 'text-black/80 font-medium bg-primary-bright/10'
                    : 'text-black/80 hover:bg-primary-bright/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}

            {/* AI Tools Section */}
            <div className="px-3 py-2 text-sm font-semibold text-gray-400 mt-4">
              AI Powered Sheets
            </div>
            {aiTools.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-6 py-2 rounded-md text-base ${
                  isActivePath(item.href)
                    ? 'text-black/80 font-medium bg-primary-bright/10'
                    : 'text-black/80 hover:bg-primary-bright/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}

            <Link
              to="/pricing"
              className={`block px-3 py-2 rounded-md text-base ${
                location.pathname === '/pricing'
                  ? 'text-black/80 font-medium bg-primary-bright/10'
                  : 'text-black/80 hover:bg-primary-bright/10'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>

            {session ? (
              <Link
                to="/my-account"
                className="block px-3 py-2 rounded-md text-base text-black/80 hover:bg-primary-bright/10"
                onClick={() => setIsOpen(false)}
              >
                My Account
              </Link>
            ) : (
              <Dialog>
                <DialogTrigger 
                  className="block text-left w-full px-3 py-2 rounded-md text-base text-black/80 hover:bg-primary-bright/10">
                    Sign In
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <AuthForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
