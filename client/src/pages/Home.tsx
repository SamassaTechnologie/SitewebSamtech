import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Cpu, Lock, Wrench, Zap, Mail, Phone, MapPin, Code } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const services = [
    {
      icon: Wrench,
      title: "Maintenance Informatique",
      description: "Réparation et dépannage de PC et laptops, diagnostic de pannes matérielles et logicielles, nettoyage et optimisation des systèmes.",
    },
    {
      icon: Lock,
      title: "Sécurisation des Systèmes",
      description: "Protection contre les virus, les intrusions et la perte de données. Sécurité renforcée pour vos données sensibles.",
    },
    {
      icon: Cpu,
      title: "Installation et Configuration",
      description: "Systèmes d'exploitation, logiciels professionnels et réseaux informatiques (Wi-Fi, LAN). Installation complète et optimisée.",
    },
    {
      icon: Code,
      title: "Solutions Digitales",
      description: "Création d'outils web sur mesure, automatisation de documents commerciaux, déploiement d'applications en ligne.",
    },
    {
      icon: Zap,
      title: "Gestion Documentaire",
      description: "Factures, devis, reçus, fiches d'intervention avec export PDF, impression et fonctionnement hors ligne (PWA).",
    },
    {
      icon: Mail,
      title: "Assistance et Conseil",
      description: "Support informatique sur site ou à distance, conseils en équipements et accompagnement technologique.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663558749429/5Hrnjc2E4TjNZaPGBG7CTn/28_106652e3.jpg" 
              alt="Samassa Technologie" 
              className="h-10 w-auto"
            />
            <span className="font-bold text-lg text-foreground hidden sm:inline">Samassa</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="bg-[#2E8FB5] hover:bg-[#2E8FB5]/90"
                >
                  Tableau de Bord
                </Button>
              </>
            ) : (
              <Button asChild className="bg-[#2E8FB5] hover:bg-[#2E8FB5]/90">
                <a href={getLoginUrl()}>Se Connecter</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-background to-[#2E8FB5]/5">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Tout pour l'Informatique
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Samassa Technologie offre des solutions informatiques fiables, modernes et accessibles. De la maintenance à la transformation numérique, nous accompagnons votre croissance technologique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2 bg-[#2E8FB5] hover:bg-[#2E8FB5]/90">
                  <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
                    <ArrowRight className="w-5 h-5" />
                    {isAuthenticated ? "Accéder au Tableau de Bord" : "Commencer"}
                  </a>
                </Button>
                <Button size="lg" variant="outline">
                  En Savoir Plus
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#2E8FB5]/20 to-[#2E8FB5]/5 rounded-2xl p-12 flex items-center justify-center min-h-80">
              <div className="text-center">
                <Cpu className="w-24 h-24 text-[#2E8FB5] mx-auto mb-4" />
                <p className="text-muted-foreground">Solutions Informatiques Complètes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre gamme complète de services informatiques adaptés à vos besoins
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-[#2E8FB5]/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#2E8FB5]" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-[#2E8FB5]/10 to-[#2E8FB5]/5">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2E8FB5] mb-2">100+</div>
              <p className="text-muted-foreground">Clients Satisfaits</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2E8FB5] mb-2">24/7</div>
              <p className="text-muted-foreground">Support Disponible</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2E8FB5] mb-2">15+</div>
              <p className="text-muted-foreground">Années d'Expérience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2E8FB5] mb-2">6</div>
              <p className="text-muted-foreground">Services Principaux</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nous Contacter
              </h2>
              <p className="text-lg text-muted-foreground">
                Besoin d'une solution informatique ? Contactez-nous dès aujourd'hui
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#2E8FB5]/20 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-[#2E8FB5]" />
                  </div>
                  <CardTitle>Localisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Grand Marché de Kayes<br />
                    Près du 1er arrondissement de police<br />
                    Kayes, Mali
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#2E8FB5]/20 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-[#2E8FB5]" />
                  </div>
                  <CardTitle>Téléphone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    <a href="tel:+22377291931" className="hover:text-[#2E8FB5] transition-colors">
                      +223 77 29 19 31
                    </a>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#2E8FB5]/20 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-[#2E8FB5]" />
                  </div>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    <a href="mailto:samassatechnologie10@gmail.com" className="hover:text-[#2E8FB5] transition-colors">
                      samassatechnologie10@gmail.com
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 Samassa Technologie. Tous droits réservés.</p>
          <p className="text-sm mt-2">Tout pour l'Informatique</p>
        </div>
      </footer>
    </div>
  );
}
