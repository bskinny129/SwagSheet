import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, useEffect, useState } from "react";
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { Pricing } from '@/pages/Pricing';
import { About } from '@/pages/About';
import { Privacy } from '@/pages/Privacy';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { MyAccount } from '@/pages/MyAccount';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { features } from '@/config/features';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {

  const location = useLocation();
  const [session, setSession] = useState<Session | null>({} as Session);

  useEffect(() => {
    // Auth code kept for later use
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
     });
     const {
       data: { subscription },
     } = supabase.auth.onAuthStateChange((_event, session) => {
       setSession(session);
     });
     return () => subscription.unsubscribe();
  }, []);


  useLayoutEffect(() => {
      document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
  }, [location.pathname]);



  return (
      <div className="min-h-screen bg-white">

        <Navigation session={session} />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />

            {features.map((feature) => (
              <Route
                key={feature.href}
                path={feature.href}
                element={<ToolLayout feature={feature} />}
              />
            ))}
          </Routes>
        </main>

        <Footer />
        <Toaster />
      </div>
  );
}

export default App;