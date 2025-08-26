import { useAuthStore } from "@/auth/store/authStore";

function HomePage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  console.log("user", user);
  console.log("isAuthenticated", isAuthenticated);
  return (
    <main className="bg-amber-500">
      <p>Home Page</p>
    </main>
  );
}

export default HomePage;
