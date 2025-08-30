import"./toast.0b5c6fe0.js";import{_ as y}from"./cart.437f89c5.js";import{c as S,d as C}from"./discountService.775b2253.js";/* empty css              *//* empty css                 */import"./toastService.c0f79566.js";const _=(()=>{let t=[],c=null,r=null,n=[];function l(){return[...t]}function d(a){const i=Date.now();t.push({id:i,...a}),u()}function E(a){t=t.filter(i=>i.id!==a),u()}function h(){t=[],c=null,r=null,u()}function o(){return t.reduce((a,i)=>a+i.total,0)}function g(a){const i=o(),p=S.applyCoupon(a,i);return p.valid&&(c=p.coupon,r=null,S.incrementCouponUsage(a)),u(),p}function f(a){const i=o(),p=C.applyPromotion(a,i);return p.valid&&(r=p.promotion,c=null),u(),p}function b(){c=null,r=null,u()}function v(){const a=o();let i=0;return c?i=S.calculateCouponDiscount(c,a):r&&(i=C.calculatePromotionDiscount(r,a)),i}function w(){const a=o(),i=v();return a-i}function e(){const a=o();return C.getAvailablePromotions(a)}function s(){const a=o();return C.getBestPromotion(a)}function u(){const a=o(),i=v(),p=w();n.forEach(L=>{try{L({items:l(),subtotal:a,discountAmount:i,total:p,appliedCoupon:c,appliedPromotion:r})}catch(P){console.error("Cart subscriber error:",P)}}),window.renderCartUI&&window.renderCartUI(l(),p,i)}function m(a){return n.push(a),()=>{const i=n.indexOf(a);i>-1&&n.splice(i,1)}}return{getItems:l,add:d,remove:E,clear:h,getSubtotal:o,applyCoupon:g,applyPromotion:f,removeDiscount:b,getDiscountAmount:v,getTotal:w,getAvailablePromotions:e,getBestPromotion:s,subscribe:m}})();function D(t,c){const r=e=>Number.isFinite(e)?e.toLocaleString():"0",n=document.createElement("div");n.className="product-card",n.setAttribute("data-product-id",t.id),n.innerHTML=`
    <div class="product-image">
      <img src="${t.image}" alt="${t.name}" />
      <div class="product-badges">
        <div class="product-badge">${t.thickness}</div>
        <div class="product-badge price">
          KES <span class="price-amount">${r(t.price)}</span>/m²
        </div>
      </div>
    </div>

    <div class="product-content">
      <h3 class="product-title">${t.name}</h3>

      <div class="product-section">
        <h4>Best for</h4>
        <div class="use-cases">
          ${t.useCases.map(e=>`<span class="use-case">${e}</span>`).join("")}
        </div>
      </div>

      <div class="product-section">
        <h4>Key Features:</h4>
        <ul class="features-list">
          ${t.features.map(e=>`<li>${e}</li>`).join("")}
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
  `;const l=n.querySelector(".width-input"),d=n.querySelector(".height-input"),E=n.querySelector(".calculate-btn"),h=n.querySelector(".calculation-result"),o=n.querySelector(".add-to-cart-btn");let g=null;const f=()=>{const e=parseFloat(l.value)||0,s=parseFloat(d.value)||0;return l.classList.remove("input-valid","input-invalid"),d.classList.remove("input-valid","input-invalid"),e>0&&s>0?(l.classList.add("input-valid"),d.classList.add("input-valid"),{width:e,height:s,isValid:!0}):(e<=0&&l.value!==""&&l.classList.add("input-invalid"),s<=0&&d.value!==""&&d.classList.add("input-invalid"),{width:e,height:s,isValid:!1})},b=()=>{const{width:e,height:s,isValid:u}=f();if(u){const m=e*s,a=m*t.price;n.querySelector(".area-value").textContent=`${m.toFixed(2)} m²`,n.querySelector(".unit-price").textContent=`KES ${r(t.price)}/m²`,n.querySelector(".total-price").textContent=`KES ${r(a)}`,h.style.display="block",o.disabled=!1,o.dataset.width=String(e),o.dataset.height=String(s),o.dataset.area=String(m),o.dataset.total=String(a)}else h.style.display="none",o.disabled=!0},v=()=>{g&&clearTimeout(g),g=setTimeout(b,300)},w=()=>{l.value="",d.value="",l.classList.remove("input-valid","input-invalid"),d.classList.remove("input-valid","input-invalid"),h.style.display="none",o.disabled=!0,delete o.dataset.width,delete o.dataset.height,delete o.dataset.area,delete o.dataset.total,setTimeout(()=>{l.focus()},100)};return l.addEventListener("blur",v),d.addEventListener("blur",v),l.addEventListener("input",e=>{const s=e.target.value;s&&!/^\d*\.?\d*$/.test(s)&&(e.target.value=s.replace(/[^\d.]/g,"")),f()}),d.addEventListener("input",e=>{const s=e.target.value;s&&!/^\d*\.?\d*$/.test(s)&&(e.target.value=s.replace(/[^\d.]/g,"")),f()}),E.addEventListener("click",b),n.addEventListener("keydown",e=>{e.key==="Enter"&&(e.target===l||e.target===d)?(e.preventDefault(),b()):e.key==="Escape"&&(e.preventDefault(),w())}),o.addEventListener("click",()=>{const e=parseFloat(o.dataset.width||"0"),s=parseFloat(o.dataset.height||"0"),u=parseFloat(o.dataset.area||"0"),m=parseFloat(o.dataset.total||"0"),a={id:t.id,name:t.name,image:t.image,price:t.price,length:s,width:e,area:u,total:m,quantity:1};window.CartComponent&&window.CartComponent.add(a),typeof c=="function"&&c(a),setTimeout(()=>{w()},200)}),n}window.CartState=_;Promise.allSettled([y(()=>import("./checkoutModal.87881386.js"),[]).then(t=>{window.checkoutModal=t.checkoutModal,console.log("Checkout modal loaded")}).catch(t=>console.warn("Checkout modal not available:",t)),y(()=>import("./discountModal.a8fef9ff.js"),[]).then(t=>{window.discountModal=t.discountModal,console.log("Discount modal loaded")}).catch(t=>console.warn("Discount modal not available:",t)),y(()=>import("./couponModal.03c8ebad.js"),[]).then(t=>{window.couponModal=t.couponModal,console.log("Coupon modal loaded")}).catch(t=>console.warn("Coupon modal not available:",t)),y(()=>import("./BrokerLoginModal.594b1f0b.js"),[]).then(()=>{console.log("Broker login modal loaded")}).catch(t=>console.warn("Broker login modal not available:",t))]);document.addEventListener("DOMContentLoaded",async()=>{console.log("Products page loaded");const t=document.getElementById("productsGrid");if(!t){console.error("Products grid not found!");return}console.log("Products grid found, loading products...");try{const c=await fetch("/src/data/products.json",{cache:"no-cache"});if(!c.ok)throw new Error(`HTTP error! status: ${c.status}`);const r=await c.json();console.log("Products loaded:",r.length,"products"),r.forEach(n=>{const l=D(n);t.appendChild(l)}),console.log("Product cards added to grid"),window.location.hash==="#cart"&&setTimeout(()=>{const n=document.getElementById("cart");n&&n.scrollIntoView({behavior:"smooth",block:"start"})},500)}catch(c){console.error("Error loading products:",c)}});
//# sourceMappingURL=products.e666bbbf.js.map
