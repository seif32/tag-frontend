import jsPDF from "jspdf";
import { formatCurrency } from "./formatCurrency";

export const generateOrderInvoicePDF = async (orderData) => {
  try {
    // Validate order data exists
    if (!orderData) {
      throw new Error("Order data is required");
    }

    const doc = new jsPDF("portrait", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let yPosition = 60;
    const leftMargin = 40;
    const rightMargin = pageWidth - 40;

    // Helper functions
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch {
        return "Invalid Date";
      }
    };

    const getProductDescription = (item) => {
      if (!item?.product) return "Product";

      const product = item.product;
      const variant = product.variants?.[0];
      let description = product.name || "Product";

      if (variant?.types && variant.types.length > 0) {
        const variantInfo = variant.types
          .map(
            (type) =>
              `${type.type_name || "Type"}: ${type.value?.name || "N/A"}`
          )
          .join(", ");
        description += ` (${variantInfo})`;
      }

      return description;
    };

    const getBundleDescription = (bundle) => {
      if (!bundle?.product) return "Bundle";

      const product = bundle.product;
      const variant = product?.variants?.[0];

      let description = `Bundle: ${bundle.bundle_quantity || 1}× ${
        product?.name || "Product"
      }`;

      if (variant?.types && variant.types.length > 0) {
        const variantInfo = variant.types
          .map(
            (type) =>
              `${type.type_name || "Type"}: ${type.value?.name || "N/A"}`
          )
          .join(", ");
        description += ` (${variantInfo})`;
      }

      return description;
    };

    // 🆕 COMMENTED OUT: Balance Due calculation
    // const calculateTotals = () => {
    //   const totalAmount = parseFloat(orderData.total_amount) || 0;
    //   const paymentMade =
    //     orderData.payment_status === "completed" ? totalAmount : 0;
    //   const balanceDue = Math.max(0, totalAmount - paymentMade);
    //
    //   return { totalAmount, paymentMade, balanceDue };
    // };
    //
    // const { totalAmount, paymentMade, balanceDue } = calculateTotals();

    // Simple totals without balance calculation
    const totalAmount = parseFloat(orderData.total_amount) || 0;
    const paymentMade =
      orderData.payment_status === "completed" ? totalAmount : 0;

    // === HEADER SECTION ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(48);
    doc.text("TAG", leftMargin, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("TAG ENTERPRISES", leftMargin, yPosition + 25);

    // Invoice title (right aligned)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(36);
    const invoiceTitle = "Invoice";
    doc.text(
      invoiceTitle,
      rightMargin - doc.getTextWidth(invoiceTitle),
      yPosition
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const invoiceNum = `Invoice# INV-${String(orderData.id || 0).padStart(
      6,
      "0"
    )}`;
    doc.text(
      invoiceNum,
      rightMargin - doc.getTextWidth(invoiceNum),
      yPosition + 40
    );

    // 🆕 COMMENTED OUT: Balance Due in header
    // doc.setFont("helvetica", "normal");
    // doc.setFontSize(10);
    // doc.text(
    //   "Balance Due",
    //   rightMargin - doc.getTextWidth("Balance Due"),
    //   yPosition + 65
    // );
    //
    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(18);
    // const balanceText = `£${formatCurrency(balanceDue)}`;
    // doc.text(
    //   balanceText,
    //   rightMargin - doc.getTextWidth(balanceText),
    //   yPosition + 85
    // );

    yPosition += 140;

    // === COMPANY AND BILL TO SECTION ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Tag Enterprises (London) Limited", leftMargin, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("32 George V Avenue", leftMargin, yPosition + 20);
    doc.text("Pinner London HA5 5SE", leftMargin, yPosition + 35);
    doc.text("United Kingdom", leftMargin, yPosition + 50);

    // Bill To (right side)
    const customerName = orderData.user
      ? `${orderData.user.first_name || ""} ${
          orderData.user.last_name || ""
        }`.trim()
      : "Customer";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Bill To", rightMargin - 200, yPosition);

    doc.text(customerName || "Customer", rightMargin - 200, yPosition + 20);

    // Safe address extraction with validation
    if (orderData.address) {
      const addr = orderData.address;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      if (addr.description)
        doc.text(addr.description, rightMargin - 200, yPosition + 35);
      if (addr.building_number && addr.street_name) {
        doc.text(
          `${addr.building_number} ${addr.street_name}`,
          rightMargin - 200,
          yPosition + 50
        );
      }
      if (addr.apartment_number) {
        doc.text(
          `Apt ${addr.apartment_number}`,
          rightMargin - 200,
          yPosition + 65
        );
      }
      if (addr.city_name && addr.postal_code) {
        doc.text(
          `${addr.city_name} ${addr.postal_code}`,
          rightMargin - 200,
          yPosition + 80
        );
      }
      if (addr.country) {
        doc.text(addr.country.toUpperCase(), rightMargin - 200, yPosition + 95);
      }
    }

    yPosition += 130;

    // === INVOICE DETAILS ===
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Invoice Date :", rightMargin - 200, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(formatDate(orderData.created_at), rightMargin - 100, yPosition);

    doc.setFont("helvetica", "normal");
    doc.text("Terms :", rightMargin - 200, yPosition + 15);
    doc.text("Due On Receipt", rightMargin - 100, yPosition + 15);

    doc.text("Due Date :", rightMargin - 200, yPosition + 30);
    doc.setFont("helvetica", "bold");
    doc.text(
      formatDate(orderData.created_at),
      rightMargin - 100,
      yPosition + 30
    );

    yPosition += 60;

    // === ITEMS TABLE ===
    const drawTableHeader = () => {
      doc.setFillColor(74, 74, 74);
      doc.rect(leftMargin, yPosition, pageWidth - 80, 25, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("#", leftMargin + 10, yPosition + 16);
      doc.text("Item & Description", leftMargin + 60, yPosition + 16);
      doc.text("Qty", leftMargin + 320, yPosition + 16);
      doc.text("Rate", leftMargin + 380, yPosition + 16);
      doc.text("Amount", rightMargin - 80, yPosition + 16);

      yPosition += 25;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
    };

    // Draw initial table header
    drawTableHeader();

    // Combine regular items and bundles
    const allLineItems = [];

    // Safe iteration with validation
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      orderData.items.forEach((item) => {
        if (item && item.product) {
          allLineItems.push({
            type: "item",
            data: item,
            description: getProductDescription(item),
            quantity: parseFloat(item.quantity) || 0,
            unit: "pcs",
            rate: parseFloat(item.unit_price) || 0,
            amount: parseFloat(item.unit_price * item.quantity) || 0,
          });
        }
      });
    }

    // Safe bundle iteration with validation
    if (Array.isArray(orderData.bundles) && orderData.bundles.length > 0) {
      orderData.bundles.forEach((bundle) => {
        if (bundle && bundle.product) {
          allLineItems.push({
            type: "bundle",
            data: bundle,
            description: getBundleDescription(bundle),
            quantity: parseFloat(bundle.times_applied) || 1,
            unit: (bundle.times_applied || 1) > 1 ? "bundles" : "bundle",
            rate: parseFloat(bundle.bundle_subtotal) || 0,
            amount:
              parseFloat(
                bundle.bundle_subtotal * (bundle.times_applied || 1)
              ) || 0,
          });
        }
      });
    }

    // Handle empty order
    if (allLineItems.length === 0) {
      doc.text("No items in this order", leftMargin + 60, yPosition + 15);
      yPosition += 30;
    } else {
      // Table rows with text wrapping
      allLineItems.forEach((lineItem, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 200) {
          doc.addPage();
          yPosition = 60;
          drawTableHeader();
        }

        const { description, quantity, unit, rate, amount, type } = lineItem;
        const descriptionMaxWidth = 250;

        const wrappedDescription = doc.splitTextToSize(
          description,
          descriptionMaxWidth
        );

        const lineHeight = 12;
        const rowHeight = Math.max(
          30,
          wrappedDescription.length * lineHeight + 10
        );

        // Draw row number
        doc.setFont("helvetica", "normal");
        doc.text((index + 1).toString(), leftMargin + 10, yPosition + 15);

        // Add type indicator for bundles
        if (type === "bundle") {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(34, 139, 34);
          doc.text("BUNDLE", leftMargin + 60, yPosition + 8);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
        }

        // Draw wrapped description
        wrappedDescription.forEach((line, lineIndex) => {
          const textY =
            type === "bundle"
              ? yPosition + 20 + lineIndex * lineHeight
              : yPosition + 15 + lineIndex * lineHeight;
          doc.text(line, leftMargin + 60, textY);
        });

        // Right-aligned columns
        const centerY = yPosition + Math.max(15, rowHeight / 2);

        doc.setFont("helvetica", "normal");
        doc.text(`${quantity.toFixed(0)} ${unit}`, leftMargin + 320, centerY);

        doc.text(formatCurrency(rate), leftMargin + 380, centerY);

        doc.setFont("helvetica", "bold");
        doc.text(formatCurrency(amount), rightMargin - 80, centerY);
        doc.setFont("helvetica", "normal");

        yPosition += rowHeight;

        // Separator line
        if (index < allLineItems.length - 1) {
          doc.setDrawColor(224, 224, 224);
          doc.line(leftMargin, yPosition, rightMargin, yPosition);
          yPosition += 5;
        }
      });
    }

    yPosition += 20;

    // === TOTALS SECTION ===
    const totalsX = rightMargin - 200;

    // Safe total calculations
    const subtotal = parseFloat(orderData.subtotal) || 0;
    const taxAmount = parseFloat(orderData.tax_amount) || 0;
    const discountAmount = parseFloat(orderData.discount_amount) || 0;
    const shippingAmount = parseFloat(orderData.shipping_amount) || 0;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Sub Total", totalsX, yPosition);
    doc.text(formatCurrency(subtotal), rightMargin - 80, yPosition);
    yPosition += 20;

    if (taxAmount > 0) {
      doc.text("Tax", totalsX, yPosition);
      doc.text(formatCurrency(taxAmount), rightMargin - 80, yPosition);
      yPosition += 20;
    }

    if (discountAmount > 0) {
      doc.setTextColor(211, 47, 47);
      const discountPercent = parseFloat(orderData.discount_percent) || 0;
      doc.text(
        `Discount ${discountPercent > 0 ? `(${discountPercent}%)` : ""}`,
        totalsX,
        yPosition
      );
      doc.text(
        `-${formatCurrency(discountAmount)}`,
        rightMargin - 80,
        yPosition
      );
      doc.setTextColor(0, 0, 0);
      yPosition += 20;
    }

    doc.text("Shipping Charge", totalsX, yPosition);
    doc.text(formatCurrency(shippingAmount), rightMargin - 80, yPosition);
    yPosition += 20;

    // Total line
    doc.setDrawColor(224, 224, 224);
    doc.line(totalsX, yPosition, rightMargin, yPosition);
    yPosition += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total", totalsX, yPosition);
    doc.text(`£${formatCurrency(totalAmount)}`, rightMargin - 80, yPosition);
    yPosition += 20;

    // 🆕 COMMENTED OUT: Payment Made section
    // doc.setFont("helvetica", "normal");
    // doc.setFontSize(10);
    // if (paymentMade > 0) {
    //   doc.setTextColor(211, 47, 47);
    //   doc.text("Payment Made", totalsX, yPosition);
    //   doc.text(`(-) ${formatCurrency(paymentMade)}`, rightMargin - 80, yPosition);
    //   yPosition += 20;
    // }

    // 🆕 COMMENTED OUT: Balance Due in totals
    // doc.setDrawColor(224, 224, 224);
    // doc.line(totalsX, yPosition, rightMargin, yPosition);
    // yPosition += 15;
    //
    // doc.setTextColor(0, 0, 0);
    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(14);
    // doc.text("Balance Due", totalsX, yPosition);
    // doc.text(`£${formatCurrency(balanceDue)}`, rightMargin - 80, yPosition);

    // === FOOTER SECTION ===
    yPosition += 40;

    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 60;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", leftMargin, yPosition);
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-GB")}`,
      rightMargin - 150,
      yPosition
    );

    // Safe file naming
    const filename = `invoice-INV-${String(orderData.id || "0").padStart(
      6,
      "0"
    )}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    console.log("✅ Invoice PDF generated successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error generating invoice PDF:", error);
    throw error;
  }
};

export const generateInvoiceFromOrder = async (orderData) => {
  try {
    return await generateOrderInvoicePDF(orderData);
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    return false;
  }
};
