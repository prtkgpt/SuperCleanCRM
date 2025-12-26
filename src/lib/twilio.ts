import twilio from "twilio";

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || "AC_mock",
  process.env.TWILIO_AUTH_TOKEN || "mock_token"
);
