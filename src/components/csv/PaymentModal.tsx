import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowCount: number;
  onSuccess: () => void;
  isLoading: boolean;
}

export function PaymentModal({ isOpen, onClose, rowCount, onSuccess, isLoading }: PaymentModalProps) {
  console.log(onSuccess);
  const cost = (rowCount * 0.01).toFixed(2);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rowCount,
          amount: parseFloat(cost),
        }),
      });

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#435585] border-[#818FB4]/20">
        <DialogHeader>
          <DialogTitle className="text-[#F5E8C7]">Enhance CSV with AI</DialogTitle>
          <DialogDescription className="text-[#818FB4]">
            Process your CSV data with advanced AI analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-[#363062]/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#F5E8C7]">Rows to process:</span>
              <span className="text-[#F5E8C7] font-semibold">{rowCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#F5E8C7]">Total cost:</span>
              <span className="text-[#F5E8C7] font-semibold">${cost}</span>
            </div>
          </div>

          <div className="text-sm text-[#818FB4]">
            <p>Price: $0.01 per row</p>
            <p>Includes data cleaning, standardization, and enrichment</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#818FB4] text-[#F5E8C7] hover:bg-[#363062]/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="bg-[#818FB4] text-[#363062] hover:bg-[#818FB4]/80"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${cost}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}