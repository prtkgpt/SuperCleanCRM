"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

export async function createClient(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
  };

  const validatedFields = ClientSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Client.",
    };
  }

  const { name, email, phone, notes, street, city, state, zip } = validatedFields.data;

  try {
    await prisma.client.create({
      data: {
        userId: user.id,
        name,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
        addresses: {
          create: {
            street,
            city: city || null,
            state: state || null,
            zip: zip || null,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Client.",
    };
  }

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes"),
    street: formData.get("street"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
  };

  const { name, email, phone, notes } = rawData;

  await prisma.client.update({
    where: { id },
    data: {
      name: name as string,
      email: (email as string) || null,
      phone: (phone as string) || null,
      notes: (notes as string) || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function getClients() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return [];

  return await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
    include: { addresses: true }
  });
}

export async function getClient(id: string) {
    const session = await auth();
    if (!session?.user?.email) return null;

    const client = await prisma.client.findUnique({
      where: { id },
      include: { addresses: true, jobs: true },
    });
    return client;
}
