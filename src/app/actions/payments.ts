"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPaymentLink(jobId: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { client: true }
    });

    if (!job) throw new Error("Job not found");

    try {
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Cleaning Service - ${job.serviceType || 'Standard'}`,
                            description: `Service for ${job.client.name} on ${job.startAt.toLocaleDateString()}`,
                        },
                        unit_amount: job.price * 100, // cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                jobId: job.id,
                userId: session.user.email,
            },
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.id}?payment=success`,
                },
            },
        });

        return { url: paymentLink.url };
    } catch (error) {
        console.error("Stripe Error:", error);
        return { error: "Failed to create payment link" };
    }
}
