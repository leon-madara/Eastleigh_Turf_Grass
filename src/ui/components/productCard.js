// ui/productCard.js
export function createProductCard(product, onAddToCart) {
    const fmt = (n) => Number.isFinite(n) ? n.toLocaleString() : '0';

    const el = document.createElement('div');
    el.className = 'product-card';
    el.setAttribute('data-product-id', product.id);

    el.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-badges">
        <div class="product-badge">${product.thickness}</div>
        <div class="product-badge price">
          KES <span class="price-amount">${fmt(product.price)}</span>/m²
        </div>
      </div>
    </div>

    <div class="product-content">
      <h3 class="product-title">${product.name}</h3>

      <div class="product-section">
        <h4>Best for</h4>
        <div class="use-cases">
          ${product.useCases.map((u) => `<span class="use-case">${u}</span>`).join('')}
        </div>
      </div>

      <div class="product-section">
        <h4>Key Features:</h4>
        <ul class="features-list">
          ${product.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div class="calculator-section">
        <div class="dimension-inputs">
          <div class="input-group">
            <label>Width (m)</label>
            <input type="number" class="width-input" placeholder="0" min="0" step="0.1" inputmode="decimal" pattern="[0-9]*[.]?[0-9]+" />
          </div>
          <div class="input-group">
            <label>Height (m)</label>
            <input type="number" class="height-input" placeholder="0" min="0" step="0.1" inputmode="decimal" pattern="[0-9]*[.]?[0-9]+" />
          </div>
        </div>

        <button class="calculate-btn">
          <i class="fas fa-calculator"></i>
          Calculate
        </button>

        <div class="calculation-result" style="display:none;">
          <div class="result-row">
            <span class="area-label">Area:</span><span class="area-value">0 m²</span>
          </div>
          <div class="result-row">
            <span class="unit-price-label">Unit Price:</span><span class="unit-price">KES 0/m²</span>
          </div>
          <div class="result-row">
            <span class="total-label">Total:</span><span class="total-price">KES 0</span>
          </div>
        </div>

        <button class="add-to-cart-btn" disabled>
          <i class="fas fa-shopping-cart"></i>
          Add to Cart
        </button>
      </div>
    </div>
  `;

    // Wire calculator
    const widthInput = el.querySelector('.width-input');
    const heightInput = el.querySelector('.height-input');
    const calcBtn = el.querySelector('.calculate-btn');
    const resultDiv = el.querySelector('.calculation-result');
    const addToCartBtn = el.querySelector('.add-to-cart-btn');

    // Auto-calculation and validation functions
    let calculationTimeout = null;

    const validateInputs = () => {
        const w = parseFloat(widthInput.value) || 0;
        const h = parseFloat(heightInput.value) || 0;

        // Clear previous validation states
        widthInput.classList.remove('input-valid', 'input-invalid');
        heightInput.classList.remove('input-valid', 'input-invalid');

        if (w > 0 && h > 0) {
            widthInput.classList.add('input-valid');
            heightInput.classList.add('input-valid');
            return {
                width: w,
                height: h,
                isValid: true
            };
        } else {
            if (w <= 0 && widthInput.value !== '') {
                widthInput.classList.add('input-invalid');
            }
            if (h <= 0 && heightInput.value !== '') {
                heightInput.classList.add('input-invalid');
            }
            return {
                width: w,
                height: h,
                isValid: false
            };
        }
    };

    const performCalculation = () => {
        const {
            width,
            height,
            isValid
        } = validateInputs();

        if (isValid) {
            const area = width * height;
            const total = area * product.price;

            el.querySelector('.area-value').textContent = `${area.toFixed(2)} m²`;
            el.querySelector('.unit-price').textContent = `KES ${fmt(product.price)}/m²`;
            el.querySelector('.total-price').textContent = `KES ${fmt(total)}`;

            resultDiv.style.display = 'block';
            addToCartBtn.disabled = false;

            addToCartBtn.dataset.width = String(width);
            addToCartBtn.dataset.height = String(height);
            addToCartBtn.dataset.area = String(area);
            addToCartBtn.dataset.total = String(total);
        } else {
            resultDiv.style.display = 'none';
            addToCartBtn.disabled = true;
        }
    };

    const debouncedCalculation = () => {
        if (calculationTimeout) {
            clearTimeout(calculationTimeout);
        }
        calculationTimeout = setTimeout(performCalculation, 300);
    };

    const resetCardInputs = () => {
        // Clear inputs
        widthInput.value = '';
        heightInput.value = '';

        // Clear validation states
        widthInput.classList.remove('input-valid', 'input-invalid');
        heightInput.classList.remove('input-valid', 'input-invalid');

        // Hide results
        resultDiv.style.display = 'none';
        addToCartBtn.disabled = true;

        // Clear data attributes
        delete addToCartBtn.dataset.width;
        delete addToCartBtn.dataset.height;
        delete addToCartBtn.dataset.area;
        delete addToCartBtn.dataset.total;

        // Focus back to width input for next calculation
        setTimeout(() => {
            widthInput.focus();
        }, 100);
    };

    // Auto-calculation on blur
    widthInput.addEventListener('blur', debouncedCalculation);
    heightInput.addEventListener('blur', debouncedCalculation);

    // Real-time validation on input
    widthInput.addEventListener('input', (e) => {
        // Ensure only numbers and decimal points are allowed
        const value = e.target.value;
        if (value && !/^\d*\.?\d*$/.test(value)) {
            e.target.value = value.replace(/[^\d.]/g, '');
        }
        validateInputs();
    });

    heightInput.addEventListener('input', (e) => {
        // Ensure only numbers and decimal points are allowed
        const value = e.target.value;
        if (value && !/^\d*\.?\d*$/.test(value)) {
            e.target.value = value.replace(/[^\d.]/g, '');
        }
        validateInputs();
    });

    // Manual calculation button (fallback)
    calcBtn.addEventListener('click', performCalculation);

    // Keyboard shortcuts
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.target === widthInput || e.target === heightInput)) {
            e.preventDefault();
            performCalculation();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            resetCardInputs();
        }
    });

    addToCartBtn.addEventListener('click', () => {
        const width = parseFloat(addToCartBtn.dataset.width || '0');
        const height = parseFloat(addToCartBtn.dataset.height || '0');
        const area = parseFloat(addToCartBtn.dataset.area || '0');
        const total = parseFloat(addToCartBtn.dataset.total || '0');

        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            length: height, // height becomes length
            width: width,
            area: area,
            total: total,
            quantity: 1
        };

        // Use the cart component system
        if (window.CartComponent) {
            window.CartComponent.add(cartItem);
        }

        // Also call the callback for backward compatibility
        if (typeof onAddToCart === 'function') {
            onAddToCart(cartItem);
        }

        // Auto-reset after successful add to cart
        setTimeout(() => {
            resetCardInputs();
        }, 200);
    });

    return el;
}