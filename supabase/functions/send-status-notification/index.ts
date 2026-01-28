import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface StatusNotificationRequest {
  applicationId: string;
  newStatus: string;
  studentEmail: string;
  studentName: string;
  jobTitle: string;
  companyName: string;
}

const getStatusMessage = (status: string): { subject: string; heading: string; message: string; color: string } => {
  switch (status) {
    case "shortlisted":
      return {
        subject: "Congratulations! You've been shortlisted",
        heading: "You've Been Shortlisted! 🎉",
        message: "Great news! Your application has been reviewed and you have been shortlisted for the next round. Please stay tuned for further updates regarding the interview schedule.",
        color: "#f59e0b",
      };
    case "interviewed":
      return {
        subject: "Interview completed - Status update",
        heading: "Interview Status Updated",
        message: "Your interview has been recorded in our system. The recruitment team will review all interviews and get back to you soon with the final decision.",
        color: "#8b5cf6",
      };
    case "selected":
      return {
        subject: "🎊 Congratulations! You've been selected!",
        heading: "You're Selected! 🎊",
        message: "We are thrilled to inform you that you have been selected for the position! The placement team will contact you soon with the offer details and next steps.",
        color: "#10b981",
      };
    case "rejected":
      return {
        subject: "Application Status Update",
        heading: "Application Update",
        message: "Thank you for your interest and effort in the application process. After careful consideration, we regret to inform you that your application was not selected this time. We encourage you to keep applying to other opportunities.",
        color: "#ef4444",
      };
    default:
      return {
        subject: "Application Status Update",
        heading: "Status Update",
        message: `Your application status has been updated to: ${status}. Please check your dashboard for more details.`,
        color: "#3b82f6",
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { applicationId, newStatus, studentEmail, studentName, jobTitle, companyName }: StatusNotificationRequest = await req.json();

    // Validate required fields
    if (!applicationId || !newStatus || !studentEmail || !studentName || !jobTitle || !companyName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const statusInfo = getStatusMessage(newStatus);

    console.log(`Sending status notification to ${studentEmail} for status: ${newStatus}`);

    const { error: emailError } = await resend.emails.send({
      from: "Placement Portal <onboarding@resend.dev>",
      to: [studentEmail],
      subject: `${statusInfo.subject} - ${jobTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <div style="background: linear-gradient(135deg, ${statusInfo.color}, ${statusInfo.color}dd); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">${statusInfo.heading}</h1>
              </div>
              <div style="padding: 30px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                  Dear <strong>${studentName}</strong>,
                </p>
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                  ${statusInfo.message}
                </p>
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #111827; margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Application Details</h3>
                  <p style="color: #374151; margin: 5px 0;"><strong>Position:</strong> ${jobTitle}</p>
                  <p style="color: #374151; margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
                  <p style="color: #374151; margin: 5px 0;"><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold; text-transform: capitalize;">${newStatus}</span></p>
                </div>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                  Log in to your placement portal dashboard to view more details and track all your applications.
                </p>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  This is an automated notification from the Placement Management System.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Status notification sent successfully to ${studentEmail}`);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-status-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
