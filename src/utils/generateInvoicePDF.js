import jsPDF from "jspdf";
import { formatCurrency } from "./formatCurrency";

export const generateOrderInvoicePDF = async (orderData) => {
  try {
    const doc = new jsPDF("portrait", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let yPosition = 60;
    const leftMargin = 40;
    const rightMargin = pageWidth - 40;

    // Helper functions
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-GB");
    };

    const getProductDescription = (item) => {
      const product = item.product;
      const variant = product.variants?.[0];
      let description = product.name;

      if (variant?.types && variant.types.length > 0) {
        const variantInfo = variant.types
          .map((type) => `${type.type_name}: ${type.value.name}`)
          .join(", ");
        description += ` (${variantInfo})`;
      }

      return description;
    };

    const getBundleDescription = (bundle) => {
      const product = bundle.product;
      const variant = product?.variants?.[0];

      let description = `Bundle: ${bundle.bundle_quantity}× ${
        product?.name || "Product"
      }`;

      if (variant?.types && variant.types.length > 0) {
        const variantInfo = variant.types
          .map((type) => `${type.type_name}: ${type.value.name}`)
          .join(", ");
        description += ` (${variantInfo})`;
      }

      return description;
    };

    // Calculate balance
    const totalAmount = parseFloat(orderData.total_amount);
    const paymentMade =
      orderData.payment_status === "completed" ? totalAmount : 0;
    const balanceDue = totalAmount - paymentMade;

    // === HEADER SECTION ===
    // Company logo/name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(48);
    doc.text("TE", leftMargin, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("TAG ENTERPRISES", leftMargin, yPosition + 25);

    // Invoice title and balance (right aligned)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(36);
    doc.text("Invoice", rightMargin - doc.getTextWidth("Invoice"), yPosition);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const invoiceNum = `Invoice# INV-${String(orderData.id).padStart(6, "0")}`;
    doc.text(
      invoiceNum,
      rightMargin - doc.getTextWidth(invoiceNum),
      yPosition + 40
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "Balance Due",
      rightMargin - doc.getTextWidth("Balance Due"),
      yPosition + 65
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const balanceText = `£${formatCurrency(balanceDue)}`;
    doc.text(
      balanceText,
      rightMargin - doc.getTextWidth(balanceText),
      yPosition + 85
    );

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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Bill To", rightMargin - 200, yPosition);

    doc.text(
      `${orderData.user.first_name} ${orderData.user.last_name}`,
      rightMargin - 200,
      yPosition + 20
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(orderData.address.description, rightMargin - 200, yPosition + 35);
    doc.text(
      `${orderData.address.building_number} ${orderData.address.street_name}`,
      rightMargin - 200,
      yPosition + 50
    );
    doc.text(
      `Apt ${orderData.address.apartment_number}`,
      rightMargin - 200,
      yPosition + 65
    );
    doc.text(
      `${orderData.address.city_name} ${orderData.address.postal_code}`,
      rightMargin - 200,
      yPosition + 80
    );
    doc.text(
      orderData.address.country.toUpperCase(),
      rightMargin - 200,
      yPosition + 95
    );

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
    // Function to draw table header
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

    // Add regular items
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item) => {
        allLineItems.push({
          type: "item",
          data: item,
          description: getProductDescription(item),
          quantity: parseFloat(item.quantity),
          unit: "pcs",
          rate: parseFloat(item.unit_price),
          amount: parseFloat(item.unit_price * item.quantity),
        });
      });
    }

    // Add bundles
    if (orderData.bundles && orderData.bundles.length > 0) {
      orderData.bundles.forEach((bundle) => {
        console.log("bundleXXX", bundle);
        allLineItems.push({
          type: "bundle",
          data: bundle,
          description: getBundleDescription(bundle),
          quantity: bundle.times_applied,
          unit: bundle.times_applied > 1 ? "bundles" : "bundle",
          rate: parseFloat(bundle.bundle_subtotal),
          amount: parseFloat(bundle.bundle_subtotal * bundle.times_applied),
        });
      });
    }

    // Table rows with text wrapping for both items and bundles
    allLineItems.forEach((lineItem, index) => {
      // Check if we need a new page before drawing the row
      if (yPosition > pageHeight - 200) {
        doc.addPage();
        yPosition = 60;
        drawTableHeader(); // Redraw header on new page
      }

      const { description, quantity, unit, rate, amount, type } = lineItem;
      const rowStartY = yPosition;

      // Calculate available width for description column
      const descriptionMaxWidth = 320 - 60 - 20; // 20px padding

      // Split the description text to fit the column width
      const wrappedDescription = doc.splitTextToSize(
        description,
        descriptionMaxWidth
      );

      // Calculate row height based on wrapped text
      const lineHeight = 12;
      const rowHeight = Math.max(
        30,
        wrappedDescription.length * lineHeight + 10
      );

      // Draw row number
      doc.text((index + 1).toString(), leftMargin + 10, yPosition + 15);

      // Add type indicator for bundles
      if (type === "bundle") {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(34, 139, 34); // Green color for bundle
        doc.text("BUNDLE", leftMargin + 60, yPosition + 8);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }

      // Draw wrapped description text
      wrappedDescription.forEach((line, lineIndex) => {
        const textY =
          type === "bundle"
            ? yPosition + 20 + lineIndex * lineHeight
            : yPosition + 15 + lineIndex * lineHeight;
        doc.text(line, leftMargin + 60, textY);
      });

      // Draw other columns (aligned to center of row)
      const centerY = yPosition + Math.max(15, rowHeight / 2);

      // Quantity with unit
      doc.text(`${quantity.toFixed(0)} ${unit}`, leftMargin + 320, centerY);

      // Rate
      doc.text(formatCurrency(rate), leftMargin + 380, centerY);

      // Amount
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(amount), rightMargin - 80, centerY);
      doc.setFont("helvetica", "normal");

      // Update yPosition for next row
      yPosition += rowHeight;

      // Add line separator (except for last item)
      if (index < allLineItems.length - 1) {
        doc.setDrawColor(224, 224, 224);
        doc.line(leftMargin, yPosition, rightMargin, yPosition);
        yPosition += 5; // Small gap after separator
      }
    });

    yPosition += 20;

    // === TOTALS SECTION ===
    const totalsX = rightMargin - 200;

    doc.text("Sub Total", totalsX, yPosition);
    doc.text(formatCurrency(orderData.subtotal), rightMargin - 80, yPosition);
    yPosition += 20;

    if (parseFloat(orderData.tax_amount || 0) > 0) {
      doc.text(`Tax`, totalsX, yPosition);
      doc.text(
        formatCurrency(orderData.tax_amount),
        rightMargin - 80,
        yPosition
      );
      yPosition += 20;
    }

    if (parseFloat(orderData.discount_amount || 0) > 0) {
      doc.setTextColor(211, 47, 47);
      doc.text(
        `Discount (${orderData.discount_percent || 0}%)`,
        totalsX,
        yPosition
      );
      doc.text(
        `-${formatCurrency(orderData.discount_amount)}`,
        rightMargin - 80,
        yPosition
      );
      doc.setTextColor(0, 0, 0);
      yPosition += 20;
    }

    doc.text("Shipping charge", totalsX, yPosition);
    doc.text(
      formatCurrency(orderData.shipping_amount || 0),
      rightMargin - 80,
      yPosition
    );
    yPosition += 20;

    // Draw line above total
    doc.setDrawColor(224, 224, 224);
    doc.line(totalsX, yPosition, rightMargin, yPosition);
    yPosition += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total", totalsX, yPosition);
    doc.text(
      `£${formatCurrency(orderData.total_amount)}`,
      rightMargin - 80,
      yPosition
    );
    yPosition += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(211, 47, 47);
    doc.text("Payment Made", totalsX, yPosition);
    doc.text(`(-) ${formatCurrency(paymentMade)}`, rightMargin - 80, yPosition);
    yPosition += 20;

    // Final balance due
    doc.setDrawColor(224, 224, 224);
    doc.line(totalsX, yPosition, rightMargin, yPosition);
    yPosition += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Balance Due", totalsX, yPosition);
    doc.text(`£${formatCurrency(balanceDue)}`, rightMargin - 80, yPosition);

    // === FOOTER SECTION ===
    yPosition += 40;

    // Check if we have space for footer, if not add new page
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

    // Save the PDF
    const filename = `invoice-INV-${String(orderData.id).padStart(
      6,
      "0"
    )}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    console.log("✅ Bundle-aware Invoice PDF generated successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error generating invoice PDF:", error);
    return false;
  }
};

export const generateInvoiceFromOrder = async (orderData) => {
  return await generateOrderInvoicePDF(orderData);
};
