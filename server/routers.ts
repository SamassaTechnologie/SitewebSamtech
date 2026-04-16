import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getInvoicesByUserId, getQuotesByUserId, getReceiptsByUserId, getInterventionsByUserId, getClientsByUserId, createInvoice, createQuote, createReceipt, createIntervention, createClient, getNextDocumentNumber } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  documents: router({
    getInvoices: protectedProcedure.query(({ ctx }) =>
      getInvoicesByUserId(ctx.user.id)
    ),
    getQuotes: protectedProcedure.query(({ ctx }) =>
      getQuotesByUserId(ctx.user.id)
    ),
    getReceipts: protectedProcedure.query(({ ctx }) =>
      getReceiptsByUserId(ctx.user.id)
    ),
    getInterventions: protectedProcedure.query(({ ctx }) =>
      getInterventionsByUserId(ctx.user.id)
    ),
    getClients: protectedProcedure.query(({ ctx }) =>
      getClientsByUserId(ctx.user.id)
    ),
    createInvoice: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        issueDate: z.string(),
        dueDate: z.string().optional(),
        description: z.string(),
        amount: z.string(),
        taxRate: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const documentNumber = await getNextDocumentNumber(ctx.user.id, 'invoice');
        if (!documentNumber) throw new Error('Failed to generate document number');
        return createInvoice({
          userId: ctx.user.id,
          clientId: input.clientId,
          documentNumber,
          issueDate: new Date(input.issueDate),
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          description: input.description,
          amount: input.amount,
          taxRate: input.taxRate || '0',
          status: input.status as any || 'draft',
          notes: input.notes,
        });
      }),
    createQuote: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        issueDate: z.string(),
        validUntil: z.string().optional(),
        description: z.string(),
        amount: z.string(),
        taxRate: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const documentNumber = await getNextDocumentNumber(ctx.user.id, 'quote');
        if (!documentNumber) throw new Error('Failed to generate document number');
        return createQuote({
          userId: ctx.user.id,
          clientId: input.clientId,
          documentNumber,
          issueDate: new Date(input.issueDate),
          validUntil: input.validUntil ? new Date(input.validUntil) : undefined,
          description: input.description,
          amount: input.amount,
          taxRate: input.taxRate || '0',
          status: input.status as any || 'draft',
          notes: input.notes,
        });
      }),
    createReceipt: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        issueDate: z.string(),
        description: z.string(),
        amount: z.string(),
        paymentMethod: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const documentNumber = await getNextDocumentNumber(ctx.user.id, 'receipt');
        if (!documentNumber) throw new Error('Failed to generate document number');
        return createReceipt({
          userId: ctx.user.id,
          clientId: input.clientId,
          documentNumber,
          issueDate: new Date(input.issueDate),
          description: input.description,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          status: input.status as any || 'draft',
          notes: input.notes,
        });
      }),
    createIntervention: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        issueDate: z.string(),
        interventionDate: z.string().optional(),
        description: z.string(),
        technician: z.string().optional(),
        duration: z.string().optional(),
        amount: z.string().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const documentNumber = await getNextDocumentNumber(ctx.user.id, 'intervention');
        if (!documentNumber) throw new Error('Failed to generate document number');
        return createIntervention({
          userId: ctx.user.id,
          clientId: input.clientId,
          documentNumber,
          issueDate: new Date(input.issueDate),
          interventionDate: input.interventionDate ? new Date(input.interventionDate) : undefined,
          description: input.description,
          technician: input.technician,
          duration: input.duration,
          amount: input.amount,
          status: input.status as any || 'draft',
          notes: input.notes,
        });
      }),
    createClient: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        taxId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createClient({
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
          city: input.city,
          country: input.country,
          taxId: input.taxId,
        });
      }),
  })
});

export type AppRouter = typeof appRouter;
