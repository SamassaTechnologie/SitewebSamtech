import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { FileText, Plus, Search, LogOut, Menu, X, Download, Edit2, Printer } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("invoices");

  // Fetch documents
  const invoices = trpc.documents.getInvoices.useQuery(undefined, { enabled: isAuthenticated, staleTime: 1000 * 60 });
  const quotes = trpc.documents.getQuotes.useQuery(undefined, { enabled: isAuthenticated, staleTime: 1000 * 60 });
  const receipts = trpc.documents.getReceipts.useQuery(undefined, { enabled: isAuthenticated, staleTime: 1000 * 60 });
  const interventions = trpc.documents.getInterventions.useQuery(undefined, { enabled: isAuthenticated, staleTime: 1000 * 60 });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès Requis</CardTitle>
            <CardDescription>Veuillez vous connecter pour accéder au tableau de bord</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Se Connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const filteredDocuments = (docs: any[] | undefined) => {
    if (!docs) return undefined;
    if (!searchQuery) return docs;
    return docs.filter(
      (doc) =>
        doc.documentNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-slate-100 text-slate-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-slate-100 text-slate-800",
      completed: "bg-green-100 text-green-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-slate-100 text-slate-800",
      invoiced: "bg-blue-100 text-blue-800",
      issued: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  const DocumentTable = ({ documents, type }: { documents: any[] | undefined; type: string }) => {
    const filtered = filteredDocuments(documents);
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Nouveau
          </Button>
        </div>

        {!filtered ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-2xl mb-2">⏳</div>
            <p>Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Aucun {type.toLowerCase()} trouvé</p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Créer le Premier {type}
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Numéro</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Montant</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">{doc.documentNumber}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{parseFloat(doc.amount).toLocaleString("fr-FR")} CFA</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(doc.issueDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Voir">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Éditer">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Imprimer">
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Télécharger PDF">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tableau de Bord</h1>
              <p className="text-xs text-muted-foreground">Gestion Documentaire</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r border-border bg-card/50 p-6 hidden md:block">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab("invoices");
                  setSearchQuery("");
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                  activeTab === "invoices"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                📄 Factures
              </button>
              <button
                onClick={() => {
                  setActiveTab("quotes");
                  setSearchQuery("");
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                  activeTab === "quotes"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                📋 Devis
              </button>
              <button
                onClick={() => {
                  setActiveTab("receipts");
                  setSearchQuery("");
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                  activeTab === "receipts"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                ✓ Reçus
              </button>
              <button
                onClick={() => {
                  setActiveTab("interventions");
                  setSearchQuery("");
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                  activeTab === "interventions"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                🔧 Interventions
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="invoices">Factures</TabsTrigger>
              <TabsTrigger value="quotes">Devis</TabsTrigger>
              <TabsTrigger value="receipts">Reçus</TabsTrigger>
              <TabsTrigger value="interventions">Interventions</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Factures</CardTitle>
                  <CardDescription>Gérez vos factures et suivez les paiements</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentTable documents={invoices.data} type="Facture" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Devis</CardTitle>
                  <CardDescription>Créez et gérez vos devis</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentTable documents={quotes.data} type="Devis" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="receipts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reçus</CardTitle>
                  <CardDescription>Gérez vos reçus de paiement</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentTable documents={receipts.data} type="Reçu" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interventions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fiches d'Intervention</CardTitle>
                  <CardDescription>Documentez vos interventions techniques</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentTable documents={interventions.data} type="Fiche d'Intervention" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
