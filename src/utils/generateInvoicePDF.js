// import html2canvas from "html2canvas-pro";
// import jsPDF from "jspdf";

// export const generateOrderInvoicePDF = async (orderData) => {
//   try {
//     const invoiceElement = document.createElement("div");
//     invoiceElement.style.cssText = `
//       position: absolute;
//       left: -9999px;
//       top: 0;
//       width: 794px;
//       min-height: 1123px;
//       padding: 40px;
//       font-family: Arial, sans-serif;
//       background-color: #ffffff;
//       color: #000000;
//       font-size: 14px;
//       line-height: 1.4;
//       box-sizing: border-box;
//     `;

//     // Calculate balance due
//     const totalAmount = parseFloat(orderData.total_amount);
//     const paymentMade =
//       orderData.payment_status === "completed" ? totalAmount : 0;
//     const balanceDue = totalAmount - paymentMade;

//     // Format date helper
//     const formatDate = (dateString) => {
//       return new Date(dateString).toLocaleDateString("en-GB");
//     };

//     // Generate product description with variants
//     const getProductDescription = (item) => {
//       const product = item.product;
//       const variant = product.variants?.[0];
//       let description = product.name;

//       if (variant?.types && variant.types.length > 0) {
//         const variantInfo = variant.types
//           .map((type) => `${type.type_name}: ${type.value.name}`)
//           .join(", ");
//         description += ` (${variantInfo})`;
//       }

//       return description;
//     };

//     invoiceElement.innerHTML = `
//       <!-- Header Section -->
//       <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
//         <!-- Company Logo -->
//         <div>
//           <div style="font-size: 48px; font-weight: bold; letter-spacing: 4px; margin-bottom: 10px; color: #000000;">
//             TE
//           </div>
//           <div style="font-size: 12px; color: #666666; letter-spacing: 2px;">
//             TAG ENTERPRISES
//           </div>
//         </div>

//         <!-- Invoice Title and Balance -->
//         <div style="text-align: right;">
//           <h1 style="font-size: 36px; margin: 0 0 10px 0; font-weight: normal; color: #000000;">
//             Invoice
//           </h1>
//           <div style="margin-bottom: 20px; color: #000000;">
//             <strong>Invoice# INV-${String(orderData.id).padStart(
//               6,
//               "0"
//             )}</strong>
//           </div>
//           <div>
//             <div style="color: #666666; margin-bottom: 5px;">Balance Due</div>
//             <div style="font-size: 18px; font-weight: bold; color: #000000;">
//               £${balanceDue.toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Company and Bill To Section -->
//       <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
//         <!-- From Company -->
//         <div style="width: 45%;">
//           <div style="font-weight: bold; margin-bottom: 10px; color: #000000;">
//             Tag Enterprises (London) Limited
//           </div>
//           <div style="color: #666666; margin-bottom: 3px;">32 George V Avenue</div>
//           <div style="color: #666666; margin-bottom: 3px;">Pinner London HA5 5SE</div>
//           <div style="color: #666666; margin-bottom: 3px;">United Kingdom</div>
//         </div>

//         <!-- Bill To -->
//         <div style="width: 45%;">
//           <div style="font-weight: bold; margin-bottom: 10px; color: #000000;">Bill To</div>
//           <div style="font-weight: bold; margin-bottom: 5px; color: #000000;">
//             ${orderData.user.first_name} ${orderData.user.last_name}
//           </div>
//           <div style="color: #666666; margin-bottom: 3px;">
//             ${orderData.address.description}
//           </div>
//           <div style="color: #666666; margin-bottom: 3px;">
//             ${orderData.address.building_number} ${
//       orderData.address.street_name
//     }
//           </div>
//           <div style="color: #666666; margin-bottom: 3px;">
//             Apt ${orderData.address.apartment_number}
//           </div>
//           <div style="color: #666666; margin-bottom: 3px;">
//             ${orderData.address.city} ${orderData.address.postal_code}
//           </div>
//           <div style="color: #666666; margin-bottom: 3px;">
//             ${orderData.address.country.toUpperCase()}
//           </div>
//         </div>
//       </div>

//       <!-- Invoice Details -->
//       <div style="margin-bottom: 30px;">
//         <table style="width: 100%; border-spacing: 0;">
//           <tbody>
//             <tr>
//               <td style="width: 50%;"></td>
//               <td style="text-align: right; padding-bottom: 10px;">
//                 <div style="margin-bottom: 8px;">
//                   <span style="color: #666666;">Invoice Date :</span>
//                   <span style="margin-left: 40px; font-weight: bold; color: #000000;">
//                     ${formatDate(orderData.created_at)}
//                   </span>
//                 </div>
//                 <div style="margin-bottom: 8px;">
//                   <span style="color: #666666;">Terms :</span>
//                   <span style="margin-left: 40px; color: #000000;">
//                     Due On Receipt
//                   </span>
//                 </div>
//                 <div>
//                   <span style="color: #666666;">Due Date :</span>
//                   <span style="margin-left: 40px; font-weight: bold; color: #000000;">
//                     ${formatDate(orderData.created_at)}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <!-- Items Table -->
//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <thead>
//           <tr style="background-color: #4a4a4a;">
//             <th style="padding: 12px 8px; text-align: left; width: 8%; font-size: 13px; color: #ffffff;">#</th>
//             <th style="padding: 12px 8px; text-align: left; width: 42%; font-size: 13px; color: #ffffff;">Item & Description</th>
//             <th style="padding: 12px 8px; text-align: center; width: 15%; font-size: 13px; color: #ffffff;">Qty</th>
//             <th style="padding: 12px 8px; text-align: center; width: 15%; font-size: 13px; color: #ffffff;">Rate</th>
//             <th style="padding: 12px 8px; text-align: right; width: 20%; font-size: 13px; color: #ffffff;">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${orderData.items
//             .map(
//               (item, index) => `
//             <tr style="border-bottom: ${
//               index < orderData.items.length - 1 ? "1px solid #e0e0e0" : "none"
//             };">
//               <td style="padding: 12px 8px; color: #000000;">${index + 1}</td>
//               <td style="padding: 12px 8px; font-weight: 500; color: #000000;">
//                 ${getProductDescription(item)}
//               </td>
//               <td style="padding: 12px 8px; text-align: center; color: #000000;">
//                 <div>${parseFloat(item.quantity).toFixed(2)}</div>
//                 <div style="font-size: 11px; color: #666666;">pcs</div>
//               </td>
//               <td style="padding: 12px 8px; text-align: center; color: #000000;">
//                 ${parseFloat(item.unit_price).toFixed(2)}
//               </td>
//               <td style="padding: 12px 8px; text-align: right; font-weight: 500; color: #000000;">
//                 ${parseFloat(item.total_price).toFixed(2)}
//               </td>
//             </tr>
//           `
//             )
//             .join("")}
//         </tbody>
//       </table>

