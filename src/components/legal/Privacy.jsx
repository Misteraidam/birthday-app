import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock } from 'lucide-react';

export default function Privacy({ onBack }) {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span className="font-bold text-lg">Privacy Policy</span>
                    <div className="w-8" />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
                <section>
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                        <Shield size={24} />
                    </div>
                    <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
                    <p className="text-gray-500">Last Updated: January 2026</p>
                </section>

                <section className="prose prose-lg prose-gray">
                    <h3>1. Information We Collect</h3>
                    <div className="text-gray-600 mb-4">
                        We collect information you provide directly to us when you create a celebration portal. This includes:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>The content of your stories (text, images, audio).</li>
                            <li>Payment information (transactions are processed by Paystack; we do not store full credit card details).</li>
                            <li>Technical usage data (logs, device type) to improve the service.</li>
                        </ul>
                    </div>

                    <h3>2. How We Use Your Information</h3>
                    <div className="text-gray-600 mb-4">
                        We use the information we collect to:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Process your transactions.</li>
                            <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
                            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
                        </ul>
                    </div>

                    <h3>3. Sharing of Information</h3>
                    <p>
                        We do not sell your personal data. We may share your information with third-party vendors, service providers,
                        contractors, or agents who perform services for us (such as payment processing via Paystack or cloud hosting).
                    </p>
                    <p>
                        <strong>Publicly Shared Links:</strong> The core feature of our service is to create shareable links.
                        Content you post is intended for public consumption by anyone who has the link. Please do not post sensitive
                        personal information (like addresses or financial data) in your stories.
                    </p>

                    <h3>4. Data Security</h3>
                    <p>
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access,
                        disclosure, alteration and destruction. However, no internet transmission is completely secure.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at elijahaidam.ea@gmail.com.
                    </p>
                </section>
            </main>
        </div>
    );
}
