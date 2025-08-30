(()=>{let g=[],d=[],$=1;function u(e,t="success"){var o;typeof window.showToast=="function"?window.showToast(e,t):(o=window.BrokerDashboard)!=null&&o.showToast?window.BrokerDashboard.showToast(e,t):console.log(`[${t.toUpperCase()}] ${e}`)}async function h(){await D(),f()}async function D(){try{const e=await fetch("/data/products.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);g=await e.json()}catch(e){console.error("Failed to load products:",e),u("Failed to load products","error"),g=[]}}function E(){var t;const e={id:$++,productId:"",product:null,quantity:1,unitPrice:0,total:0,expectedDate:"",specialNotes:""};d.push(e),f(),u("Preorder item added","success"),(t=window.BrokerDashboard)!=null&&t.updateCartCount&&window.BrokerDashboard.updateCartCount(y())}function P(e){var t;d=d.filter(o=>o.id!==e),f(),u("Preorder item removed","success"),(t=window.BrokerDashboard)!=null&&t.updateCartCount&&window.BrokerDashboard.updateCartCount(y())}function b(e,t,o){var l,r;const n=d.find(a=>a.id===e);if(n){if(t==="productId"){const a=g.find(i=>String(i.id)===String(o));n.productId=o,n.product=a||null,n.unitPrice=a&&Number(a.price)||0,n.total=n.unitPrice*(Number(n.quantity)||0)}else if(t==="quantity"){const a=((r=(l=window.numberFormatter)==null?void 0:l.parseFormattedNumber)==null?void 0:r.call(l,o))??parseFloat(String(o))??0;n.quantity=isNaN(a)?0:a,n.total=n.unitPrice*n.quantity}else t==="expectedDate"?n.expectedDate=o:t==="specialNotes"&&(n.specialNotes=o);f()}}function v(){return d.reduce((e,t)=>e+(Number(t.total)||0),0)}function B(e){const{brokerName:t,brokerEmail:o,items:n,expectedDate:l,specialNotes:r,total:a}=e,i=n.map(c=>{var w,s;const m=((w=c.product)==null?void 0:w.name)??"Unknown",p=((s=c.product)==null?void 0:s.thickness)??"";return`• ${m} (${p})
  Quantity: ${c.quantity} m²
  Unit Price: KES ${Number(c.unitPrice).toLocaleString()}
  Total: KES ${Number(c.total).toLocaleString()}`}).join(`

`);return`*BROKER PREORDER SUBMISSION - Eastleigh Turf Grass*

*Broker Details:*
• Name: ${t}
• Email: ${o}

*Preorder Items:*
${i}

*Preorder Details:*
• Expected Date: ${l||"Not specified"}
• Special Notes: ${r||"None"}
• Total Amount: KES ${Number(a).toLocaleString()}

*Submitted:* ${new Date().toLocaleString("en-KE")}`}function f(){const e=document.getElementById("preorderTableBody"),t=document.getElementById("emptyPreorderState"),o=document.getElementById("preorderTotal"),n=document.getElementById("submitPreordersBtn");if(!e||!t||!o||!n)return;d.length===0?(e.innerHTML="",t.style.display="block",n.disabled=!0):(t.style.display="none",n.disabled=!1,e.innerHTML=d.map(r=>k(r)).join(""),d.forEach(r=>{var w;const a=document.getElementById(`preorder-product-${r.id}`),i=document.getElementById(`preorder-quantity-${r.id}`),c=document.getElementById(`preorder-date-${r.id}`),m=document.getElementById(`preorder-notes-${r.id}`),p=document.getElementById(`delete-preorder-${r.id}`);if(a==null||a.addEventListener("change",s=>b(r.id,"productId",s.target.value)),i)if(i.addEventListener("input",s=>b(r.id,"quantity",s.target.value)),(w=window.numberFormatter)!=null&&w.initInputFormatting)window.numberFormatter.initInputFormatting(i,{allowDecimals:!0,decimalPlaces:1,currency:"KES"});else{const s=setInterval(()=>{var I;(I=window.numberFormatter)!=null&&I.initInputFormatting&&(window.numberFormatter.initInputFormatting(i,{allowDecimals:!0,decimalPlaces:1,currency:"KES"}),clearInterval(s))},100)}c==null||c.addEventListener("change",s=>b(r.id,"expectedDate",s.target.value)),m==null||m.addEventListener("input",s=>b(r.id,"specialNotes",s.target.value)),p==null||p.addEventListener("click",()=>P(r.id))}));const l=v();o.textContent=Number(l).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function k(e){const t=g.map(o=>`
          <option value="${o.id}" ${String(e.productId)===String(o.id)?"selected":""}>
            ${o.name} (${o.thickness})
          </option>`).join("");return`
      <tr>
        <td>
          <div class="order-field">
            <label for="preorder-product-${e.id}">Product Name</label>
            <select class="table-select" id="preorder-product-${e.id}">
              <option value="">Select a product</option>
              ${t}
            </select>
          </div>
        </td>
        <td>
          <div class="order-field">
            <label for="preorder-quantity-${e.id}">Quantity (m²)</label>
            <input type="number" inputmode="decimal" class="table-input" id="preorder-quantity-${e.id}"
                   value="${e.quantity}" min="0.1" step="0.1" placeholder="0">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label>Unit Price (KES)</label>
            <input type="text" class="table-input" readonly value="${Number(e.unitPrice).toLocaleString("en-US")}">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label for="preorder-date-${e.id}">Expected Date</label>
            <input type="date" class="table-input" id="preorder-date-${e.id}"
                   value="${e.expectedDate||""}" placeholder="Expected date">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label for="preorder-notes-${e.id}">Special Notes</label>
            <input type="text" class="table-input" id="preorder-notes-${e.id}"
                   value="${e.specialNotes||""}" placeholder="Special notes">
          </div>
        </td>
        <td>
          <div class="order-field">
            <label>Total (KES)</label>
            <strong>${Number(e.total).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
          </div>
        </td>
        <td>
          <div class="order-field">
            <label>Action</label>
            <button class="delete-btn" id="delete-preorder-${e.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>`}async function N(){var t,o,n,l;if(d.length===0){u("No preorder items to submit","error");return}if(d.filter(r=>!r.productId||Number(r.quantity)<=0).length>0){u("Please complete all preorder items before submitting","error");return}try{const r={brokerName:"Broker User",brokerEmail:"broker@eastleighturf.com",items:d.map(i=>({product:i.product,quantity:i.quantity,unitPrice:i.unitPrice,total:i.total})),expectedDate:((t=d[0])==null?void 0:t.expectedDate)||"Not specified",specialNotes:((o=d[0])==null?void 0:o.specialNotes)||"None",total:v()};let a=!1;if((n=window.WhatsAppService)!=null&&n.sendPreorderForm){const i=window.WhatsAppService.sendPreorderForm(r);a=typeof(i==null?void 0:i.then)=="function"?await i:!!i}else{const i=B(r),c="254743375997",m=encodeURIComponent(i),p=`https://wa.me/${c}?text=${m}`;window.open(p,"_blank"),a=!0}a?(u("Preorders submitted successfully! WhatsApp will open with your preorder details.","success"),d=[],$=1,f(),(l=window.BrokerDashboard)!=null&&l.updateCartCount&&window.BrokerDashboard.updateCartCount(y())):u("Failed to send preorders. Please try again.","error")}catch(r){console.error("Preorder submission error:",r),u("An error occurred while submitting the preorders.","error")}}function y(){return d.length}function S(){var e,t;(e=document.getElementById("addPreorderBtn"))==null||e.addEventListener("click",E),(t=document.getElementById("submitPreordersBtn"))==null||t.addEventListener("click",N)}window.PreordersModule={init:h,addPreorder:E,removePreorder:P,updatePreorder:b,submitPreorders:N,getItemCount:y},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{h(),S()}):(h(),S())})();
//# sourceMappingURL=preorders-c7080a31.js.map
