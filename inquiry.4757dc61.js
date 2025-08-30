(()=>{let u=[],a=[],g=1;function f(){w(),l()}async function w(){try{u=await(await fetch("/src/data/products.json")).json()}catch(t){console.error("Failed to load products:",t),showToast("Failed to load products","error")}}function h(){const t={id:g++,productId:"",product:null,originalPrice:0,bargainPrice:0,difference:0};a.push(t),l(),showToast("Inquiry added","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function b(t){a=a.filter(r=>r.id!==t),l(),showToast("Inquiry removed","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function m(t,r,n){const e=a.find(i=>i.id===t);if(e){if(r==="productId"){const i=u.find(o=>o.id===n);e.productId=n,e.product=i,e.originalPrice=i?i.price:0,e.difference=e.bargainPrice-e.originalPrice}else r==="bargainPrice"&&(e.bargainPrice=window.numberFormatter?window.numberFormatter.parseFormattedNumber(n):parseFloat(n)||0,e.difference=e.bargainPrice-e.originalPrice);l()}}function I(t){return t<0?"negative":t>0?"positive":"neutral"}function P(t){const r=Math.abs(t);return`${t<0?"-":t>0?"+":""}KES ${r.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`}function l(){const t=document.getElementById("inquiryTableBody"),r=document.getElementById("emptyInquiryState"),n=document.getElementById("submitInquiriesBtn");!t||!r||!n||(a.length===0?(t.innerHTML="",r.style.display="block",n.disabled=!0):(r.style.display="none",n.disabled=!1,t.innerHTML=a.map(e=>$(e)).join(""),a.forEach(e=>{const i=document.getElementById(`inquiry-product-${e.id}`),o=document.getElementById(`bargain-${e.id}`),c=document.getElementById(`delete-inquiry-${e.id}`);if(i&&i.addEventListener("change",s=>{m(e.id,"productId",s.target.value)}),o)if(o.addEventListener("input",s=>{m(e.id,"bargainPrice",s.target.value)}),window.numberFormatter)window.numberFormatter.initInputFormatting(o,{allowDecimals:!0,decimalPlaces:2,currency:"KES"});else{const s=setInterval(()=>{window.numberFormatter&&(window.numberFormatter.initInputFormatting(o,{allowDecimals:!0,decimalPlaces:2,currency:"KES"}),clearInterval(s))},100)}c&&c.addEventListener("click",()=>{b(e.id)})})))}function $(t){const r=u.map(i=>`<option value="${i.id}" ${t.productId===i.id?"selected":""}>
                ${i.name} (${i.thickness})
            </option>`).join(""),n=I(t.difference),e=P(t.difference);return`
            <tr>
                <td>
                  <div class="order-field">
                    <label for="inquiry-product-${t.id}">Product Name</label>
                    <select class="table-select" id="inquiry-product-${t.id}">
                        <option value="">Select a product</option>
                        ${r}
                    </select>
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Original Price (KES)</label>
                    <input type="text" class="table-input" readonly 
                           value="${t.originalPrice.toLocaleString("en-US")}">
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label for="bargain-${t.id}">Your Bargain Price (KES)</label>
                    <input type="number" inputmode="decimal" class="table-input" id="bargain-${t.id}" 
                           value="${t.bargainPrice}" min="0" step="0.01" placeholder="0">
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Price Difference</label>
                    <span class="price-difference ${n}">${e}</span>
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Action</label>
                    <button class="delete-btn" id="delete-inquiry-${t.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
            </tr>
        `}function S(){if(a.length===0){showToast("No inquiries to submit","error");return}if(a.filter(r=>!r.productId||r.bargainPrice<=0).length>0){showToast("Please complete all inquiries before submitting","error");return}try{const r={brokerName:"Broker User",brokerEmail:"broker@eastleighturf.com",items:a.map(e=>({product:e.product,originalPrice:e.originalPrice,bargainPrice:e.bargainPrice})),totalOriginal:a.reduce((e,i)=>e+i.originalPrice,0),totalBargain:a.reduce((e,i)=>e+i.bargainPrice,0)};let n=!1;if(window.WhatsAppService&&window.WhatsAppService.sendInquiryForm)n=window.WhatsAppService.sendInquiryForm(r);else{const e=E(r),i="254743375997",o=encodeURIComponent(e),c=`https://wa.me/${i}?text=${o}`;window.open(c,"_blank"),n=!0}n?(showToast("Inquiries submitted successfully! WhatsApp will open with your inquiry details.","success"),a=[],g=1,l(),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()):showToast("Failed to send inquiries. Please try again.","error")}catch(r){console.error("Inquiry submission error:",r),showToast("An error occurred while submitting the inquiries.","error")}}function y(){return a.length}function E(t){const{brokerName:r,brokerEmail:n,items:e,totalOriginal:i,totalBargain:o}=t,c=e.map(d=>{const p=d.bargainPrice-d.originalPrice,B=p>0?`+KES ${p.toLocaleString()}`:`-KES ${Math.abs(p).toLocaleString()}`;return`• ${d.product.name} (${d.product.thickness})
  Original Price: KES ${d.originalPrice.toLocaleString()}
  Bargain Price: KES ${d.bargainPrice.toLocaleString()}
  Difference: ${B}`}).join(`

`),s=o-i,v=s>0?`+KES ${s.toLocaleString()}`:`-KES ${Math.abs(s).toLocaleString()}`;return`*BROKER PRICE INQUIRY - Eastleigh Turf Grass*

*Broker Details:*
• Name: ${r}
• Email: ${n}

*Price Inquiries:*
${c}

*Inquiry Summary:*
• Total Original Value: KES ${i.toLocaleString()}
• Total Bargain Value: KES ${o.toLocaleString()}
• Total Difference: ${v}

*Submitted:* ${new Date().toLocaleString("en-KE")}`}window.InquiryModule={init:f,addInquiry:h,removeInquiry:b,updateInquiry:m,submitInquiries:S,getItemCount:y},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()})();
//# sourceMappingURL=inquiry.4757dc61.js.map
