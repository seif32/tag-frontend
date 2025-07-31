import { useEffect, useState } from "react";
import useProductStore from "../../store/productStore";
const variantValues = [
  {
    value: "s",
    label: "S",
  },
  {
    value: "m",
    label: "M",
  },
  {
    value: "l",
    label: "L",
  },
  {
    value: "xl",
    label: "XL",
  },
];

export function useToggleGroupState(variant, setIsDialogOpen) {
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    if (variant?.values) {
      setSelectedValues(variant.values.map((v) => v.value));
    }
  }, [variant]);

  const addVariantValue = useProductStore((state) => state.addVariantValue);
  const removeVariantValues = useProductStore(
    (state) => state.removeVariantValues
  );

  function handleSelectValue() {
    const existingValues = variant.values.map((v) => v.value.toLowerCase());
    selectedValues.forEach((val) => {
      if (!existingValues.includes(val.toLowerCase())) {
        addVariantValue(variant.id, val);
      }
    });
    const manualValues = variant.values
      .filter(
        (v) =>
          !variantValues.some(
            (opt) => opt.value.toLowerCase() === v.value.toLowerCase()
          )
      )
      .map((v) => v.value);

    const finalSelected = [...selectedValues, ...manualValues];
    const toggledOff = variant.values.filter(
      (v) => !finalSelected.includes(v.value)
    );

    if (toggledOff.length > 0) {
      removeVariantValues(
        variant.id,
        toggledOff.map((v) => v.id)
      );
    }
    setIsDialogOpen(false);
  }

  return {
    selectedValues,
    setSelectedValues,
    handleSelectValue,
  };
}
