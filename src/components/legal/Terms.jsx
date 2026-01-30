import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, ArrowLeft, Lock } from 'lucide-react';

export default function Terms({ onBack }) {
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
                    <span className="font-bold text-lg">Terms of Service</span>
                    <div className="w-8" /> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
                <section>
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <FileText size={24} />
                    </div>
                    <h1 className="text-4xl font-black mb-4">Terms of Use</h1>
                    <p className="text-gray-500">Last Updated: January 2026</p>
                </section>

                <section className="prose prose-lg prose-gray">
                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to our Platform. By accessing or using our website and services, you agree to be bound by these Terms.
                        If you disagree with any part of the terms, you may not use the Service.
                    </p>

                    <h3>2. User Generated Content</h3>
                    <p>
                        Our Service allows you to create, post, link to, store, share and otherwise make available certain information,
                        text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post
                        to the Service, including its legality, reliability, and appropriateness.
                    </p>
                    <p>
                        By posting Content to the Service, you grant us the right and license to use, modify, perform, display,
                        reproduce, and distribute such Content on and through the Service. You retain any and all of your rights
                        to any Content you submit, post or display on or through the Service and you are responsible for protecting
                        those rights.
                    </p>

                    <h3>3. Prohibited Uses</h3>
                    <p>
                        You agree not to use the Service:
                        <ul>
                            <li>In any way that violates any applicable national or international law or regulation.</li>
                            <li>To transmit, or procure the sending of, any advertising or promotional material.</li>
                            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
                        </ul>
                    </p>

                    <h3>4. Modifications to Service</h3>
                    <p>
                        We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service,
                        in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service
                        is unavailable at any time or for any period.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        In no event shall the Company, its directors, employees, partners, agents, suppliers, or affiliates, be liable
                        for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of
                        profits, data, use, goodwill, or other intangible losses.
                    </p>
                </section>
            </main>
        </div>
    );
}
