// Message Service for WhatsApp Integration
class MessageService {
    constructor() {
        this.whatsappNumber = '254743375997'; // Default business number
        this.businessName = 'Eastleigh Turf Grass';
        this.loadConfig();
    }

    // Load configuration from existing WhatsApp config
    loadConfig() {
        try {
            if (window.whatsappConfig) {
                this.whatsappNumber = window.whatsappConfig.phoneNumber || this.whatsappNumber;
                this.businessName = window.whatsappConfig.businessName || this.businessName;
            }
        } catch (error) {
            console.warn('Failed to load WhatsApp config:', error);
        }
    }

    // Format currency for display
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Format area for display
    formatArea(area) {
        return `${area.toLocaleString()} m²`;
    }

    // Generate order message
    generateOrderMessage(customerData, cartData, discountData) {
        const {
            name,
            phone,
            location
        } = customerData;
        const {
            items
        } = cartData;
        const {
            subtotal,
            discountAmount,
            total,
            appliedCoupon,
            appliedPromotion
        } = discountData;

        let message = `🏠 *${this.businessName} - New Order*\n\n`;

        // Customer Information
        message += `👤 *Customer Details:*\n`;
        message += `Name: ${name}\n`;
        message += `Phone: ${phone}\n`;
        message += `Location: ${location}\n\n`;

        // Order Items
        message += `📦 *Order Items:*\n`;
        let totalArea = 0;

        items.forEach((item, index) => {
            const area = item.area || 0;
            totalArea += area;

            message += `${index + 1}. ${item.name}\n`;
            message += `   • Size: ${item.width}m × ${item.length}m = ${this.formatArea(area)}\n`;
            message += `   • Price: ${this.formatCurrency(item.total)}\n\n`;
        });

        // Order Summary
        message += `📊 *Order Summary:*\n`;
        message += `Total Area: ${this.formatArea(totalArea)}\n`;
        message += `Subtotal: ${this.formatCurrency(subtotal)}\n`;

        // Discount Information
        if (discountAmount > 0) {
            message += `Discount: -${this.formatCurrency(discountAmount)}\n`;

            if (appliedCoupon) {
                message += `Coupon: ${appliedCoupon.code} (${appliedCoupon.value}% off)\n`;
            }

            if (appliedPromotion) {
                message += `Promotion: ${appliedPromotion.name}\n`;
            }
        }

        message += `*Final Total: ${this.formatCurrency(total)}*\n\n`;

        // Additional Information
        message += `📅 Order Date: ${new Date().toLocaleDateString('en-KE')}\n`;
        message += `🕒 Order Time: ${new Date().toLocaleTimeString('en-KE')}\n\n`;

        // Call to Action
        message += `Please confirm this order and provide delivery details. Thank you! 🙏`;

        return message;
    }

    // Generate simple order message (for smaller orders)
    generateSimpleOrderMessage(customerData, cartData, discountData) {
        const {
            name,
            phone,
            location
        } = customerData;
        const {
            items
        } = cartData;
        const {
            total
        } = discountData;

        let message = `🏠 *${this.businessName}*\n\n`;
        message += `New order from ${name}\n`;
        message += `Phone: ${phone}\n`;
        message += `Location: ${location}\n\n`;

        message += `Items:\n`;
        items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${this.formatCurrency(item.total)}\n`;
        });

        message += `\nTotal: ${this.formatCurrency(total)}`;

        return message;
    }

    // Generate WhatsApp URL
    generateWhatsAppUrl(message) {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${this.whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    }

    // Open WhatsApp with message
    openWhatsApp(message) {
        const url = this.generateWhatsAppUrl(message);
        window.open(url, '_blank');
    }

    // Copy message to clipboard
    async copyToClipboard(message) {
        try {
            await navigator.clipboard.writeText(message);
            return {
                success: true,
                message: 'Message copied to clipboard!'
            };
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);

            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = message;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return {
                    success: true,
                    message: 'Message copied to clipboard!'
                };
            } catch (fallbackError) {
                document.body.removeChild(textArea);
                return {
                    success: false,
                    message: 'Failed to copy message'
                };
            }
        }
    }

    // Open WhatsApp Web
    openWhatsAppWeb() {
        window.open('https://web.whatsapp.com', '_blank');
    }

    // Generate order ID
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ETG-${timestamp}-${random}`;
    }

    // Format order for display
    formatOrderForDisplay(customerData, cartData, discountData) {
        const {
            name,
            phone,
            location
        } = customerData;
        const {
            items
        } = cartData;
        const {
            subtotal,
            discountAmount,
            total
        } = discountData;

        return {
            customer: {
                name,
                phone,
                location
            },
            items: items.map(item => ({
                name: item.name,
                size: `${item.width}m × ${item.length}m`,
                area: this.formatArea(item.area || 0),
                price: this.formatCurrency(item.total)
            })),
            summary: {
                totalArea: this.formatArea(items.reduce((sum, item) => sum + (item.area || 0), 0)),
                subtotal: this.formatCurrency(subtotal),
                discount: this.formatCurrency(discountAmount),
                total: this.formatCurrency(total)
            }
        };
    }

    // Validate message length for WhatsApp
    validateMessageLength(message) {
        const maxLength = 4096; // WhatsApp message limit
        return {
            valid: message.length <= maxLength,
            length: message.length,
            maxLength,
            remaining: maxLength - message.length
        };
    }

    // Truncate message if too long
    truncateMessage(message, maxLength = 4000) {
        if (message.length <= maxLength) {
            return message;
        }

        // Try to truncate at a sentence boundary
        const truncated = message.substring(0, maxLength);
        const lastPeriod = truncated.lastIndexOf('.');
        const lastNewline = truncated.lastIndexOf('\n');

        const cutPoint = Math.max(lastPeriod, lastNewline);

        if (cutPoint > maxLength * 0.8) { // If we can find a good cut point
            return truncated.substring(0, cutPoint + 1) + '\n\n[Message truncated due to length]';
        }

        return truncated + '\n\n[Message truncated due to length]';
    }

    // Generate different message templates
    generateMessageTemplate(template, customerData, cartData, discountData) {
        switch (template) {
            case 'detailed':
                return this.generateOrderMessage(customerData, cartData, discountData);
            case 'simple':
                return this.generateSimpleOrderMessage(customerData, cartData, discountData);
            case 'urgent':
                return this.generateUrgentMessage(customerData, cartData, discountData);
            default:
                return this.generateOrderMessage(customerData, cartData, discountData);
        }
    }

    // Generate urgent order message
    generateUrgentMessage(customerData, cartData, discountData) {
        const baseMessage = this.generateOrderMessage(customerData, cartData, discountData);
        return `🚨 *URGENT ORDER* 🚨\n\n${baseMessage}`;
    }

    // Get message preview (truncated for display)
    getMessagePreview(message, maxLength = 200) {
        if (message.length <= maxLength) {
            return message;
        }

        return message.substring(0, maxLength) + '...';
    }

    // Sanitize message for WhatsApp
    sanitizeMessage(message) {
        return message
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
            .trim();
    }
}

// Export singleton instance
export const messageService = new MessageService();