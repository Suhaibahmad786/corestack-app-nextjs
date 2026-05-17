import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    name: "Pro Plan",
  },
  business: {
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    name: "Business Plan",
  },
};

export async function POST(req) {
  try {
    console.log("🔵 Checkout session started");

    // Step 1 — Get user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log("👤 User:", user?.id, "Error:", authError?.message);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Step 2 — Get plan
    const body = await req.json();
    console.log("📦 Request body:", body);

    const { plan } = body;
    console.log("📋 Plan received:", plan);
    console.log("📋 Available plans:", Object.keys(PLANS));

    if (!PLANS[plan]) {
      console.log("❌ Invalid plan:", plan);
      return NextResponse.json(
        { error: `Invalid plan: ${plan}. Valid plans: ${Object.keys(PLANS).join(", ")}` },
        { status: 400 }
      );
    }

    console.log("✅ Plan valid:", plan);
    console.log("💰 Price ID:", PLANS[plan].priceId);

    // Step 3 — Get or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    console.log("👤 Profile:", profile, "Error:", profileError?.message);

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      console.log("🆕 Creating new Stripe customer...");
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      console.log("✅ Customer created:", customerId);

      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Step 4 — Create checkout session
    console.log("💳 Creating checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      mode: "subscription",
     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      metadata: { user_id: user.id, plan },
    });

    console.log("✅ Session created:", session.url);
    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.log("❌ STRIPE ERROR:", err.message);
    console.log("❌ FULL ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}