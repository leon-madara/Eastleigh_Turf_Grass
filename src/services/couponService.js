// Coupon Service - Handles coupon validation and management
class CouponService {
    constructor() {
        this.coupons = [];
        this.loadCoupons();
    }

    // Load coupons from data file
    async loadCoupons() {
        try {
            const response = await fetch('/src/data/coupons.json');
            const data = await response.json();
            this.coupons = data.coupons || [];
        } catch (error) {
            console.error('Error loading coupons:', error);
            this.coupons = [];
        }
    }

    // Validate a coupon code
    validateCoupon(code, subtotal = 0) {
        const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

        if (!coupon) {
            return {
                valid: false,
                message: 'Invalid coupon code'
            };
        }

        // Check if coupon is expired
        const now = new Date();
        const validFrom = new Date(coupon.validFrom);
        const validTo = new Date(coupon.validTo);

        if (now < validFrom || now > validTo) {
            return {
                valid: false,
                message: 'Coupon has expired or is not yet valid'
            };
        }

        // Check minimum order requirement
        if (subtotal < coupon.minOrder) {
            return {
                valid: false,
                message: `Minimum order of KES ${coupon.minOrder.toLocaleString()} required`
            };
        }

        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
            return {
                valid: false,
                message: 'Coupon usage limit reached'
            };
        }

        return {
            valid: true,
            coupon: coupon,
            message: 'Coupon applied successfully'
        };
    }

    // Calculate discount amount for a coupon
    calculateCouponDiscount(coupon, subtotal) {
        let discountAmount = 0;

        if (coupon.type === 'percentage') {
            discountAmount = subtotal * (coupon.value / 100);
        } else if (coupon.type === 'fixed') {
            discountAmount = coupon.value;
        }

        // Apply maximum discount cap
        if (discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }

        return Math.min(discountAmount, subtotal); // Can't discount more than subtotal
    }

    // Apply coupon and return discount details
    applyCoupon(code, subtotal) {
        const validation = this.validateCoupon(code, subtotal);

        if (!validation.valid) {
            return validation;
        }

        const coupon = validation.coupon;
        const discountAmount = this.calculateCouponDiscount(coupon, subtotal);
        const finalTotal = subtotal - discountAmount;

        return {
            valid: true,
            coupon: coupon,
            discountAmount: discountAmount,
            finalTotal: finalTotal,
            message: `Coupon "${coupon.code}" applied! You saved KES ${discountAmount.toLocaleString()}`
        };
    }

    // Get available coupons for display
    getAvailableCoupons(subtotal = 0) {
        return this.coupons.filter(coupon => {
            const validation = this.validateCoupon(coupon.code, subtotal);
            return validation.valid;
        });
    }

    // Increment coupon usage (for tracking)
    incrementCouponUsage(code) {
        const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (coupon) {
            coupon.usedCount++;
            // In a real app, this would be saved to a database
        }
    }
}

// Export singleton instance
export const couponService = new CouponService();