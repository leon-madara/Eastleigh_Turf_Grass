// Preorders Module - Enhanced functionality for preorder management (fixed)
(() => {
    let products = [];
    let preorderItems = [];
    let nextPreorderId = 1;

    // Local showToast function with fallback
    function showToast(message, type = "success") {
        if (typeof window.showToast === "function") {
            window.showToast(message, type);
        } else if (window.BrokerDashboard?.showToast) {
            window.BrokerDashboard.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Initialize the preorders module
    async function init() {
        await loadProducts();       // ensure products are ready
        updateUI();
    }

    // Load products (place products.json in /public/data/ for production)
    async function loadProducts() {
        try {
            const res = await fetch("/data/products.json"); // move file to public/data/
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            products = await res.json();
        } catch (error) {
            console.error("Failed to load products:", error);
            showToast("Failed to load products", "error");
            products = [];
        }
    }

    // Add a new preorder item
    function addPreorder() {
        const preorder = {
            id: nextPreorderId++,
            productId: "",
            product: null,
            quantity: 1,
            unitPrice: 0,
            total: 0,
            expectedDate: "",
            specialNotes: ""
        };

        preorderItems.push(preorder);
        updateUI();
        showToast("Preorder item added", "success");

        if (window.BrokerDashboard?.updateCartCount) {
            window.BrokerDashboard.updateCartCount(getItemCount());
        }
    }

    // Remove a preorder item
    function removePreorder(preorderId) {
        preorderItems = preorderItems.filter((p) => p.id !== preorderId);
        updateUI();
        showToast("Preorder item removed", "success");

        if (window.BrokerDashboard?.updateCartCount) {
            window.BrokerDashboard.updateCartCount(getItemCount());
        }
    }

    // Update preorder details
    function updatePreorder(preorderId, field, value) {
        const preorder = preorderItems.find((p) => p.id === preorderId);
        if (!preorder) return;

        if (field === "productId") {
            const product = products.find((p) => String(p.id) === String(value));
            preorder.productId = value;
            preorder.product = product || null;
            preorder.unitPrice = product ? Number(product.price) || 0 : 0;
            preorder.total = preorder.unitPrice * (Number(preorder.quantity) || 0);
        } else if (field === "quantity") {
            const parsed =
                window.numberFormatter?.parseFormattedNumber?.(value) ??
                parseFloat(String(value)) ??
                0;
            preorder.quantity = isNaN(parsed) ? 0 : parsed;
            preorder.total = preorder.unitPrice * preorder.quantity;
        } else if (field === "expectedDate") {
            preorder.expectedDate = value;
        } else if (field === "specialNotes") {
            preorder.specialNotes = value;
        }

        updateUI();
    }

    // Calculate preorder total
    function calculateTotal() {
        return preorderItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    }

    // Generate preorder message for WhatsApp
    function generatePreorderMessage(preorderData) {
        const { brokerName, brokerEmail, items, expectedDate, specialNotes, total } =
            preorderData;

        const itemsList = items
            .map((item) => {
                const name = item.product?.name ?? "Unknown";
                const thickness = item.product?.thickness ?? "";
                return `• ${name} (${thickness})
  Quantity: ${item.quantity} m²
  Unit Price: KES ${Number(item.unitPrice).toLocaleString()}
  Total: KES ${Number(item.total).toLocaleString()}`;
            })
            .join("\n\n");

        return `*BROKER PREORDER SUBMISSION - Eastleigh Turf Grass*

*Broker Details:*
• Name: ${brokerName}
• Email: ${brokerEmail}

*Preorder Items:*
${itemsList}

*Preorder Details:*
• Expected Date: ${expectedDate || "Not specified"}
• Special Notes: ${specialNotes || "None"}
• Total Amount: KES ${Number(total).toLocaleString()}

*Submitted:* ${new Date().toLocaleString("en-KE")}`;
    }

    // Update the UI
    function updateUI() {
        const tableBody = document.getElementById("preorderTableBody");
        const emptyState = document.getElementById("emptyPreorderState");
        const preorderTotal = document.getElementById("preorderTotal");
        const submitBtn = document.getElementById("submitPreordersBtn");

        if (!tableBody || !emptyState || !preorderTotal || !submitBtn) return;

        if (preorderItems.length === 0) {
            tableBody.innerHTML = "";
            emptyState.style.display = "block";
            submitBtn.disabled = true;
        } else {
            emptyState.style.display = "none";
            submitBtn.disabled = false;

            tableBody.innerHTML = preorderItems.map((p) => createPreorderRow(p)).join("");

            // bind fresh listeners
            preorderItems.forEach((p) => {
                const productSelect = document.getElementById(`preorder-product-${p.id}`);
                const quantityInput = document.getElementById(`preorder-quantity-${p.id}`);
                const dateInput = document.getElementById(`preorder-date-${p.id}`);
                const notesInput = document.getElementById(`preorder-notes-${p.id}`);
                const deleteBtn = document.getElementById(`delete-preorder-${p.id}`);

                productSelect?.addEventListener("change", (e) =>
                    updatePreorder(p.id, "productId", e.target.value)
                );

                if (quantityInput) {
                    quantityInput.addEventListener("input", (e) =>
                        updatePreorder(p.id, "quantity", e.target.value)
                    );

                    // optional number formatter
                    if (window.numberFormatter?.initInputFormatting) {
                        window.numberFormatter.initInputFormatting(quantityInput, {
                            allowDecimals: true,
                            decimalPlaces: 1,
                            currency: "KES"
                        });
                    } else {
                        const iv = setInterval(() => {
                            if (window.numberFormatter?.initInputFormatting) {
                                window.numberFormatter.initInputFormatting(quantityInput, {
                                    allowDecimals: true,
                                    decimalPlaces: 1,
                                    currency: "KES"
                                });
                                clearInterval(iv);
                            }
                        }, 100);
                    }
                }

                dateInput?.addEventListener("change", (e) =>
                    updatePreorder(p.id, "expectedDate", e.target.value)
                );
                notesInput?.addEventListener("input", (e) =>
                    updatePreorder(p.id, "specialNotes", e.target.value)
                );
                deleteBtn?.addEventListener("click", () => removePreorder(p.id));
            });
        }

        // Update total
        const total = calculateTotal();
        preorderTotal.textContent = Number(total).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Create preorder row HTML
    function createPreorderRow(preorder) {
        const productOptions = products
            .map(
                (product) => `
          <option value="${product.id}" ${String(preorder.productId) === String(product.id) ? "selected" : ""
                    }>
            ${product.name} (${product.thickness})
          </option>`
            )
            .join("");

        return `
      <tr>
        <td>
          <div class="order-field">
            <label for="preorder-product-${preorder.id}">Product Name</label>
            <select class="table-select" id="preorder-product-${preorder.id}">
              <option value="">Select a product</option>
              ${productOptions}
            </select>
          </div>
        </td>
        <td>
          <div class="order-field">
            <label for="preorder-quantity-${preorder.id}">Quantity (m²)</label>
            <input type="number" inputmode="decimal" class="table-input" id="preorder-quantity-${preorder.id}"
                   value="${preorder.quantity}" min="0.1" step="0.1" placeholder="0">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label>Unit Price (KES)</label>
            <input type="text" class="table-input" readonly value="${Number(
            preorder.unitPrice
        ).toLocaleString("en-US")}">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label for="preorder-date-${preorder.id}">Expected Date</label>
            <input type="date" class="table-input" id="preorder-date-${preorder.id}"
                   value="${preorder.expectedDate || ""}" placeholder="Expected date">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label for="preorder-notes-${preorder.id}">Special Notes</label>
            <input type="text" class="table-input" id="preorder-notes-${preorder.id}"
                   value="${preorder.specialNotes || ""}" placeholder="Special notes">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label>Total (KES)</label>
            <strong>${Number(preorder.total).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</strong>
          </div>
        </td>
        <td>
          <div class="order-field">
            <label>Action</label>
            <button class="delete-btn" id="delete-preorder-${preorder.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>`;
    }

    // Submit preorders
    async function submitPreorders() {
        if (preorderItems.length === 0) {
            showToast("No preorder items to submit", "error");
            return;
        }

        const invalidItems = preorderItems.filter(
            (item) => !item.productId || Number(item.quantity) <= 0
        );
        if (invalidItems.length > 0) {
            showToast("Please complete all preorder items before submitting", "error");
            return;
        }

        try {
            const preorderData = {
                brokerName: "Broker User", // TODO: make dynamic
                brokerEmail: "broker@eastleighturf.com", // TODO: make dynamic
                items: preorderItems.map((item) => ({
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.total
                })),
                expectedDate: preorderItems[0]?.expectedDate || "Not specified",
                specialNotes: preorderItems[0]?.specialNotes || "None",
                total: calculateTotal()
            };

            let success = false;

            if (window.WhatsAppService?.sendPreorderForm) {
                const maybe = window.WhatsAppService.sendPreorderForm(preorderData);
                success = typeof maybe?.then === "function" ? await maybe : !!maybe;
            } else {
                const message = generatePreorderMessage(preorderData);
                const whatsappNumber = "254743375997";
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                window.open(whatsappUrl, "_blank");
                success = true;
            }

            if (success) {
                showToast(
                    "Preorders submitted successfully! WhatsApp will open with your preorder details.",
                    "success"
                );
                preorderItems = [];
                nextPreorderId = 1;
                updateUI();
                if (window.BrokerDashboard?.updateCartCount) {
                    window.BrokerDashboard.updateCartCount(getItemCount());
                }
            } else {
                showToast("Failed to send preorders. Please try again.", "error");
            }
        } catch (error) {
            console.error("Preorder submission error:", error);
            showToast("An error occurred while submitting the preorders.", "error");
        }
    }

    // Get item count for cart
    function getItemCount() {
        return preorderItems.length;
    }

    // Initialize event listeners
    function initEventListeners() {
        document.getElementById("addPreorderBtn")?.addEventListener("click", addPreorder);
        document.getElementById("submitPreordersBtn")?.addEventListener("click", submitPreorders);
    }

    // Expose module functions
    window.PreordersModule = {
        init,
        addPreorder,
        removePreorder,
        updatePreorder,
        submitPreorders,
        getItemCount
    };

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            init();
            initEventListeners();
        });
    } else {
        init();
        initEventListeners();
    }
})();
