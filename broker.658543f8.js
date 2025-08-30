import"./toast.0b5c6fe0.js";import{_ as j}from"./cart.437f89c5.js";import"./cartIconPopUp.54af95f0.js";import"./toastService.c0f79566.js";class re{constructor(){this.isFormatting=!1}initInputFormatting(e,o={}){if(!e){console.warn("NumberFormatter: No input element provided");return}console.log("NumberFormatter: Initializing formatting for input:",e.id||e.name);const r={allowDecimals:!0,decimalPlaces:2,currency:"KES",...o};e._numberFormatterConfig=r,e.addEventListener("input",i=>{this.handleInputFormatting(i)}),e.addEventListener("keydown",i=>{this.handleKeyDown(i)}),e.addEventListener("blur",i=>{this.handleInputBlur(i)}),e.setAttribute("inputmode","decimal"),console.log("NumberFormatter: Formatting initialized successfully for:",e.id||e.name)}handleInputFormatting(e){if(this.isFormatting)return;const o=e.target,r=o._numberFormatterConfig||{},i=o.selectionStart||0,d=o.value;console.log("NumberFormatter: Input event triggered for:",o.id||o.name,"Value:",d);const u=this.countDigitsBeforePosition(d,i);let c=d.replace(/[^\d.]/g,"");if(r.allowDecimals){const y=c.indexOf(".");y!==-1&&(c=c.substring(0,y+1)+c.substring(y+1).replace(/\./g,""))}else c=c.replace(/\./g,"");const b=this.formatNumberWithCommas(c,r);this.isFormatting=!0,o.value=b,this.isFormatting=!1;const f=this.getPositionAfterDigits(b,u);setTimeout(()=>{o.setSelectionRange(f,f)},0)}handleKeyDown(e){e.key==="Enter"&&(e.preventDefault(),e.target.blur())}handleInputBlur(e){const o=e.target,r=o._numberFormatterConfig||{};r.allowDecimals&&this.ensureProperDecimalFormatting(o,r);const i=new CustomEvent("numberFormatted",{detail:{input:o,value:o.value,numericValue:this.parseFormattedNumber(o.value)}});o.dispatchEvent(i)}countDigitsBeforePosition(e,o){let r=0;for(let i=0;i<Math.min(o,e.length);i++)/\d/.test(e[i])&&r++;return r}getPositionAfterDigits(e,o){let r=0,i=0;for(let d=0;d<e.length;d++){if(/\d/.test(e[d])&&(r++,r===o)){i=d+1;break}r<o&&(i=d+1)}return Math.min(i,e.length)}formatNumberWithCommas(e,o={}){if(!e)return"";const{allowDecimals:r=!0,decimalPlaces:i=2}=o;if(r){const d=e.split(".");return d[0]=d[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),d.length>1&&(d[1]=d[1].substring(0,i)),d.join(".")}else return e.replace(/\B(?=(\d{3})+(?!\d))/g,",")}ensureProperDecimalFormatting(e,o={}){const r=e.value,i=this.parseFormattedNumber(r);if(i>0){const d=this.formatCurrency(i,o);e.value=d}}parseFormattedNumber(e){return e&&parseFloat(e.replace(/,/g,""))||0}formatCurrency(e,o={}){const{decimalPlaces:r=2}=o;return e.toLocaleString("en-US",{minimumFractionDigits:r,maximumFractionDigits:r})}formatCurrencyDisplay(e,o={}){const{currency:r="KES"}=o,i=this.formatCurrency(e,o);return`${r} ${i}`}}window.numberFormatter=new re;window.initNumberFormatting=function(s,e={}){window.numberFormatter?window.numberFormatter.initInputFormatting(s,e):console.warn("Number formatter not available")};document.addEventListener("DOMContentLoaded",function(){ie(),be()});function ie(){se(),le(),de()}function se(){const s=document.querySelectorAll(".nav-tab"),e=document.querySelectorAll(".tab-content");s.forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-tab");s.forEach(i=>i.classList.remove("active")),e.forEach(i=>i.classList.remove("active")),o.classList.add("active"),document.getElementById(`${r}-content`).classList.add("active")})})}function le(){const s=document.getElementById("addItemBtn");s&&s.addEventListener("click",ue);const e=document.getElementById("submitOrderBtn");e&&e.addEventListener("click",me);const o=document.getElementById("addPreorderBtn");o&&o.addEventListener("click",pe);const r=document.getElementById("submitPreordersBtn");r&&r.addEventListener("click",ge);const i=document.getElementById("addInquiryBtn");i&&i.addEventListener("click",fe);const d=document.getElementById("submitInquiriesBtn");d&&d.addEventListener("click",ye);const u=document.getElementById("logoutBtn");u&&u.addEventListener("click",Q)}function de(){const s=localStorage.getItem("authState");if(s)try{const e=JSON.parse(s);e.loggedIn&&e.user&&ce(e.user)}catch(e){console.error("Error parsing auth state:",e)}H()}function H(){const s=document.getElementById("cartCount");if(!s)return;let e=0;window.OrdersModule&&(e+=window.OrdersModule.getItemCount()),window.PreordersModule&&(e+=window.PreordersModule.getItemCount()),window.InquiryModule&&(e+=window.InquiryModule.getItemCount()),s.textContent=e,e>0?s.style.display="block":s.style.display="none"}function ce(s){const e=document.getElementById("broker-name"),o=document.getElementById("broker-email");e&&(e.value=s.username||"Broker User"),o&&(o.value=s.email||"broker@eastleighturf.com")}function ue(){window.OrdersModule&&window.OrdersModule.addItem()}function me(){window.OrdersModule&&window.OrdersModule.submitOrder()}function pe(){window.PreordersModule&&window.PreordersModule.addPreorder()}function ge(){window.PreordersModule&&window.PreordersModule.submitPreorders()}function fe(){window.InquiryModule&&window.InquiryModule.addInquiry()}function ye(){window.InquiryModule&&window.InquiryModule.submitInquiries()}function Q(){localStorage.removeItem("authState"),localStorage.removeItem("brokerInfo"),O("Logging out...","success"),window.location.href="/index.html"}function O(s,e="success"){const o=document.getElementById("toast"),r=o.querySelector(".toast-message"),i=o.querySelector(".toast-icon i");r.textContent=s,e==="success"?(i.className="fas fa-check-circle",o.className="toast success"):e==="error"?(i.className="fas fa-exclamation-circle",o.className="toast error"):e==="info"&&(i.className="fas fa-info-circle",o.className="toast info"),o.classList.remove("hidden"),setTimeout(()=>{N()},4e3)}function N(){document.getElementById("toast").classList.add("hidden")}function be(){setTimeout(()=>{O(`Login Successful
Welcome to your broker dashboard.`,"success")},500)}window.BrokerDashboard={showToast:O,hideToast:N,handleLogout:Q,updateCartCount:H};document.addEventListener("click",function(s){s.target.classList.contains("toast-close")&&N()});class he{constructor(){this.elements={orderTotalSpan:document.getElementById("orderTotal"),amountToPayInput:document.getElementById("amount-to-pay-input"),creditBalanceSpan:document.getElementById("credit-balance")},this.initialize()}initialize(){if(console.log("PaymentSummaryHandler: Initializing..."),!this.areElementsValid()){console.warn("Payment summary elements not found");return}console.log("PaymentSummaryHandler: Elements found, setting up event listeners..."),this.setupEventListeners(),this.updateCreditBalance(),console.log("PaymentSummaryHandler: Initialization complete")}areElementsValid(){const{orderTotalSpan:e,amountToPayInput:o,creditBalanceSpan:r}=this.elements;return!!(e&&o&&r)}setupEventListeners(){const{amountToPayInput:e}=this.elements;e&&(this.initializeNumberFormatting(),e.addEventListener("numberFormatted",()=>{this.updateCreditBalance()}),e.addEventListener("blur",()=>{this.updateCreditBalance()}),e.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),e.blur())}))}initializeNumberFormatting(){const{amountToPayInput:e}=this.elements;if(console.log("PaymentSummaryHandler: Initializing number formatting..."),console.log("PaymentSummaryHandler: numberFormatter available?",!!window.numberFormatter),window.numberFormatter)console.log("PaymentSummaryHandler: Using number formatter"),window.numberFormatter.initInputFormatting(e,{allowDecimals:!0,decimalPlaces:2,currency:"KES"});else{console.log("PaymentSummaryHandler: Waiting for number formatter...");const o=setInterval(()=>{window.numberFormatter&&(console.log("PaymentSummaryHandler: Number formatter now available, initializing..."),window.numberFormatter.initInputFormatting(e,{allowDecimals:!0,decimalPlaces:2,currency:"KES"}),clearInterval(o))},100)}}updateCreditBalance(){const{orderTotalSpan:e,amountToPayInput:o,creditBalanceSpan:r}=this.elements;if(!e||!o||!r){console.warn("Cannot update credit balance: missing elements");return}const i=window.numberFormatter?window.numberFormatter.parseFormattedNumber(e.textContent||""):0,d=window.numberFormatter?window.numberFormatter.parseFormattedNumber(o.value):0,u=Math.max(0,i-d);r.textContent=window.numberFormatter?window.numberFormatter.formatCurrency(u):u.toFixed(2)}}function _(){window.paymentSummaryHandler=new he}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();(()=>{let s=[],e=[],o=1,r=null,i=[],d=[],u=null,c=null;async function b(){await f(),await y(),await E(),g(),$(),S()}async function f(){try{s=await(await fetch("/src/data/products.json")).json(),console.log("Products loaded:",s.length,"products")}catch(t){console.error("Failed to load products:",t),h("Failed to load products","error")}}async function y(){try{i=(await(await fetch("/src/data/discounts.json")).json()).promotions.filter(n=>n.active),console.log("Discounts loaded:",i.length,"active discounts")}catch(t){console.error("Failed to load discounts:",t),i=[]}}async function E(){try{d=(await(await fetch("/src/data/coupons.json")).json()).coupons.filter(n=>n.usedCount<n.usageLimit&&new Date>=new Date(n.validFrom)&&new Date<=new Date(n.validTo)),console.log("Coupons loaded:",d.length,"available coupons")}catch(t){console.error("Failed to load coupons:",t),d=[]}}function g(){const t=localStorage.getItem("brokerInfo");t?r=JSON.parse(t):r={id:"BROKER001",name:"Broker User",email:"broker@eastleighturf.com",phone:"+254700000000"}}function S(){const t=document.getElementById("addItemBtn"),a=document.getElementById("submitOrderBtn");t&&t.addEventListener("click",K),a&&a.addEventListener("click",W)}function K(){z();const t=document.getElementById("addItemModal");t&&(t.style.display="flex",P())}function z(){const t=document.getElementById("addItemModal");t&&t.remove();const a=`
            <div id="addItemModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Add Order Item</h2>
                        <button class="modal-close" id="closeAddItemModal" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addItemForm">
                            <div class="form-group">
                                <label for="modalProduct">Product *</label>
                                <select id="modalProduct" required>
                                    <option value="">Select a product</option>
                                    ${s.map(n=>`<option value="${n.id}">${n.name} (${n.thickness})</option>`).join("")}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="modalQuantity">Quantity (m²) *</label>
                                <input type="number" id="modalQuantity" min="0.1" step="0.1" required placeholder="Enter quantity">
                            </div>

                            <div class="form-group">
                                <label>Unit Price (KES)</label>
                                <input type="text" id="modalUnitPrice" readonly value="0">
                            </div>

                            <div class="form-group">
                                <label>Subtotal (KES)</label>
                                <input type="text" id="modalSubtotal" readonly value="0">
                            </div>

                            <div class="discount-section">
                                <h3>Discounts & Coupons</h3>
                                
                                <div class="form-group">
                                    <label for="modalDiscount">Available Discounts</label>
                                    <select id="modalDiscount" disabled>
                                        <option value="">No discount</option>
                                        ${i.map(n=>`<option value="${n.id}">${n.name} - ${n.description}</option>`).join("")}
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="modalCoupon">Coupon Code</label>
                                    <div class="coupon-input-group">
                                        <input type="text" id="modalCoupon" placeholder="Enter coupon code" disabled>
                                        <button type="button" id="applyCouponBtn" disabled>Apply</button>
                                    </div>
                                </div>

                                <div class="discount-summary" id="discountSummary" style="display: none;">
                                    <div class="summary-row">
                                        <span>Subtotal:</span>
                                        <span id="summarySubtotal">KES 0</span>
                                    </div>
                                    <div class="summary-row discount-row" id="discountRow" style="display: none;">
                                        <span>Discount:</span>
                                        <span id="summaryDiscount">-KES 0</span>
                                    </div>
                                    <div class="summary-row coupon-row" id="couponRow" style="display: none;">
                                        <span>Coupon:</span>
                                        <span id="summaryCoupon">-KES 0</span>
                                    </div>
                                    <div class="summary-row final-total">
                                        <span>Final Total:</span>
                                        <span id="summaryFinalTotal">KES 0</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelAddItem">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmAddItem" disabled>Add to Order</button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",a),V()}function V(){const t=document.getElementById("addItemModal"),a=document.getElementById("closeAddItemModal"),n=document.getElementById("cancelAddItem"),l=document.getElementById("confirmAddItem"),m=document.getElementById("modalProduct"),p=document.getElementById("modalQuantity"),w=document.getElementById("applyCouponBtn");if(a&&a.addEventListener("click",C),n&&n.addEventListener("click",C),l&&l.addEventListener("click",Z),m&&m.addEventListener("change",J),p)if(p.addEventListener("input",G),window.numberFormatter)window.numberFormatter.initInputFormatting(p,{allowDecimals:!0,decimalPlaces:1,currency:"KES"});else{const D=setInterval(()=>{window.numberFormatter&&(window.numberFormatter.initInputFormatting(p,{allowDecimals:!0,decimalPlaces:1,currency:"KES"}),clearInterval(D))},100)}w&&w.addEventListener("click",X),t&&t.addEventListener("click",D=>{D.target===t&&C()})}function J(){const t=document.getElementById("modalProduct");document.getElementById("modalQuantity");const a=document.getElementById("modalUnitPrice"),n=document.getElementById("modalSubtotal");if(t&&t.value){const l=s.find(m=>m.id===t.value);l&&(a.value=l.price.toLocaleString("en-US"),A(),x())}else a.value="0",n.value="0",P()}function G(){A(),x()}function A(){const t=document.getElementById("modalProduct"),a=document.getElementById("modalQuantity"),n=document.getElementById("modalSubtotal");if(t&&t.value&&a&&a.value){const l=s.find(w=>w.id===t.value),m=window.numberFormatter?window.numberFormatter.parseFormattedNumber(a.value):parseFloat(a.value)||0,p=l.price*m;n.value=window.numberFormatter?window.numberFormatter.formatCurrency(p):p.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),F()}else n.value="0"}function x(){const t=document.getElementById("modalProduct"),a=document.getElementById("modalQuantity");document.getElementById("modalDiscount"),document.getElementById("modalCoupon"),document.getElementById("applyCouponBtn");const n=document.getElementById("confirmAddItem"),l=t&&t.value,m=a&&a.value&&(window.numberFormatter?window.numberFormatter.parseFormattedNumber(a.value):parseFloat(a.value))>0;l&&m?(Y(),n&&(n.disabled=!1)):(P(),n&&(n.disabled=!0))}function Y(){const t=document.getElementById("modalDiscount"),a=document.getElementById("modalCoupon"),n=document.getElementById("applyCouponBtn");t&&(t.disabled=!1),a&&(a.disabled=!1),n&&(n.disabled=!1),t&&t.addEventListener("change",F)}function P(){const t=document.getElementById("modalDiscount"),a=document.getElementById("modalCoupon"),n=document.getElementById("applyCouponBtn");t&&(t.disabled=!0,t.value=""),a&&(a.disabled=!0,a.value=""),n&&(n.disabled=!0),u=null,c=null,F()}function X(){const a=document.getElementById("modalCoupon").value.trim().toUpperCase();if(!a){h("Please enter a coupon code","error");return}const n=d.find(m=>m.code===a);if(!n){h("Invalid coupon code","error");return}if(L()<n.minOrder){h(`Minimum order amount for this coupon is KES ${n.minOrder.toLocaleString()}`,"error");return}c=n,h(`Coupon ${n.code} applied successfully!`,"success"),F()}function F(){const t=L(),a=document.getElementById("discountSummary"),n=document.getElementById("summarySubtotal"),l=document.getElementById("discountRow"),m=document.getElementById("summaryDiscount"),p=document.getElementById("couponRow"),w=document.getElementById("summaryCoupon"),D=document.getElementById("summaryFinalTotal");if(!a)return;n.textContent=`KES ${t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;let T=t,v=0,B=0;const M=document.getElementById("modalDiscount");if(M&&M.value){const I=i.find(ae=>ae.id===M.value);I&&t>=I.minOrder&&(I.type==="percentage"?(v=t*I.value/100,I.maxDiscount&&(v=Math.min(v,I.maxDiscount))):v=I.value,T-=v,u=I)}c&&(c.type==="percentage"?(B=t*c.value/100,c.maxDiscount&&(B=Math.min(B,c.maxDiscount))):B=c.value,T-=B),v>0?(l.style.display="flex",m.textContent=`-KES ${v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`):l.style.display="none",B>0?(p.style.display="flex",w.textContent=`-KES ${B.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`):p.style.display="none",D.textContent=`KES ${T.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,a.style.display="block"}function L(){const t=document.getElementById("modalProduct"),a=document.getElementById("modalQuantity");if(t&&t.value&&a&&a.value){const n=s.find(m=>m.id===t.value),l=parseFloat(a.value)||0;return n.price*l}return 0}function Z(){const t=document.getElementById("modalProduct"),a=document.getElementById("modalQuantity");if(!t.value||!a.value){h("Please select a product and enter quantity","error");return}const n=s.find(w=>w.id===t.value),l=parseFloat(a.value),m=L(),p={id:o++,productId:n.id,product:n,quantity:l,unitPrice:n.price,subtotal:m,discount:u,coupon:c,finalTotal:m-(u?q(m,u):0)-(c?U(m,c):0)};e.push(p),C(),$(),h("Item added to order","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function q(t,a){if(a.type==="percentage"){let n=t*a.value/100;return a.maxDiscount&&(n=Math.min(n,a.maxDiscount)),n}return a.value}function U(t,a){if(a.type==="percentage"){let n=t*a.value/100;return a.maxDiscount&&(n=Math.min(n,a.maxDiscount)),n}return a.value}function C(){const t=document.getElementById("addItemModal");t&&t.remove(),u=null,c=null}function R(t){e=e.filter(a=>a.id!==t),$(),h("Item removed from order","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function k(){return e.reduce((t,a)=>t+a.finalTotal,0)}function $(){const t=document.getElementById("orderTableBody"),a=document.getElementById("emptyOrderState"),n=document.getElementById("orderTotal"),l=document.getElementById("submitOrderBtn");if(!t||!a||!n||!l)return;e.length===0?(t.innerHTML="",a.style.display="block",l.disabled=!0):(a.style.display="none",l.disabled=!1,t.innerHTML=e.map(p=>ee(p)).join(""),e.forEach(p=>{const w=document.getElementById(`delete-${p.id}`);w&&w.addEventListener("click",()=>{R(p.id)})}));const m=k();n.textContent=m.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),window.paymentSummaryHandler&&window.paymentSummaryHandler.updateCreditBalance&&window.paymentSummaryHandler.updateCreditBalance()}function ee(t){const a=t.discount?`${t.discount.name} (-${t.discount.value}%)`:"",n=t.coupon?`${t.coupon.code} (-${t.coupon.value}${t.coupon.type==="percentage"?"%":" KES"})`:"";return`
            <tr>
                <td>
                    <div class="order-field">
                        <label>Product Name</label>
                        <strong>${t.product.name} (${t.product.thickness})</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Quantity (m²)</label>
                        <strong>${t.quantity}</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Unit Price (KES)</label>
                        <strong>${t.unitPrice.toLocaleString("en-US")}</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Subtotal (KES)</label>
                        <strong>${t.subtotal.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Final Total (KES)</label>
                        <strong>${t.finalTotal.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                        ${a||n?`<br><small class="discount-info">${a}${a&&n?", ":""}${n}</small>`:""}
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Action</label>
                        <button class="delete-btn" id="delete-${t.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `}function W(){if(e.length===0){h("No items in order","error");return}const t={brokerId:r.id,brokerName:r.name,brokerEmail:r.email,brokerPhone:r.phone,items:e,total:k(),subtotal:e.reduce((a,n)=>a+n.subtotal,0),totalDiscount:e.reduce((a,n)=>{let l=0;return n.discount&&(l+=q(n.subtotal,n.discount)),n.coupon&&(l+=U(n.subtotal,n.coupon)),a+l},0),orderDate:new Date().toISOString()};te(t)}function te(t){const a=ne(t);if(window.WhatsAppService&&window.WhatsAppService.sendToWhatsApp)window.WhatsAppService.sendToWhatsApp(a,"broker-order")?(h("Order sent to WhatsApp successfully!","success"),e=[],$()):h("Failed to send order to WhatsApp","error");else{const n="254743375997",l=encodeURIComponent(a),m=`https://wa.me/${n}?text=${l}`;window.open(m,"_blank"),h("Order opened in WhatsApp!","success"),e=[],$()}}function ne(t){const a=t.items.map(n=>{let l=`• ${n.product.name} (${n.product.thickness})
`;return l+=`  Quantity: ${n.quantity} m²
`,l+=`  Unit Price: KES ${n.unitPrice.toLocaleString()}
`,l+=`  Subtotal: KES ${n.subtotal.toLocaleString()}`,(n.discount||n.coupon)&&(l+=`
  Final Total: KES ${n.finalTotal.toLocaleString()}`,n.discount&&(l+=` (${n.discount.name} applied)`),n.coupon&&(l+=` (${n.coupon.code} applied)`)),l}).join(`

`);return`*BROKER ORDER SUBMISSION - Eastleigh Turf Grass*

*Broker Details:*
• ID: ${t.brokerId}
• Name: ${t.brokerName}
• Email: ${t.brokerEmail}
• Phone: ${t.brokerPhone}

*Order Items:*
${a}

*Order Summary:*
• Total Items: ${t.items.length}
• Subtotal: KES ${t.subtotal.toLocaleString()}
• Total Discount: KES ${t.totalDiscount.toLocaleString()}
• Final Total: KES ${t.total.toLocaleString()}

*Submitted:* ${new Date().toLocaleString("en-KE")}`}function h(t,a="success"){const n=document.getElementById("toast"),l=n.querySelector(".toast-message");n&&l&&(n.className=`toast ${a}`,l.textContent=t,n.classList.remove("hidden"),setTimeout(()=>{n.classList.add("hidden")},3e3))}function oe(){return e.length}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",async()=>{await b()}):(async()=>await b())(),window.OrdersModule={addItem:K,removeItem:R,getItemCount:oe,calculateTotal:k,updateUI:$,submitOrder:W}})();class we{constructor(){this.whatsappNumber="254743375997",this.businessName="Eastleigh Turf Grass",this.baseUrl="https://wa.me"}sendOrder(e){try{const o=this.generateOrderMessage(e),r=this.generateWhatsAppUrl(o);return window.open(r,"_blank"),!0}catch(o){return console.error("WhatsApp Service Error:",o),!1}}sendPreorder(e){try{const o=this.generatePreorderMessage(e),r=this.generateWhatsAppUrl(o);return window.open(r,"_blank"),!0}catch(o){return console.error("WhatsApp Service Error:",o),!1}}sendInquiry(e){try{const o=this.generateInquiryMessage(e),r=this.generateWhatsAppUrl(o);return window.open(r,"_blank"),!0}catch(o){return console.error("WhatsApp Service Error:",o),!1}}sendContact(e){try{const o=this.generateContactMessage(e),r=this.generateWhatsAppUrl(o);return window.open(r,"_blank"),!0}catch(o){return console.error("WhatsApp Service Error:",o),!1}}generateWhatsAppUrl(e){const o=encodeURIComponent(e);return`${this.baseUrl}/${this.whatsappNumber}?text=${o}`}generateOrderMessage(e){const{brokerId:o,brokerName:r,brokerEmail:i,brokerPhone:d,items:u,total:c,subtotal:b,totalDiscount:f,orderDate:y}=e,E=u.map(g=>{let S=`• ${g.product.name} (${g.product.thickness})
`;return S+=`  Quantity: ${g.quantity} m²
`,S+=`  Unit Price: KES ${g.unitPrice.toLocaleString()}
`,S+=`  Subtotal: KES ${g.subtotal.toLocaleString()}`,(g.discount||g.coupon)&&(S+=`
  Final Total: KES ${g.finalTotal.toLocaleString()}`,g.discount&&(S+=` (${g.discount.name} applied)`),g.coupon&&(S+=` (${g.coupon.code} applied)`)),S}).join(`

`);return`*BROKER ORDER SUBMISSION - ${this.businessName}*

*Broker Details:*
• ID: ${o}
• Name: ${r}
• Email: ${i}
• Phone: ${d}

*Order Items:*
${E}

*Order Summary:*
• Total Items: ${u.length}
• Subtotal: KES ${b.toLocaleString()}
• Total Discount: KES ${f.toLocaleString()}
• Final Total: KES ${c.toLocaleString()}

*Submitted:* ${new Date(y).toLocaleString("en-KE")}`}generatePreorderMessage(e){const{brokerName:o,brokerEmail:r,items:i,expectedDate:d,specialNotes:u,total:c}=e,b=i.map(f=>`• ${f.product.name} (${f.product.thickness})
  Quantity: ${f.quantity} m²
  Unit Price: KES ${f.unitPrice.toLocaleString()}
  Total: KES ${f.total.toLocaleString()}`).join(`

`);return`*BROKER PREORDER SUBMISSION - ${this.businessName}*

*Broker Details:*
• Name: ${o}
• Email: ${r}

*Preorder Items:*
${b}

*Preorder Details:*
• Expected Date: ${d||"Not specified"}
• Special Notes: ${u||"None"}
• Total Amount: KES ${c.toLocaleString()}

*Submitted:* ${new Date().toLocaleString("en-KE")}`}generateInquiryMessage(e){const{brokerName:o,brokerEmail:r,items:i,totalOriginal:d,totalBargain:u}=e,c=i.map(y=>{const E=y.bargainPrice-y.originalPrice,g=E>0?`+KES ${E.toLocaleString()}`:`-KES ${Math.abs(E).toLocaleString()}`;return`• ${y.product.name} (${y.product.thickness})
  Original Price: KES ${y.originalPrice.toLocaleString()}
  Bargain Price: KES ${y.bargainPrice.toLocaleString()}
  Difference: ${g}`}).join(`

`),b=u-d,f=b>0?`+KES ${b.toLocaleString()}`:`-KES ${Math.abs(b).toLocaleString()}`;return`*BROKER PRICE INQUIRY - ${this.businessName}*

*Broker Details:*
• Name: ${o}
• Email: ${r}

*Price Inquiries:*
${c}

*Inquiry Summary:*
• Total Original Value: KES ${d.toLocaleString()}
• Total Bargain Value: KES ${u.toLocaleString()}
• Total Difference: ${f}

*Submitted:* ${new Date().toLocaleString("en-KE")}`}generateContactMessage(e){const{name:o,email:r,phone:i,subject:d,message:u}=e;return`*CONTACT FORM SUBMISSION - ${this.businessName}*

*Customer Details:*
• Name: ${o}
• Email: ${r}
• Phone: ${i}

*Message:*
Subject: ${d}
Message: ${u}

*Submitted:* ${new Date().toLocaleString("en-KE")}`}sendToWhatsApp(e,o="general"){try{const r=this.generateWhatsAppUrl(e);return window.open(r,"_blank"),!0}catch(r){return console.error("WhatsApp Service Error:",r),!1}}sendOrderForm(e){return this.sendOrder(e)}sendPreorderForm(e){return this.sendPreorder(e)}sendInquiryForm(e){return this.sendInquiry(e)}sendContactForm(e){return this.sendContact(e)}}const Se=new we;window.WhatsAppService=Se;try{j(()=>import("./preorders.c7080a31.js"),[])}catch(s){console.warn("Preorders module not available:",s)}try{j(()=>import("./inquiry.4757dc61.js"),[])}catch(s){console.warn("Inquiry module not available:",s)}document.addEventListener("DOMContentLoaded",function(){console.log("Broker dashboard initialized");const s=localStorage.getItem("authState");if(!s){window.location.href="/index.html";return}try{const e=JSON.parse(s);if(!e.loggedIn||!e.user){window.location.href="/index.html";return}const o={id:"BROKER001",name:e.user.username||"Broker User",email:e.user.email||"broker@eastleighturf.com",phone:e.user.phone||"+254700000000"};localStorage.setItem("brokerInfo",JSON.stringify(o))}catch(e){console.error("Error parsing auth state:",e),window.location.href="/index.html";return}window.BrokerDashboard?console.log("Broker dashboard modules loaded successfully"):console.error("Broker dashboard modules failed to load")});
//# sourceMappingURL=broker.658543f8.js.map
