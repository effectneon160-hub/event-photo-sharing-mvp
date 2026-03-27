import React, { useEffect, useState } from 'react';
import { Layout } from '../ui/Layout';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import {
  LockIcon,
  CreditCardIcon,
  Loader2Icon,
  ShieldCheckIcon,
  CheckCircleIcon } from
'lucide-react';
import { useApp } from '../../AppContext';
import { PageType } from '../../types';
import { useToast } from '../ui/Toast';
interface PaymentProps {
  navigate: (page: PageType) => void;
  pendingEvent: any;
  setEventId: (id: string) => void;
}
export function Payment({ navigate, pendingEvent, setEventId }: PaymentProps) {
  const { addEvent } = useApp();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Redirect if no pending event
  useEffect(() => {
    if (!pendingEvent) {
      navigate('create');
    }
  }, [pendingEvent, navigate]);
  if (!pendingEvent) return null;
  const getPriceNum = () => {
    switch (pendingEvent.packageType) {
      case 'basic':
        return 0;
      case 'standard':
        return 29;
      case 'premium':
        return 79;
      default:
        return 0;
    }
  };
  const price = getPriceNum();
  const isFree = price === 0;
  // Formatting helpers
  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return val;
    }
  };
  const formatExpiry = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };
  const getCardBrand = (num: string) => {
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'Mastercard';
    if (num.startsWith('3')) return 'Amex';
    return 'Card';
  };
  const validateForm = () => {
    if (isFree) return true;
    const newErrors: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, '').length < 15)
    newErrors.cardNumber = 'Invalid card number';
    if (expiry.length < 5) newErrors.expiry = 'Invalid expiry';
    if (cvc.length < 3) newErrors.cvc = 'Invalid CVC';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim() || !email.includes('@'))
    newErrors.email = 'Valid email required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePayment = () => {
    if (!validateForm()) {
      addToast('Please check your payment details', 'error');
      return;
    }
    setIsProcessing(true);
    setProcessStep('Validating card...');
    // Simulate multi-step processing
    setTimeout(() => {
      setProcessStep('Processing payment...');
      setTimeout(() => {
        setProcessStep('Confirming event...');
        setTimeout(() => {
          const newEventId = addEvent(pendingEvent);
          setEventId(newEventId);
          setIsProcessing(false);
          addToast('Payment successful!', 'success');
          navigate('confirmation');
        }, 800);
      }, 1000);
    }, 800);
  };
  return (
    <Layout navigate={navigate} title="Checkout" currentPage="payment">
      <div className="p-4 space-y-6 pb-24">
        <Card className="bg-indigo-50/50 border-indigo-100">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-gray-900 block">
                  {pendingEvent.title}
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {pendingEvent.packageType} Package
                </span>
              </div>
              <span className="font-medium text-gray-900">
                ${price.toFixed(2)}
              </span>
            </div>

            {!isFree &&
            <>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes & Fees</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-3 border-t border-indigo-200/50 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Due</span>
                  <span className="font-bold text-2xl text-indigo-600">
                    ${price.toFixed(2)}
                  </span>
                </div>
              </>
            }
            {isFree &&
            <div className="pt-3 border-t border-indigo-200/50 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Due</span>
                <span className="font-bold text-2xl text-green-600">Free</span>
              </div>
            }
          </div>
        </Card>

        {!isFree ?
        <Card className="shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-900">
                <CreditCardIcon className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold">Payment Details</h2>
              </div>
              <div className="flex gap-1">
                {/* Mock card icons */}
                <div className="w-8 h-5 bg-blue-100 rounded flex items-center justify-center text-[8px] font-bold text-blue-800">
                  VISA
                </div>
                <div className="w-8 h-5 bg-orange-100 rounded flex items-center justify-center text-[8px] font-bold text-orange-800">
                  MC
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
              label="Email Address (for receipt)"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                setErrors({
                  ...errors,
                  email: ''
                });
              }}
              error={errors.email} />
            

              <div className="relative">
                <Input
                label="Card Number"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(formatCardNumber(e.target.value));
                  if (errors.cardNumber)
                  setErrors({
                    ...errors,
                    cardNumber: ''
                  });
                }}
                error={errors.cardNumber}
                className="font-mono" />
              
                {cardNumber.length > 0 && !errors.cardNumber &&
              <div className="absolute right-3 top-9 text-xs font-bold text-gray-400">
                    {getCardBrand(cardNumber)}
                  </div>
              }
              </div>

              <div className="flex gap-4">
                <Input
                label="Expiry"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => {
                  setExpiry(formatExpiry(e.target.value));
                  if (errors.expiry)
                  setErrors({
                    ...errors,
                    expiry: ''
                  });
                }}
                error={errors.expiry}
                className="font-mono" />
              
                <Input
                label="CVC"
                placeholder="123"
                maxLength={4}
                type="password"
                value={cvc}
                onChange={(e) => {
                  setCvc(e.target.value.replace(/\D/g, ''));
                  if (errors.cvc)
                  setErrors({
                    ...errors,
                    cvc: ''
                  });
                }}
                error={errors.cvc}
                className="font-mono" />
              
              </div>

              <Input
              label="Name on Card"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                setErrors({
                  ...errors,
                  name: ''
                });
              }}
              error={errors.name} />
            
            </div>
          </Card> :

        <div className="text-center p-8 bg-green-50 text-green-800 rounded-2xl border border-green-200 flex flex-col items-center">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Ready to go!</h3>
            <p className="text-sm">
              No payment required for the Basic package. You can upgrade later
              if needed.
            </p>
          </div>
        }

        <div className="pt-4">
          <Button
            size="lg"
            fullWidth
            onClick={handlePayment}
            disabled={isProcessing}
            className="shadow-xl text-lg">
            
            {isProcessing ?
            <div className="flex items-center">
                <Loader2Icon className="w-5 h-5 mr-3 animate-spin" />
                {processStep}
              </div> :

            <div className="flex items-center">
                <LockIcon className="w-5 h-5 mr-2" />
                {isFree ? 'Create Event Now' : `Pay $${price.toFixed(2)}`}
              </div>
            }
          </Button>

          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-gray-400">
            <div className="flex items-center gap-1 text-xs font-medium">
              <ShieldCheckIcon className="w-4 h-4" />
              Guaranteed safe & secure checkout
            </div>
            {!isFree &&
            <div className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                Powered by Stripe
              </div>
            }
          </div>
        </div>
      </div>
    </Layout>);

}