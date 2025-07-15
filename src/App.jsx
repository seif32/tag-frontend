import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Hello shadcn/ui! 🎉</h1>
      <Button>Click me</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="outline">Outline Button</Button>
    </div>
  );
}

export default App;