//       <!-- Totals Section -->
//       <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
//         <div style="width: 300px;">
//           <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; color: #000000;">
//             <span>Sub Total</span>
//             <span>${parseFloat(orderData.subtotal).toFixed(2)}</span>
//           </div>

//           ${
//             parseFloat(orderData.tax_amount) > 0
//               ? `
//           <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; color: #000000;">
//             <span>Tax (${orderData.tax_percent}%)</span>
//             <span>${parseFloat(orderData.tax_amount).toFixed(2)}</span>
//           </div>
//           `
//               : ""
//           }

//           ${
//             parseFloat(orderData.discount_amount) > 0
//               ? `
//           <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; color: #d32f2f;">
//             <span>Discount (${orderData.discount_percent}%)</span>
//             <span>-${parseFloat(orderData.discount_amount).toFixed(2)}</span>
//           </div>
//           `
//               : ""
//           }

//           <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; color: #000000;">
//             <span>Shipping charge</span>
//             <span>${parseFloat(orderData.shipping_amount).toFixed(2)}</span>
//           </div>

//           <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px; font-weight: bold; color: #000000;">
//             <span>Total</span>
//             <span>£${parseFloat(orderData.total_amount).toFixed(2)}</span>
//           </div>

//           <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #d32f2f;">
//             <span>Payment Made</span>
//             <span>(-) ${paymentMade.toFixed(2)}</span>
//           </div>

//           <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding-top: 10px; border-top: 1px solid #e0e0e0; color: #000000;">
//             <span>Balance Due</span>
//             <span>£${balanceDue.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     `;

//     // Add to DOM temporarily
//     document.body.appendChild(invoiceElement);

//     // Generate canvas
//     const canvas = await html2canvas(invoiceElement, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: "#ffffff",
//       width: invoiceElement.scrollWidth,
//       height: invoiceElement.scrollHeight,
//     });

//     // PDF dimensions (A4)
//     const pdf = new jsPDF("portrait", "pt", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     // Canvas dimensions
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;

//     // Calculate scaling to fit PDF width
//     const imgWidth = pdfWidth;
//     const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

//     const imgData = canvas.toDataURL("image/png");

//     // Multi-page logic 🎯
//     if (imgHeight <= pdfHeight) {
//       // Single page - fits perfectly
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//     } else {
//       // Multiple pages needed
//       let heightLeft = imgHeight;
//       let position = 0;

//       // First page
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;

//       // Additional pages
//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;
//       }
//     }

//     const filename = `invoice-INV-${String(orderData.id).padStart(
//       6,
//       "0"
//     )}-${new Date().toISOString().slice(0, 10)}.pdf`;
//     pdf.save(filename);

//     // Clean up
//     document.body.removeChild(invoiceElement);

//     console.log("✅ Multi-page Invoice PDF generated successfully!");
//     return true;
//   } catch (error) {
//     console.error("❌ Error generating invoice PDF:", error);
//     return false;
//   }
// };

// // Usage function
// export const generateInvoiceFromOrder = async (orderData) => {
//   return await generateOrderInvoicePDF(orderData);
// };
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
      const variant = bundle.variant;
      const product = variant?.product;
      let description = `Bundle: ${bundle.quantity}× ${
        product?.name || "Product"
      }`;

      if (variant?.types && variant.types.length > 0) {
        const variantInfo = variant.types
          .map((type) => `${type.type_name}: ${type.value.name}`)
          .join(", ");
        description += ` (${variantInfo})`;
      }

      description += ` - ${bundle.times_applied} bundle${
        bundle.times_applied > 1 ? "s" : ""
      }`;
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
      `${orderData.address.city} ${orderData.address.postal_code}`,
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

    // 🚀 NEW: Combine regular items and bundles
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
          amount: parseFloat(item.total_price),
        });
      });
    }

    // Add bundles
    if (orderData.bundles && orderData.bundles.length > 0) {
      orderData.bundles.forEach((bundle) => {
        allLineItems.push({
          type: "bundle",
          data: bundle,
          description: getBundleDescription(bundle),
          quantity: bundle.times_applied,
          unit: bundle.times_applied > 1 ? "bundles" : "bundle",
          rate: parseFloat(bundle.subtotal),
          amount: parseFloat(bundle.total) * bundle.times_applied,
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

      // 🎯 Add type indicator for bundles
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
      doc.text(`Tax (${orderData.tax_percent || 0}%)`, totalsX, yPosition);
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
