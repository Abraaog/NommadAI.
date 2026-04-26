"use server";

import { getDb } from "@/lib/db/client";
import { contacts } from "@/lib/db/schema";
import { requireSession } from "@/lib/supabase/server";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getContacts() {
  const session = await requireSession();
  const db = getDb();
  
  return db.select()
    .from(contacts)
    .where(eq(contacts.userId, session.user.id))
    .orderBy(desc(contacts.updatedAt));
}

export async function createContact(data: {
  name: string;
  email?: string;
  phone?: string;
  category?: string;
  status?: "lead" | "negotiation" | "closed";
  notes?: string;
}) {
  const session = await requireSession();
  const db = getDb();

  const [newContact] = await db.insert(contacts).values({
    userId: session.user.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    category: data.category || 'artist',
    status: data.status || 'lead',
    notes: data.notes,
  }).returning();

  revalidatePath("/dashboard/chefoes");
  return newContact;
}

export async function updateContactStatus(contactId: string, status: "lead" | "negotiation" | "closed") {
  const session = await requireSession();
  const db = getDb();

  await db.update(contacts)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, session.user.id)));

  revalidatePath("/dashboard/chefoes");
}

export async function deleteContact(contactId: string) {
  const session = await requireSession();
  const db = getDb();

  await db.delete(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, session.user.id)));

  revalidatePath("/dashboard/chefoes");
}
