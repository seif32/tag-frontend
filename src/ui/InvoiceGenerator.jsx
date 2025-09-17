import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Enhanced color fallback handler
const prepareElementForHtml2Canvas = (element) => {
  const originalStyles = new Map();
  const elements = element.querySelectorAll("*");

  elements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);
    const hasModernColor = ["oklch", "oklab", "color(", "lch(", "lab("].some(
      (colorFunc) =>
        computedStyle.color.includes(colorFunc) ||
        computedStyle.backgroundColor.includes(colorFunc) ||
        computedStyle.borderColor.includes(colorFunc)
    );

    if (hasModernColor) {
      originalStyles.set(el, {
        color: el.style.color,
        backgroundColor: el.style.backgroundColor,
        borderColor: el.style.borderColor,
      });

      // Set fallback colors
      if (
        computedStyle.color.includes("oklch") ||
        computedStyle.color.includes("oklab")
      ) {
        el.style.color = "#000000";
      }
      if (
        computedStyle.backgroundColor.includes("oklch") ||
        computedStyle.backgroundColor.includes("oklab")
      ) {
        el.style.backgroundColor = "#ffffff";
      }
      if (
        computedStyle.borderColor.includes("oklch") ||
        computedStyle.borderColor.includes("oklab")
      ) {
        el.style.borderColor = "#e5e7eb";
      }
    }
  });

  return originalStyles;
};

const restoreOriginalStyles = (originalStyles) => {
  originalStyles.forEach((styles, element) => {
    if (styles.color !== undefined) element.style.color = styles.color;
    if (styles.backgroundColor !== undefined)
      element.style.backgroundColor = styles.backgroundColor;
    if (styles.borderColor !== undefined)
      element.style.borderColor = styles.borderColor;
  });
};

