import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import InvoiceForm from "./pages/InvoiceForm";
import QuoteForm from "./pages/QuoteForm";
import ReceiptForm from "./pages/ReceiptForm";
import InterventionForm from "./pages/InterventionForm";
import { usePWA } from "./hooks/usePWA";

const InvoiceEditWrapper = (props: any) => <InvoiceForm id={props.id} />;
const QuoteEditWrapper = (props: any) => <QuoteForm id={props.id} />;
const ReceiptEditWrapper = (props: any) => <ReceiptForm id={props.id} />;
const InterventionEditWrapper = (props: any) => <InterventionForm id={props.id} />;

function Router() {
  return (
    <Switch>
      <Route path="" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/invoice/new" component={() => <InvoiceForm />} />
      <Route path="/invoice/:id" component={InvoiceEditWrapper} />
      <Route path="/quote/new" component={() => <QuoteForm />} />
      <Route path="/quote/:id" component={QuoteEditWrapper} />
      <Route path="/receipt/new" component={() => <ReceiptForm />} />
      <Route path="/receipt/:id" component={ReceiptEditWrapper} />
      <Route path="/intervention/new" component={() => <InterventionForm />} />
      <Route path="/intervention/:id" component={InterventionEditWrapper} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  usePWA();
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
