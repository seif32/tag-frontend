import { Button } from "@/components/ui/button";
import useVariants from "@/hooks/useVariants";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";

function AdminVariantsTypesPage() {
  return (
    <div>
      <Title />
      <TypeCardContainer />
    </div>
  );
}

export default AdminVariantsTypesPage;

function Title() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold">Variant Management</h1>
        <p className="text-muted-foreground">
          Manage product variant types and their values
        </p>
      </div>
      <Button>+ Add Variant Type</Button>
    </div>
  );
}

function TypeCardContainer() {
  const {
    variantTypes,
    errorVariantTypes,
    isErrorVariantTypes,
    isLoadingVariantTypes,
    refetchVariantTypes,
  } = useVariants.useAllTypes();

  const {
    variantValues,
    isLoadingVariantValues,
    errorVariantValues,
    isErrorVariantValues,
    refetchVariantValues,
  } = useVariants.useAllValues();

  if (isLoadingVariantValues) return <LoadingState type="stats" />;

  if (isErrorVariantTypes) {
    return (
      <ErrorMessage
        message={errorVariantTypes?.message || "Failed to load data"}
        dismissible
        onDismiss={refetchVariantTypes}
      />
    );
  }

  console.log("AdminVariantsTypesPage", variantValues);

  return <div></div>;
}

function TypeCard() {
  return <div></div>;
}

function CardHeader() {
  return <div></div>;
}

function CardValues() {
  return <div></div>;
}

function CardButton() {
  return <Button></Button>;
}
