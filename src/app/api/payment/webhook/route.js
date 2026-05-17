import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  // ✅ CRITICAL — read raw body as text, not JSON!
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  console.log("🔥 Webhook hit!");
  console.log("Signature:", signature ? "present" : "MISSING");

  if (!signature) {
    console.log("❌ No signature found!");
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,                                    // ✅ raw text
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log("✅ Webhook verified:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      console.log("💳 Payment completed:", { userId, plan });

      if (userId && plan) {
        const { error } = await supabase
          .from("users")
          .update({ plan: plan })
          .eq("id", userId);

        if (error) {
          console.log("❌ Supabase update error:", error.message);
        } else {
          console.log(`✅ Plan updated: user ${userId} → ${plan}`);
        }

        // Save to purchases table
        await supabase.from("purchases").insert({
          user_id: userId,
          plan: plan,
          stripe_session_id: session.id,
          amount: session.amount_total / 100,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await supabase
        .from("users")
        .update({ plan: "free" })
        .eq("stripe_customer_id", subscription.customer);
      console.log("✅ Subscription ended → free");
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      if (subscription.cancel_at_period_end) {
        await supabase
          .from("users")
          .update({ plan: "cancelling" })
          .eq("stripe_customer_id", subscription.customer);
      }
      break;
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}