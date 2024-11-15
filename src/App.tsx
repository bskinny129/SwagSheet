import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthForm } from '@/components/auth/AuthForm';
import { CSVProcessor } from '@/components/csv/CSVProcessor';
import { supabase } from '@/lib/supabase';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [session, setSession] = useState<Session | null>({} as Session);

  useEffect(() => {
    // Auth code kept for later use
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setSession(session);
    // });
    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setSession(session);
    // });
    // return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#363062] text-[#F5E8C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#435585]/50 backdrop-blur-sm rounded-xl shadow-xl border border-[#818FB4]/20">
          <CSVProcessor />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;