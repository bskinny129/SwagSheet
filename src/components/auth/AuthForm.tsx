import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export function AuthForm() {
  return (

    <div className="w-full max-w-md mx-auto space-y-8 py-6">
      <div>
        <p className="text-sm text-center text-muted-foreground">
          Sign in or create an account to process your CSV files
        </p>
      </div>

      <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border border-muted">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9333ea',
                  brandAccent: '#db2777',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
              input: 'bg-background/50 backdrop-blur-sm border-muted',
            },
          }}
          providers={[]}
          view="sign_in"
        />
      </div>
    </div>
  );
}