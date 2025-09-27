import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestPromoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const form = useForm({
    defaultValues: { test: "" },
  });

  console.log("🔥 TestPromoPage render");

  return (
    <div className="p-8">
      <h1>Test Promo Page</h1>
      <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded space-y-4">
            <h2>Modal with One Input</h2>
            <Input {...form.register("test")} placeholder="Test input" />
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
