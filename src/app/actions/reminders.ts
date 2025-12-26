"use server";

import { twilioClient } from "@/lib/twilio";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function sendReminder(jobId: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Unauthorized" };

    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { client: true }
    });

    if (!job || !job.client.phone) return { error: "Job or Client Phone not found" };

    const messageBody = `Hi ${job.client.name}, reminder for your cleaning service tomorrow at ${job.startAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Reply C to confirm.`;

    try {
        if (process.env.TWILIO_ACCOUNT_SID) {
             await twilioClient.messages.create({
                body: messageBody,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: job.client.phone,
            });
        }

        await prisma.messageLog.create({
            data: {
                userId: job.userId,
                clientId: job.clientId,
                channel: "SMS",
                template: "REMINDER",
                status: "SENT"
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Twilio Error:", error);
        return { error: "Failed to send SMS" };
    }
}
