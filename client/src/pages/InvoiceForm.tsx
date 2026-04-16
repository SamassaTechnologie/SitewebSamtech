import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface FormProps {
  id?: string;
}

export default function InvoiceForm(props: FormProps) {
  const { isAuthenticated } = useAuth();
  const id = props?.id;
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    description: "",
    amount: "",
    taxRate: "0",
    status: "draft",
    notes: "",
  });

  // Fetch clients
  const clients = trpc.documents.getClients.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès Requis</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/dashboard">Retour au Tableau de Bord</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createInvoiceMutation = trpc.documents.createInvoice.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.clientId) {
        toast.error("Veuillez sélectionner un client");
        setIsLoading(false);
        return;
      }

      if (!formData.amount) {
        toast.error("Veuillez entrer un montant");
        setIsLoading(false);
        return;
      }

      await createInvoiceMutation.mutateAsync({
        clientId: parseInt(formData.clientId),
        issueDate: formData.issueDate,
        dueDate: formData.dueDate || undefined,
        description: formData.description,
        amount: formData.amount,
        taxRate: formData.taxRate,
        status: formData.status,
        notes: formData.notes,
      });

      toast.success("Facture créée avec succès");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la facture");
    } finally {
      setIsLoading(false);
    }
  };

  const taxAmount = (parseFloat(formData.amount) * parseFloat(formData.taxRate)) / 100 || 0;
  const totalAmount = parseFloat(formData.amount) + taxAmount || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-4 h-16 px-4 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{id ? "Éditer" : "Nouvelle"} Facture</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Section */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Client</CardTitle>
              <CardDescription>Sélectionnez ou créez un client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientId">Client *</Label>
                <Select value={formData.clientId} onValueChange={(value) => handleSelectChange("clientId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.data?.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <Button variant="outline" type="button" onClick={() => {
              // TODO: Open client creation modal
              toast.info("Création de client - À implémenter");
            }}>
              + Créer un Nouveau Client
            </Button>
            </CardContent>
          </Card>

          {/* Document Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de la Facture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Date d'Émission *</Label>
                  <Input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Date d'Échéance</Label>
                  <Input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez les services ou produits facturés..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">Montant HT (CFA) *</Label>
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Taux TVA (%)</Label>
                  <Input
                    type="number"
                    id="taxRate"
                    name="taxRate"
                    placeholder="0"
                    value={formData.taxRate}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <Label>Montant TTC (CFA)</Label>
                  <div className="flex items-center h-10 px-3 border border-border rounded-md bg-muted/50">
                    <span className="font-semibold">{totalAmount.toLocaleString("fr-FR")}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="overdue">En Retard</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes Internes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Notes personnelles (non visibles au client)..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
