/**
 * School OS - Mobile Money Webhook Prototype
 * Handles transaction confirmations from providers like M-Pesa, Orange, etc.
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Note: In production, use service account JSON from environment variables
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Firebase env vars missing");
}

const db = getFirestore();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { transaction_id, status, amount, school_id, student_id } = req.body;

        console.log(`[Webhook] Payment notification received: ${transaction_id} for ${school_id}`);

        if (status === 'SUCCESS') {
            // Determine collection based on school_id (e.g., "kamo")
            const collectionName = `${school_id}_payments`;
            
            const paymentDoc = {
                transaction_id,
                amount: parseFloat(amount),
                student_id,
                timestamp: new Date(),
                method: "Mobile Money",
                confirmed: true,
                source: "Webhook Auto-Confirm"
            };

            await db.collection(collectionName).add(paymentDoc);

            // NOTIFY NEXUS (WhatsApp Alerter)
            const nexusWebhook = "https://script.google.com/macros/s/AKfycbyuISpIUfYCRElys3ZxvENsFQDsh1O7yP239QSyGm1k9LUSxZQakv8kq-VzAwPO0Ho/exec";
            try {
                await fetch(nexusWebhook, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        title: `💰 PAIEMENT REÇU : ${school_id.toUpperCase()}`,
                        message: `Un paiement de *${amount} CDF* a été validé pour l'élève *${student_id}*.\nID Trans: ${transaction_id}`,
                        source: "SaaS Webhook"
                    })
                });
            } catch (e) { console.error("Nexus Notify Error:", e); }

            return res.status(200).json({ status: 'confirmed', message: 'Payment recorded and Architect notified' });
        } else {
            return res.status(200).json({ status: 'ignored', message: 'Transaction not successful' });
        }

    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
