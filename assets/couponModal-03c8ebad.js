const s={modal:null,isOpen:!1,init(){console.log("Coupon modal initialized")},open(){this.createModal(),this.showModal()},close(){this.hideModal()},createModal(){const o=document.getElementById("couponModal");o&&o.remove();const e=`
            <div id="couponModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Enter Coupon Code</h2>
                        <button class="modal-close" id="closeCouponModal" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="couponForm">
                            <div class="form-group">
                                <label for="couponCode">Coupon Code</label>
                                <input type="text" id="couponCode" placeholder="Enter your coupon code" required>
                            </div>
                            <div class="coupon-info" id="couponInfo" style="display: none;">
                                <div class="info-row">
                                    <span>Discount:</span>
                                    <span id="couponDiscount">0%</span>
                                </div>
                                <div class="info-row">
                                    <span>Valid until:</span>
                                    <span id="couponExpiry">N/A</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelCoupon">Cancel</button>
                        <button type="button" class="btn btn-primary" id="applyCoupon">Apply Coupon</button>
                    </div>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",e),this.bindEvents()},showModal(){const o=document.getElementById("couponModal");if(o){o.style.display="flex";const e=document.getElementById("couponCode");e&&e.focus()}},hideModal(){const o=document.getElementById("couponModal");o&&o.remove()},bindEvents(){const o=document.getElementById("closeCouponModal");o&&o.addEventListener("click",()=>this.close());const e=document.getElementById("cancelCoupon");e&&e.addEventListener("click",()=>this.close());const d=document.getElementById("applyCoupon");d&&d.addEventListener("click",()=>this.applyCoupon());const t=document.getElementById("couponModal");t&&t.addEventListener("click",n=>{n.target===t&&this.close()});const l=document.getElementById("couponCode");l&&l.addEventListener("keypress",n=>{n.key==="Enter"&&(n.preventDefault(),this.applyCoupon())})},applyCoupon(){if(!document.getElementById("couponCode").value.trim()){this.showError("Please enter a coupon code");return}this.showSuccess("Coupon applied successfully!"),setTimeout(()=>{this.close()},1500)},showError(o){console.error("Coupon Error:",o),alert(o)},showSuccess(o){console.log("Coupon Success:",o),alert(o)}};export{s as couponModal};
//# sourceMappingURL=couponModal-03c8ebad.js.map
