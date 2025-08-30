// js/state/cartState.js — Central cart state management
import {
    couponService
} from '../services/couponService.js';
import {
    discountService
} from '../services/discountService.js';

const Cart = (() => {
    let items = []; // Array of { id, product, width, height, area, total }
    let appliedCoupon = null;
    let appliedPromotion = null;
    let subscribers = [];

    function getItems() {
        return [...items]; // return a shallow copy
    }

    function add(item) {
        const id = Date.now();
        items.push({
            id,
            ...item
        });
        render();
    }

    function remove(id) {
        items = items.filter(it => it.id !== id);
        render();
    }

    function clear() {
        items = [];
        appliedCoupon = null;
        appliedPromotion = null;
        render();
    }

    function getSubtotal() {
        return items.reduce((sum, it) => sum + it.total, 0);
    }

    function applyCoupon(code) {
        const subtotal = getSubtotal();
        const result = couponService.applyCoupon(code, subtotal);

        if (result.valid) {
            appliedCoupon = result.coupon;
            appliedPromotion = null; // Remove any applied promotion
            couponService.incrementCouponUsage(code);
        }

        render();
        return result;
    }

    function applyPromotion(promotionId) {
        const subtotal = getSubtotal();
        const result = discountService.applyPromotion(promotionId, subtotal);

        if (result.valid) {
            appliedPromotion = result.promotion;
            appliedCoupon = null; // Remove any applied coupon
        }

        render();
        return result;
    }

    function removeDiscount() {
        appliedCoupon = null;
        appliedPromotion = null;
        render();
    }

    function getDiscountAmount() {
        const subtotal = getSubtotal();
        let discountAmount = 0;

        if (appliedCoupon) {
            discountAmount = couponService.calculateCouponDiscount(appliedCoupon, subtotal);
        } else if (appliedPromotion) {
            discountAmount = discountService.calculatePromotionDiscount(appliedPromotion, subtotal);
        }

        return discountAmount;
    }

    function getTotal() {
        const subtotal = getSubtotal();
        const discountAmount = getDiscountAmount();
        return subtotal - discountAmount;
    }

    function getAvailablePromotions() {
        const subtotal = getSubtotal();
        return discountService.getAvailablePromotions(subtotal);
    }

    function getBestPromotion() {
        const subtotal = getSubtotal();
        return discountService.getBestPromotion(subtotal);
    }

    function render() {
        const subtotal = getSubtotal();
        const discountAmount = getDiscountAmount();
        const total = getTotal();

        // Notify all subscribers
        subscribers.forEach(callback => {
            try {
                callback({
                    items: getItems(),
                    subtotal: subtotal,
                    discountAmount: discountAmount,
                    total: total,
                    appliedCoupon: appliedCoupon,
                    appliedPromotion: appliedPromotion
                });
            } catch (e) {
                console.error('Cart subscriber error:', e);
            }
        });

        // Optional: trigger UI updates
        if (window.renderCartUI) {
            window.renderCartUI(getItems(), total, discountAmount);
        }
    }

    function subscribe(callback) {
        subscribers.push(callback);
        // Return unsubscribe function
        return () => {
            const index = subscribers.indexOf(callback);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        };
    }

    return {
        getItems,
        add,
        remove,
        clear,
        getSubtotal,
        applyCoupon,
        applyPromotion,
        removeDiscount,
        getDiscountAmount,
        getTotal,
        getAvailablePromotions,
        getBestPromotion,
        subscribe
    };
})();

export {
    Cart
};