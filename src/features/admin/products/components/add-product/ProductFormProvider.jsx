import { Form } from "@/components/ui/form";

const ProductFormProvider = ({ form, onSubmit, children }) => {
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {children}
      </form>
    </Form>
  );
};

export default ProductFormProvider;
