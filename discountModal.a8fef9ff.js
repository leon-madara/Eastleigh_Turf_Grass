const n={init(){console.log("Discount modal initialized")},open(){this.createModal(),this.showModal()},close(){this.hideModal()},createModal(){const t=document.getElementById("discountModal");t&&t.remove();const s=`
            <div id="discountModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Available Discounts</h2>
                        <button class="modal-close" id="closeDiscountModal" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="discount-list" id="discountList">
                            <div class="discount-item">
                                <div class="discount-info">
                                    <h3>Bulk Purchase Discount</h3>
                                    <p>Get 10% off when you purchase 100m² or more</p>
                                    <span class="discount-value">10% OFF</span>
                                </div>
                                <button class="btn btn-primary apply-discount" data-discount="bulk">Apply</button>
                            </div>
                            <div class="discount-item">
                                <div class="discount-info">
                                    <h3>First Time Buyer</h3>
                                    <p>Special discount for first-time customers</p>
                                    <span class="discount-value">5% OFF</span>
                                </div>
                                <button class="btn btn-primary apply-discount" data-discount="first-time">Apply</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelDiscount">Close</button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",s),this.bindEvents()},showModal(){const t=document.getElementById("discountModal");t&&(t.style.display="flex")},hideModal(){const t=document.getElementById("discountModal");t&&t.remove()},bindEvents(){const t=document.getElementById("closeDiscountModal");t&&t.addEventListener("click",()=>this.close());const s=document.getElementById("cancelDiscount");s&&s.addEventListener("click",()=>this.close()),document.querySelectorAll(".apply-discount").forEach(i=>{i.addEventListener("click",e=>{const d=e.target.dataset.discount;this.applyDiscount(d)})});const o=document.getElementById("discountModal");o&&o.addEventListener("click",i=>{i.target===o&&this.close()})},applyDiscount(t){this.showSuccess(`Discount applied: ${t}`),setTimeout(()=>{this.close()},1500)},showSuccess(t){console.log("Discount Success:",t),alert(t)}};export{n as discountModal};
//# sourceMappingURL=discountModal.a8fef9ff.js.map
