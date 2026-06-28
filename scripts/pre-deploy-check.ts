import mongoose from 'mongoose';
import OpenAI from 'openai';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runChecks() {
  console.log('Running pre-deployment checks...\n');
  let hasError = false;

  const requiredEnvs = [
    'MONGODB_URI', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET',
    'STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET', 'STRIPE_MONTHLY_PRICE_ID', 'STRIPE_ANNUAL_PRICE_ID'
  ];

  console.log('1. Checking Environment Variables...');
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
    console.error(`❌ Missing AI provider key: Please provide GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY`);
    hasError = true;
  }
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      console.error(`❌ Missing environment variable: ${env}`);
      hasError = true;
    }
  }
  if (!hasError) console.log('✅ All required environment variables are set.\n');

  console.log('2. Checking MongoDB Connection...');
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connection successful.');
      await mongoose.disconnect();
    }
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    hasError = true;
  }
  console.log();

  console.log('3. Checking AI API Key...');
  try {
    const aiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (aiKey) {
      const baseURL = process.env.GEMINI_API_KEY 
        ? "https://generativelanguage.googleapis.com/v1beta/openai/" 
        : process.env.GROQ_API_KEY 
          ? "https://api.groq.com/openai/v1" 
          : undefined;
          
      const openai = new OpenAI({ apiKey: aiKey, baseURL });
      const models = await openai.models.list();
      if (models.data.length > 0) {
        console.log('✅ AI API key is valid.');
      } else {
        throw new Error('No models found, check your API key permissions.');
      }
    }
  } catch (error: any) {
    console.error('❌ AI API key check failed:', error.message);
    hasError = true;
  }
  console.log();

  console.log('4. Checking Stripe Keys...');
  try {
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20' as any
      });
      // Try to fetch the balance just to check if the key works
      await stripe.balance.retrieve();
      console.log('✅ Stripe secret key is valid.');
    }
  } catch (error: any) {
    console.error('❌ Stripe key check failed:', error.message);
    hasError = true;
  }
  console.log();

  if (hasError) {
    console.error('🚨 Pre-deployment checks FAILED. Please fix the errors above before deploying.');
    process.exit(1);
  } else {
    console.log('🎉 All pre-deployment checks PASSED. Ready for deployment!');
    process.exit(0);
  }
}

runChecks();
