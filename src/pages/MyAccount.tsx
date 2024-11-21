import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export function MyAccount() {
    const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <Button
        variant="default"
        className="bg-primary-bright text-primary-dark hover:bg-primary-bright/70"
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );
};
