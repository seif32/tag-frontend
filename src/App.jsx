import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/services/queryClient";
import AppRouter from "@/routing/AppRouter";
import { Toaster } from "sonner";
import { useAuthStore } from "./auth/store/authStore";
import { useEffect } from "react";
import LoadingState from "./ui/LoadingState";

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingState type="app" />;

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;
