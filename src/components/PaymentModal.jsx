import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaystackButton } from 'react-paystack';
import { X, Lock, Check } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function PaymentModal({ show, onClose, onSuccess, amount = 50, email }) {
    const [promoCode, setPromoCode] = useState("");
    const [error, setError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    const componentProps = {
        email: email || 'guest@example.com',
        amount: amount * 100, // Paystack is in kobo (cents)
        currency: 'GHS',
        metadata: {
            custom_fields: [
                {
                    display_name: "Purpose",
                    variable_name: "purpose",
                    value: "Portal Publication"
                }
            ]
        },
        publicKey,
        text: `Pay GHS ${amount}`,
        onSuccess: (reference) => {
            onSuccess({ type: 'payment', reference });
        },
        onClose: () => console.log("Payment closed"),
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setIsValidating(true);
        setError(null);

        // Call backend to validate
        try {
            // Note: Update URL if needed based on API_BASE
            const res = await fetch(`${API_BASE}/api/validate-promo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode })
            });
            const data = await res.json();

            if (data.valid) {
                onSuccess({ type: 'promo', code: promoCode });
            } else {
                setError("Invalid promo code");
            }
        } catch (e) {
            console.error(e);
            setError("Could not validate code");
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative z-10 shadow-2xl"
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition"
                            >
                                <X size={20} />
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-1">Unlock Your Link</h2>
                            <p className="text-white/80 text-sm">One-time payment to publish forever</p>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Option 1: Paystack */}
                            <div className="text-center space-y-4">
                                <div className="text-4xl font-black text-gray-900">
                                    <span className="text-xl align-top text-gray-400 font-medium">GHS</span>
                                    {amount}
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Supports MTN MoMo, Telecel, AT Money & Cards
                                </p>

                                <div className="w-full">
                                    {publicKey ? (
                                        <PaystackButton
                                            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            {...componentProps}
                                        />
                                    ) : (
                                        <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs font-mono border border-red-100">
                                            PAYSTACK_PUBLIC_KEY missing in .env
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or use a code</span>
                                </div>
                            </div>

                            {/* Option 2: Promo Code */}
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Promo Code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase font-mono text-sm text-gray-900"
                                    />
                                    <button
                                        onClick={handleApplyPromo}
                                        disabled={!promoCode || isValidating}
                                        className="px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        {isValidating ? '...' : 'Apply'}
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-red-500 text-xs flex items-center gap-1">
                                        <X size={12} /> {error}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                Secured by Paystack
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