// Your enhanced invoice generator
export const generateOrderInvoicePDF = async (orderData) => {
  try {
    const invoiceElement = document.createElement("div");
    invoiceElement.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;
      min-height: 1123px;
      padding: 40px;
      font-family: Arial, sans-serif;
      background-color: white;
      color: black;
      font-size: 14px;
      line-height: 1.4;
      box-sizing: border-box;
    `;

    // Calculate balance due
    const totalAmount = parseFloat(orderData.total_amount);
    const paymentMade =
      orderData.payment_status === "completed" ? totalAmount : 0;
    const balanceDue = totalAmount - paymentMade;

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

    invoiceElement.innerHTML = `
      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div>
          <div style="font-size: 48px; font-weight: bold; letter-spacing: 4px; margin-bottom: 10px; color: black;">
            TE
          </div>
          <div style="font-size: 12px; color: #666; letter-spacing: 2px;">
            TAG ENTERPRISES
          </div>
        </div>

        <div style="text-align: right;">
          <h1 style="font-size: 36px; margin: 0 0 10px 0; font-weight: normal; color: black;">
            Invoice
          </h1>
          <div style="margin-bottom: 20px; color: black;">
            <strong>Invoice# INV-${String(orderData.id).padStart(
              6,
              "0"
            )}</strong>
          </div>
          <div>
            <div style="color: #666; margin-bottom: 5px;">Balance Due</div>
            <div style="font-size: 18px; font-weight: bold; color: black;">
              £${balanceDue.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <!-- Company and Bill To Section -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div style="width: 45%;">
          <div style="font-weight: bold; margin-bottom: 10px; color: black;">
            Tag Enterprises (London) Limited
          </div>
          <div style="color: #666; margin-bottom: 3px;">32 George V Avenue</div>
          <div style="color: #666; margin-bottom: 3px;">Pinner London HA5 5SE</div>
          <div style="color: #666; margin-bottom: 3px;">United Kingdom</div>
        </div>

        <div style="width: 45%;">
          <div style="font-weight: bold; margin-bottom: 10px; color: black;">Bill To</div>
          <div style="font-weight: bold; margin-bottom: 5px; color: black;">
            ${orderData.user.first_name} ${orderData.user.last_name}
          </div>
          <div style="color: #666; margin-bottom: 3px;">${
            orderData.address.description
          }</div>
          <div style="color: #666; margin-bottom: 3px;">${
            orderData.address.building_number
          } ${orderData.address.street_name}</div>
          <div style="color: #666; margin-bottom: 3px;">Apt ${
            orderData.address.apartment_number
          }</div>
          <div style="color: #666; margin-bottom: 3px;">${
            orderData.address.city
          } ${orderData.address.postal_code}</div>
          <div style="color: #666; margin-bottom: 3px;">${orderData.address.country.toUpperCase()}</div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-spacing: 0;">
          <tbody>
            <tr>
              <td style="width: 50%;"></td>
              <td style="text-align: right; padding-bottom: 10px;">
                <div style="margin-bottom: 8px;">
                  <span style="color: #666;">Invoice Date :</span>
                  <span style="margin-left: 40px; font-weight: bold; color: black;">
                    ${formatDate(orderData.created_at)}
                  </span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span style="color: #666;">Terms :</span>
                  <span style="margin-left: 40px; color: black;">Due On Receipt</span>
                </div>
                <div>
                  <span style="color: #666;">Due Date :</span>
                  <span style="margin-left: 40px; font-weight: bold; color: black;">
                    ${formatDate(orderData.created_at)}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #4a4a4a; color: white;">
            <th style="padding: 12px 8px; text-align: left; width: 8%; font-size: 13px; color: white;">#</th>
            <th style="padding: 12px 8px; text-align: left; width: 42%; font-size: 13px; color: white;">Item & Description</th>
            <th style="padding: 12px 8px; text-align: center; width: 15%; font-size: 13px; color: white;">Qty</th>
            <th style="padding: 12px 8px; text-align: center; width: 15%; font-size: 13px; color: white;">Rate</th>
            <th style="padding: 12px 8px; text-align: right; width: 20%; font-size: 13px; color: white;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items
            .map(
              (item, index) => `
            <tr style="border-bottom: ${
              index < orderData.items.length - 1 ? "1px solid #e0e0e0" : "none"
            };">
              <td style="padding: 12px 8px; color: black;">${index + 1}</td>
              <td style="padding: 12px 8px; font-weight: 500; color: black;">
                ${getProductDescription(item)}
              </td>
              <td style="padding: 12px 8px; text-align: center; color: black;">
                <div>${parseFloat(item.quantity).toFixed(2)}</div>
                <div style="font-size: 11px; color: #666;">pcs</div>
              </td>
              <td style="padding: 12px 8px; text-align: center; color: black;">
                ${parseFloat(item.unit_price).toFixed(2)}
              </td>
              <td style="padding: 12px 8px; text-align: right; font-weight: 500; color: black;">
                ${parseFloat(item.total_price).toFixed(2)}
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <!-- Totals Section -->
      <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
        <div style="width: 300px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; color: black;">
            <span>Sub Total</span>
            <span>${parseFloat(orderData.subtotal).toFixed(2)}</span>
          </div>

          ${
            parseFloat(orderData.tax_amount) > 0
              ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; color: black;">
            <span>Tax (${orderData.tax_percent}%)</span>
            <span>${parseFloat(orderData.tax_amount).toFixed(2)}</span>
          </div>
          `
              : ""
          }

          <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; color: black;">
            <span>Shipping charge</span>
            <span>${parseFloat(orderData.shipping_amount).toFixed(2)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px; font-weight: bold; color: black;">
            <span>Total</span>
            <span>£${parseFloat(orderData.total_amount).toFixed(2)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #d32f2f;">
            <span>Payment Made</span>
            <span>(-) ${paymentMade.toFixed(2)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding-top: 10px; border-top: 1px solid #e0e0e0; color: black;">
            <span>Balance Due</span>
            <span>£${balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;

    // Add to DOM temporarily
    document.body.appendChild(invoiceElement);

    // Prepare for html2canvas (handle modern colors)
    const originalStyles = prepareElementForHtml2Canvas(invoiceElement);

    // Generate PDF with enhanced options
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: invoiceElement.scrollWidth,
      height: invoiceElement.scrollHeight,
      ignoreElements: (element) => {
        // Skip elements with problematic styles
        const style = window.getComputedStyle(element);
        return style.display === "none" || style.visibility === "hidden";
      },
    });

    // Restore original styles
    restoreOriginalStyles(originalStyles);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("portrait", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const filename = `invoice-INV-${String(orderData.id).padStart(
      6,
      "0"
    )}-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(filename);

    // Clean up
    document.body.removeChild(invoiceElement);

    console.log("✅ Invoice PDF generated successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error generating invoice PDF:", error);
    return false;
  }
};
