import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, invoices, quotes, receipts, interventions, documentSequences } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Document management queries
export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).where(eq(clients.userId, userId));
}

export async function getInvoicesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      id: invoices.id,
      documentNumber: invoices.documentNumber,
      issueDate: invoices.issueDate,
      dueDate: invoices.dueDate,
      description: invoices.description,
      amount: invoices.amount,
      taxRate: invoices.taxRate,
      status: invoices.status,
      notes: invoices.notes,
      createdAt: invoices.createdAt,
      updatedAt: invoices.updatedAt,
      clientId: invoices.clientId,
      clientName: clients.name,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .where(eq(invoices.userId, userId));
  return result;
}

export async function getQuotesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      id: quotes.id,
      documentNumber: quotes.documentNumber,
      issueDate: quotes.issueDate,
      validUntil: quotes.validUntil,
      description: quotes.description,
      amount: quotes.amount,
      taxRate: quotes.taxRate,
      status: quotes.status,
      notes: quotes.notes,
      createdAt: quotes.createdAt,
      updatedAt: quotes.updatedAt,
      clientId: quotes.clientId,
      clientName: clients.name,
    })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .where(eq(quotes.userId, userId));
  return result;
}

export async function getReceiptsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      id: receipts.id,
      documentNumber: receipts.documentNumber,
      issueDate: receipts.issueDate,
      description: receipts.description,
      amount: receipts.amount,
      paymentMethod: receipts.paymentMethod,
      status: receipts.status,
      notes: receipts.notes,
      createdAt: receipts.createdAt,
      updatedAt: receipts.updatedAt,
      clientId: receipts.clientId,
      clientName: clients.name,
    })
    .from(receipts)
    .leftJoin(clients, eq(receipts.clientId, clients.id))
    .where(eq(receipts.userId, userId));
  return result;
}

export async function getInterventionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      id: interventions.id,
      documentNumber: interventions.documentNumber,
      issueDate: interventions.issueDate,
      interventionDate: interventions.interventionDate,
      description: interventions.description,
      technician: interventions.technician,
      duration: interventions.duration,
      amount: interventions.amount,
      status: interventions.status,
      notes: interventions.notes,
      createdAt: interventions.createdAt,
      updatedAt: interventions.updatedAt,
      clientId: interventions.clientId,
      clientName: clients.name,
    })
    .from(interventions)
    .leftJoin(clients, eq(interventions.clientId, clients.id))
    .where(eq(interventions.userId, userId));
  return result;
}

export async function createClient(client: Omit<typeof clients.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(clients).values(client);
}

export async function createInvoice(invoice: Omit<typeof invoices.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(invoices).values(invoice);
}

export async function createQuote(quote: Omit<typeof quotes.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(quotes).values(quote);
}

export async function createReceipt(receipt: Omit<typeof receipts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(receipts).values(receipt);
}

export async function createIntervention(intervention: Omit<typeof interventions.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(interventions).values(intervention);
}

export async function getNextDocumentNumber(userId: number, documentType: 'invoice' | 'quote' | 'receipt' | 'intervention') {
  const db = await getDb();
  if (!db) return null;
  
  const currentYear = new Date().getFullYear();
  const typePrefix = {
    invoice: 'FAC',
    quote: 'DEV',
    receipt: 'REC',
    intervention: 'INT'
  }[documentType];
  
  // Get or create sequence for this year
  const existing = await db
    .select()
    .from(documentSequences)
    .where(
      and(
        eq(documentSequences.userId, userId),
        eq(documentSequences.documentType, documentType),
        eq(documentSequences.year, currentYear)
      )
    )
    .limit(1);
  
  let sequence = 1;
  if (existing.length > 0) {
    sequence = (existing[0].sequence || 0) + 1;
    await db
      .update(documentSequences)
      .set({ sequence })
      .where(eq(documentSequences.id, existing[0].id));
  } else {
    await db.insert(documentSequences).values({
      userId,
      documentType,
      year: currentYear,
      sequence: 1
    });
  }
  
  return `${typePrefix}-${currentYear}-${String(sequence).padStart(3, '0')}`;
}
