"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addDays, addWeeks, addMonths } from "date-fns";

const prisma = new PrismaClient();

const JobSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  startAt: z.string().min(1, "Start time is required"),
  duration: z.coerce.number().min(15, "Duration must be at least 15 mins"),
  serviceType: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  notes: z.string().optional(),
  frequency: z.string().optional(), // "ONCE", "WEEKLY", "BIWEEKLY", "MONTHLY"
});

export async function createJob(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const rawData = {
    clientId: formData.get("clientId"),
    startAt: formData.get("startAt"),
    duration: formData.get("duration"),
    serviceType: formData.get("serviceType"),
    price: formData.get("price"),
    notes: formData.get("notes"),
    frequency: formData.get("frequency"),
  };

  const validatedFields = JobSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Job.",
    };
  }

  const { clientId, startAt, duration, serviceType, price, notes, frequency } = validatedFields.data;

  // Fetch client to get address (default to first address)
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { addresses: true },
  });

  if (!client) {
      return { message: "Client not found." };
  }

  const addressId = client.addresses[0]?.id;

  const startDate = new Date(startAt);
  const endDate = new Date(startDate.getTime() + duration * 60000);

  try {
    // If recurring, create rule and generate occurrences
    if (frequency && frequency !== "ONCE") {
        let dbFrequency = "WEEKLY";
        let interval = 1;

        if (frequency === "BIWEEKLY") {
            dbFrequency = "WEEKLY";
            interval = 2;
        } else if (frequency === "MONTHLY") {
            dbFrequency = "MONTHLY";
        }

        const recurrence = await prisma.recurrenceRule.create({
            data: {
                userId: user.id,
                frequency: dbFrequency,
                interval,
            }
        });

        // Generate next 8 occurrences
        const occurrences = [];
        let currentDate = startDate;

        for (let i = 0; i < 8; i++) {
            occurrences.push({
                userId: user.id,
                clientId: client.id,
                addressId: addressId || null,
                serviceType: serviceType || null,
                price,
                startAt: currentDate,
                endAt: new Date(currentDate.getTime() + duration * 60000),
                duration,
                notes: notes || null,
                recurrenceId: recurrence.id,
                status: "SCHEDULED",
            });

            // Increment date
            if (dbFrequency === "WEEKLY") {
                currentDate = addWeeks(currentDate, interval);
            } else if (dbFrequency === "MONTHLY") {
                currentDate = addMonths(currentDate, interval);
            }
        }

        await prisma.job.createMany({
            data: occurrences,
        });

    } else {
        // Single job
        await prisma.job.create({
            data: {
                userId: user.id,
                clientId: client.id,
                addressId: addressId || null,
                serviceType: serviceType || null,
                price,
                startAt: startDate,
                endAt: endDate,
                duration,
                notes: notes || null,
                status: "SCHEDULED",
            },
        });
    }

  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Job.",
    };
  }

  revalidatePath("/jobs");
  revalidatePath("/calendar");
  redirect("/calendar");
}

export async function updateJobStatus(id: string, status: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.job.update({
        where: { id },
        data: { status }
    });

    revalidatePath("/jobs");
    revalidatePath("/calendar");
    revalidatePath(`/jobs/${id}`);
}

export async function markJobPaid(id: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    await prisma.job.update({
        where: { id },
        data: { paymentStatus: "PAID" }
    });

    // Also log payment record
    const job = await prisma.job.findUnique({ where: { id }});
    if (job) {
        await prisma.paymentRecord.create({
            data: {
                jobId: id,
                amount: job.price,
                method: "MANUAL",
                status: "PAID"
            }
        });
    }

    revalidatePath(`/jobs/${id}`);
}

export async function getJobs(date?: Date) {
    const session = await auth();
    if (!session?.user?.email) return [];

    const user = await prisma.user.findUnique({ where: { email: session.user.email }});
    if (!user) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId: user.id };

    if (date) {
        // Simple day filter
        const start = new Date(date);
        start.setHours(0,0,0,0);
        const end = new Date(date);
        end.setHours(23,59,59,999);

        where.startAt = {
            gte: start,
            lte: end
        };
    }

    return await prisma.job.findMany({
        where,
        include: { client: true, address: true },
        orderBy: { startAt: 'asc' }
    });
}

export async function getJob(id: string) {
    const session = await auth();
    if (!session?.user?.email) return null;

    const job = await prisma.job.findUnique({
        where: { id },
        include: { client: true, address: true, recurrence: true }
    });
    return job;
}
