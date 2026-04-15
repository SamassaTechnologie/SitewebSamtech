import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type DocumentType = "facture" | "devis" | "recu" | "intervention";

type BusinessDocument = {
  id: string;
  type: DocumentType;
  numero: string;
  client: string;
  date: string;
  montant: number;
  details: string;
  statut: string;
};

const STORAGE_KEY = "samassa.documents.v1";

const typeMeta: Record<DocumentType, { label: string; prefix: string; statuts: string[] }> = {
  facture: { label: "Facture", prefix: "FAC", statuts: ["Brouillon", "Envoyée", "Payée"] },
  devis: { label: "Devis", prefix: "DEV", statuts: ["Brouillon", "Envoyé", "Accepté", "Refusé"] },
  recu: { label: "Réçu", prefix: "REC", statuts: ["Brouillon", "Émis", "Annulé"] },
  intervention: { label: "Fiche d'intervention", prefix: "INT", statuts: ["Brouillon", "Complétée", "Facturée", "Annulée"] },
};

const today = new Date().toISOString().slice(0, 10);

function readInitialDocuments(): BusinessDocument[] {
  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (!fromStorage) return [];

  try {
    const parsed = JSON.parse(fromStorage) as BusinessDocument[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
}

function App() {
  const [documents, setDocuments] = useState<BusinessDocument[]>(readInitialDocuments);
  const [type, setType] = useState<DocumentType>("facture");
  const [client, setClient] = useState("");
  const [date, setDate] = useState(today);
  const [montant, setMontant] = useState(0);
  const [details, setDetails] = useState("");
  const [statut, setStatut] = useState(typeMeta.facture.statuts[0]);

  const totals = useMemo(() => {
    return documents.reduce(
      (acc, doc) => {
        acc.count += 1;
        acc.amount += doc.montant;
        return acc;
      },
      { count: 0, amount: 0 },
    );
  }, [documents]);

  function persist(nextDocuments: BusinessDocument[]) {
    setDocuments(nextDocuments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDocuments));
  }

  function makeDocumentNumber(nextType: DocumentType, existingDocs: BusinessDocument[]) {
    const year = new Date().getFullYear();
    const sameTypeCount = existingDocs.filter((d) => d.type === nextType).length + 1;
    return `${typeMeta[nextType].prefix}-${year}-${String(sameTypeCount).padStart(3, "0")}`;
  }

  function createDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!client.trim()) return;

    const newDoc: BusinessDocument = {
      id: crypto.randomUUID(),
      type,
      numero: makeDocumentNumber(type, documents),
      client: client.trim(),
      date,
      montant,
      details: details.trim(),
      statut,
    };

    persist([newDoc, ...documents]);
    setClient("");
    setDate(today);
    setMontant(0);
    setDetails("");
    setStatut(typeMeta[type].statuts[0]);
  }

  function deleteDocument(id: string) {
    persist(documents.filter((doc) => doc.id !== id));
  }

  function exportPdf(doc: BusinessDocument) {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Samassa Technologie", 15, 20);
    pdf.setFontSize(11);
    pdf.text("Grand Marché de Kayes - près du 1er arrondissement de police", 15, 28);
    pdf.text("Tél: +223 77 29 19 31 | Email: samassatechnologie10@gmail.com", 15, 34);
    pdf.line(15, 38, 195, 38);

    pdf.setFontSize(14);
    pdf.text(typeMeta[doc.type].label, 15, 48);
    pdf.setFontSize(11);
    pdf.text(`Numéro: ${doc.numero}`, 15, 58);
    pdf.text(`Client: ${doc.client}`, 15, 66);
    pdf.text(`Date: ${doc.date}`, 15, 74);
    pdf.text(`Statut: ${doc.statut}`, 15, 82);
    pdf.text(`Montant: ${formatCurrency(doc.montant)}`, 15, 90);

    pdf.text("Détails:", 15, 102);
    const wrapped = pdf.splitTextToSize(doc.details || "-", 170);
    pdf.text(wrapped, 15, 110);

    pdf.save(`${doc.numero}.pdf`);
  }

  return (
    <div>
      <header className="hero">
        <h1>Samassa Technologie</h1>
        <p>
          Maintenance, sécurisation, installation et développement de solutions digitales au Grand Marché de Kayes.
        </p>
        <div className="contact-row">
          <span>📍 Grand Marché de Kayes, près du 1er arrondissement de police</span>
          <span>📞 00223 77 29 19 31</span>
          <span>✉️ samassatechnologie10@gmail.com</span>
        </div>
      </header>

      <main className="layout">
        <section className="card">
          <h2>Nos activités principales</h2>
          <ul>
            <li>Maintenance informatique (réparation, diagnostic, optimisation)</li>
            <li>Sécurisation des systèmes (virus, intrusions, sauvegardes)</li>
            <li>Installation et configuration (Windows, logiciels, Wi-Fi / LAN)</li>
            <li>Création de solutions digitales et automatisation documentaire</li>
            <li>Support et assistance sur site ou à distance</li>
          </ul>
        </section>

        <section className="card">
          <h2>Gestion de documents (PWA)</h2>
          <p>
            Créez vos factures, devis, réçus et fiches d'intervention. Les données sont enregistrées localement pour un
            usage hors ligne.
          </p>

          <form onSubmit={createDocument} className="grid-form">
            <label>
              Type de document
              <select
                value={type}
                onChange={(e) => {
                  const selected = e.target.value as DocumentType;
                  setType(selected);
                  setStatut(typeMeta[selected].statuts[0]);
                }}
              >
                {Object.entries(typeMeta).map(([value, info]) => (
                  <option key={value} value={value}>
                    {info.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Client
              <input value={client} onChange={(e) => setClient(e.target.value)} required placeholder="Nom du client" />
            </label>

            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>

            <label>
              Montant (XOF)
              <input
                type="number"
                min={0}
                step={1000}
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value || 0))}
              />
            </label>

            <label>
              Statut
              <select value={statut} onChange={(e) => setStatut(e.target.value)}>
                {typeMeta[type].statuts.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>

            <label className="full">
              Détails
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Description de l'intervention, matériels, notes..."
              />
            </label>

            <button type="submit">Ajouter le document</button>
          </form>
        </section>

        <section className="card">
          <h2>Tableau de bord</h2>
          <div className="stats">
            <article>
              <h3>{totals.count}</h3>
              <p>Documents créés</p>
            </article>
            <article>
              <h3>{formatCurrency(totals.amount)}</h3>
              <p>Montant total</p>
            </article>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6}>Aucun document pour le moment.</td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.numero}</td>
                      <td>{typeMeta[doc.type].label}</td>
                      <td>{doc.client}</td>
                      <td>{doc.date}</td>
                      <td>{formatCurrency(doc.montant)}</td>
                      <td>
                        <div className="action-row">
                          <button type="button" onClick={() => exportPdf(doc)}>
                            PDF
                          </button>
                          <button type="button" className="danger" onClick={() => deleteDocument(doc.id)}>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
