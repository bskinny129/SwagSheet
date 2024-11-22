import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export function AuthForm() {
  return (

    <div className="w-full max-w-md mx-auto space-y-8 py-6">
      <div>
        <p className="text-sm text-center text-muted-foreground">
          Sign in or create an account
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
                  brand: '#0AEF8D',
                  brandAccent: '#0AEF8D',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'text-sm rounded-md transition-all bg-primary-bright text-primary-dark hover:bg-primary-bright/90 duration-300 transform hover:scale-105 shadow-md hover:shadow-lg',
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