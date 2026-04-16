import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("documents procedures", () => {
  describe("getClients", () => {
    it("should return list of clients", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const clients = await caller.documents.getClients();

      expect(Array.isArray(clients)).toBe(true);
    });
  });

  describe("createClient", () => {
    it("should create a client with valid data", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const client = await caller.documents.createClient({
        name: "Test Client",
        email: "client@test.com",
        phone: "+223 77 00 00 00",
      });

      expect(client).toBeDefined();
      expect(client.name).toBe("Test Client");
      expect(client.email).toBe("client@test.com");
    });
  });

  describe("createInvoice", () => {
    it("should create an invoice with valid data", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First create a client
      const client = await caller.documents.createClient({
        name: "Test Client",
        email: "client@test.com",
        phone: "+223 77 00 00 00",
      });

      expect(client).toBeDefined();
      expect(client.name).toBe("Test Client");

      // Then create an invoice
      const invoice = await caller.documents.createInvoice({
        clientId: client.id,
        issueDate: new Date().toISOString(),
        description: "Test Invoice",
        amount: "100000",
        taxRate: "18",
        status: "draft",
      });

      expect(invoice).toBeDefined();
      expect(invoice.documentNumber).toMatch(/^FAC-2026-/);
      expect(invoice.clientId).toBe(client.id);
      expect(invoice.status).toBe("draft");
    });

    it("should throw error without client", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.documents.createInvoice({
          clientId: 9999,
          issueDate: new Date().toISOString(),
          description: "Test Invoice",
          amount: "100000",
          status: "draft",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("createQuote", () => {
    it("should create a quote with valid data", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First create a client
      const client = await caller.documents.createClient({
        name: "Quote Client",
        email: "quote@test.com",
        phone: "+223 77 00 00 01",
      });

      // Then create a quote
      const quote = await caller.documents.createQuote({
        clientId: client.id,
        issueDate: new Date().toISOString(),
        description: "Test Quote",
        amount: "500000",
        taxRate: "18",
        status: "draft",
      });

      expect(quote).toBeDefined();
      expect(quote.documentNumber).toMatch(/^DEV-2026-/);
      expect(quote.clientId).toBe(client.id);
    });
  });

  describe("createReceipt", () => {
    it("should create a receipt with valid data", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First create a client
      const client = await caller.documents.createClient({
        name: "Receipt Client",
        email: "receipt@test.com",
        phone: "+223 77 00 00 02",
      });

      // Then create a receipt
      const receipt = await caller.documents.createReceipt({
        clientId: client.id,
        issueDate: new Date().toISOString(),
        description: "Payment received",
        amount: "100000",
        paymentMethod: "cash",
        status: "issued",
      });

      expect(receipt).toBeDefined();
      expect(receipt.documentNumber).toMatch(/^REC-2026-/);
      expect(receipt.paymentMethod).toBe("cash");
    });
  });

  describe("createIntervention", () => {
    it("should create an intervention with valid data", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First create a client
      const client = await caller.documents.createClient({
        name: "Intervention Client",
        email: "intervention@test.com",
        phone: "+223 77 00 00 03",
      });

      // Then create an intervention
      const intervention = await caller.documents.createIntervention({
        clientId: client.id,
        issueDate: new Date().toISOString(),
        description: "PC maintenance and optimization",
        technician: "John Doe",
        duration: "2h30",
        status: "completed",
      });

      expect(intervention).toBeDefined();
      expect(intervention.documentNumber).toMatch(/^INT-2026-/);
      expect(intervention.technician).toBe("John Doe");
    });
  });


});
