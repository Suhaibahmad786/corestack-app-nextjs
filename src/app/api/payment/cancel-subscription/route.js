import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Service role client for DB operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    // ✅ Use createServerSupabaseClient — same as checkout session
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    console.log("👤 User:", user?.id, "Error:", error?.message);

    if (error || !user) {
      return Response.json(
        { message: "Not logged in" },
        { status: 401 }
      );
    }

    // Get stripe customer ID from DB
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id, plan")
      .eq("id", user.id)
      .single();

    console.log("🗄️ DB User:", dbUser, "Error:", dbError?.message);

    if (!dbUser?.stripe_customer_id) {
      return Response.json(
        { message: "No active subscription found" },
        { status: 400 }
      );
    }

    // Get active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: dbUser.stripe_customer_id,
      status: "active",
    });

    console.log("💳 Subscriptions found:", subscriptions.data.length);

    if (subscriptions.data.length === 0) {
      return Response.json(
        { message: "No active subscription found" },
        { status: 400 }
      );
    }

    // Cancel at period end
    await stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true,
    });

    // Update DB
    await supabaseAdmin
      .from("users")
      .update({ plan: "cancelling" })  // ✅ use "plan" not "subscription_status"
      .eq("id", user.id);

    console.log("✅ Subscription cancelled for user:", user.id);

    return Response.json({
      message: "Subscription cancelled successfully"
    });

  } catch (error) {
    console.log("❌ Cancel error:", error.message);
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}