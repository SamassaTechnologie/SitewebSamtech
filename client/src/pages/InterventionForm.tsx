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

export default function InterventionForm(props: FormProps) {
  const id = props?.id;
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    issueDate: new Date().toISOString().split("T")[0],
    interventionDate: "",
    description: "",
    technician: "",
    duration: "",
    amount: "",
    status: "draft",
    notes: "",
  });

  const clients = trpc.documents.getClients.useQuery(undefined, { enabled: isAuthenticated });
  const createInterventionMutation = trpc.documents.createIntervention.useMutation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.clientId) {
        toast.error("Veuillez sélectionner un client");
        setIsLoading(false);
        return;
      }

      if (!formData.description) {
        toast.error("Veuillez décrire l'intervention");
        setIsLoading(false);
        return;
      }

      await createInterventionMutation.mutateAsync({
        clientId: parseInt(formData.clientId),
        issueDate: formData.issueDate,
        interventionDate: formData.interventionDate || undefined,
        description: formData.description,
        technician: formData.technician,
        duration: formData.duration,
        amount: formData.amount || undefined,
        status: formData.status,
        notes: formData.notes,
      });

      toast.success("Fiche d'intervention créée avec succès");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la fiche d'intervention");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-2xl font-bold text-foreground">{id ? "Éditer" : "Nouvelle"} Fiche d'Intervention</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations Client</CardTitle>
              <CardDescription>Sélectionnez un client</CardDescription>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails de l'Intervention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Date de Création *</Label>
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
                  <Label htmlFor="interventionDate">Date d'Intervention</Label>
                  <Input
                    type="date"
                    id="interventionDate"
                    name="interventionDate"
                    value={formData.interventionDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description de l'Intervention *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez l'intervention effectuée, les problèmes rencontrés et les solutions apportées..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="technician">Technicien</Label>
                  <Input
                    type="text"
                    id="technician"
                    name="technician"
                    placeholder="Nom du technicien"
                    value={formData.technician}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Durée (heures)</Label>
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    placeholder="Ex: 2h30"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Montant (CFA) - Optionnel</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="completed">Complétée</SelectItem>
                    <SelectItem value="invoiced">Facturée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes Internes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Notes personnelles, observations supplémentaires..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

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
