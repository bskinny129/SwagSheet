import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from "react";
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { CSVReducer } from '@/pages/CSVReducer';
import { ContactNames } from '@/pages/ContactNames';
import { SmartMerge } from '@/pages/SmartMerge';
import { Pricing } from '@/pages/Pricing';
import { Privacy } from '@/pages/Privacy';
import { supabase } from '@/lib/supabase';


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {

  const location = useLocation();

    /*
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
  */

  useLayoutEffect(() => {
      document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
  }, [location.pathname]);

  return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/csv-reducer" element={<CSVReducer />} />
            <Route path="/contact-names" element={<ContactNames />} />
            <Route path="/smart-merge" element={<SmartMerge />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
  );
}

export default App;