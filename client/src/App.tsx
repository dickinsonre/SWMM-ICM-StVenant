import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { UnitsProvider } from "@/contexts/UnitsContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UnitsProvider>
        <FavoritesProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </QueryClientProvider>
        </FavoritesProvider>
      </UnitsProvider>
    </ThemeProvider>
  );
}

export default App;
