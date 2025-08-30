// Discount Service - Handles promotional discounts and rules
class DiscountService {
    constructor() {
        this.promotions = [];
        this.loadPromotions();
    }

    // Load promotions from data file
    async loadPromotions() {
        try {
            const response = await fetch('/src/data/discounts.json');
            const data = await response.json();
            this.promotions = data.promotions || [];
        } catch (error) {
            console.error('Error loading promotions:', error);
            this.promotions = [];
        }
    }

    // Get available promotions for a given subtotal
    getAvailablePromotions(subtotal = 0) {
        const now = new Date();

        return this.promotions.filter(promotion => {
            // Check if promotion is active
            if (!promotion.active) return false;

            // Check date validity
            const validFrom = new Date(promotion.validFrom);
            const validTo = new Date(promotion.validTo);

            if (now < validFrom || now > validTo) return false;

            // Check minimum order requirement
            if (subtotal < promotion.minOrder) return false;

            return true;
        });
    }

    // Get the best available promotion
    getBestPromotion(subtotal = 0) {
        const availablePromotions = this.getAvailablePromotions(subtotal);

        if (availablePromotions.length === 0) {
            return null;
        }

        // Calculate potential savings for each promotion
        const promotionsWithSavings = availablePromotions.map(promotion => {
            const savings = this.calculatePromotionDiscount(promotion, subtotal);
            return {
                ...promotion,
                potentialSavings: savings
            };
        });

        // Return the promotion with the highest savings
        return promotionsWithSavings.reduce((best, current) => {
            return current.potentialSavings > best.potentialSavings ? current : best;
        });
    }

    // Calculate discount amount for a promotion
    calculatePromotionDiscount(promotion, subtotal) {
        let discountAmount = 0;

        if (promotion.type === 'percentage') {
            discountAmount = subtotal * (promotion.value / 100);
        } else if (promotion.type === 'fixed') {
            discountAmount = promotion.value;
        }

        // Apply maximum discount cap
        if (discountAmount > promotion.maxDiscount) {
            discountAmount = promotion.maxDiscount;
        }

        return Math.min(discountAmount, subtotal); // Can't discount more than subtotal
    }

    // Apply a specific promotion
    applyPromotion(promotionId, subtotal) {
        const promotion = this.promotions.find(p => p.id === promotionId);

        if (!promotion) {
            return {
                valid: false,
                message: 'Promotion not found'
            };
        }

        const availablePromotions = this.getAvailablePromotions(subtotal);
        const isAvailable = availablePromotions.some(p => p.id === promotionId);

        if (!isAvailable) {
            return {
                valid: false,
                message: 'Promotion not available for this order'
            };
        }

        const discountAmount = this.calculatePromotionDiscount(promotion, subtotal);
        const finalTotal = subtotal - discountAmount;

        return {
            valid: true,
            promotion: promotion,
            discountAmount: discountAmount,
            finalTotal: finalTotal,
            message: `${promotion.name} applied! You saved KES ${discountAmount.toLocaleString()}`
        };
    }

    // Get promotion details for display
    getPromotionDetails(promotionId) {
        return this.promotions.find(p => p.id === promotionId);
    }

    // Check if any promotions are available
    hasAvailablePromotions(subtotal = 0) {
        return this.getAvailablePromotions(subtotal).length > 0;
    }

    // Get promotion summary for UI display
    getPromotionSummary(subtotal = 0) {
        const bestPromotion = this.getBestPromotion(subtotal);

        if (!bestPromotion) {
            return null;
        }

        const savings = this.calculatePromotionDiscount(bestPromotion, subtotal);

        return {
            promotion: bestPromotion,
            savings: savings,
            finalTotal: subtotal - savings,
            savingsPercentage: ((savings / subtotal) * 100).toFixed(1)
        };
    }
}

// Export singleton instance
export const discountService = new DiscountService();