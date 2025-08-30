// WhatsApp Service for Broker Dashboard
class WhatsAppService {
    constructor() {
        this.whatsappNumber = '254743375997'; // Business WhatsApp number
        this.businessName = 'Eastleigh Turf Grass';
        this.baseUrl = 'https://wa.me';
    }

    /**
     * Send order to WhatsApp
     * @param {Object} orderData - Order data object
     * @returns {boolean} - Success status
     */
    sendOrder(orderData) {
        try {
            const message = this.generateOrderMessage(orderData);
            const url = this.generateWhatsAppUrl(message);

            // Open WhatsApp in new tab
            window.open(url, '_blank');

            return true;
        } catch (error) {
            console.error('WhatsApp Service Error:', error);
            return false;
        }
    }

    /**
     * Send preorder to WhatsApp
     * @param {Object} preorderData - Preorder data object
     * @returns {boolean} - Success status
     */
    sendPreorder(preorderData) {
        try {
            const message = this.generatePreorderMessage(preorderData);
            const url = this.generateWhatsAppUrl(message);

            // Open WhatsApp in new tab
            window.open(url, '_blank');

            return true;
        } catch (error) {
            console.error('WhatsApp Service Error:', error);
            return false;
        }
    }

    /**
     * Send inquiry to WhatsApp
     * @param {Object} inquiryData - Inquiry data object
     * @returns {boolean} - Success status
     */
    sendInquiry(inquiryData) {
        try {
            const message = this.generateInquiryMessage(inquiryData);
            const url = this.generateWhatsAppUrl(message);

            // Open WhatsApp in new tab
            window.open(url, '_blank');

            return true;
        } catch (error) {
            console.error('WhatsApp Service Error:', error);
            return false;
        }
    }

    /**
     * Send contact form to WhatsApp
     * @param {Object} contactData - Contact data object
     * @returns {boolean} - Success status
     */
    sendContact(contactData) {
        try {
            const message = this.generateContactMessage(contactData);
            const url = this.generateWhatsAppUrl(message);

            // Open WhatsApp in new tab
            window.open(url, '_blank');

            return true;
        } catch (error) {
            console.error('WhatsApp Service Error:', error);
            return false;
        }
    }

    /**
     * Generate WhatsApp URL
     * @param {string} message - Message to send
     * @returns {string} - WhatsApp URL
     */
    generateWhatsAppUrl(message) {
        const encodedMessage = encodeURIComponent(message);
        return `${this.baseUrl}/${this.whatsappNumber}?text=${encodedMessage}`;
    }

    /**
     * Generate order message
     * @param {Object} orderData - Order data
     * @returns {string} - Formatted message
     */
    generateOrderMessage(orderData) {
        const {
            brokerId,
            brokerName,
            brokerEmail,
            brokerPhone,
            items,
            total,
            subtotal,
            totalDiscount,
            orderDate
        } = orderData;

        const itemsList = items.map(item => {
            let itemText = `• ${item.product.name} (${item.product.thickness})\n`;
            itemText += `  Quantity: ${item.quantity} m²\n`;
            itemText += `  Unit Price: KES ${item.unitPrice.toLocaleString()}\n`;
            itemText += `  Subtotal: KES ${item.subtotal.toLocaleString()}`;

            if (item.discount || item.coupon) {
                itemText += `\n  Final Total: KES ${item.finalTotal.toLocaleString()}`;
                if (item.discount) {
                    itemText += ` (${item.discount.name} applied)`;
                }
                if (item.coupon) {
                    itemText += ` (${item.coupon.code} applied)`;
                }
            }
            return itemText;
        }).join('\n\n');

        return `*BROKER ORDER SUBMISSION - ${this.businessName}*

*Broker Details:*
• ID: ${brokerId}
• Name: ${brokerName}
• Email: ${brokerEmail}
• Phone: ${brokerPhone}

*Order Items:*
${itemsList}

*Order Summary:*
• Total Items: ${items.length}
• Subtotal: KES ${subtotal.toLocaleString()}
• Total Discount: KES ${totalDiscount.toLocaleString()}
• Final Total: KES ${total.toLocaleString()}

*Submitted:* ${new Date(orderDate).toLocaleString('en-KE')}`;
    }

    /**
     * Generate preorder message
     * @param {Object} preorderData - Preorder data
     * @returns {string} - Formatted message
     */
    generatePreorderMessage(preorderData) {
        const {
            brokerName,
            brokerEmail,
            items,
            expectedDate,
            specialNotes,
            total
        } = preorderData;

        const itemsList = items.map(item => {
            return `• ${item.product.name} (${item.product.thickness})
  Quantity: ${item.quantity} m²
  Unit Price: KES ${item.unitPrice.toLocaleString()}
  Total: KES ${item.total.toLocaleString()}`;
        }).join('\n\n');

        return `*BROKER PREORDER SUBMISSION - ${this.businessName}*

*Broker Details:*
• Name: ${brokerName}
• Email: ${brokerEmail}

*Preorder Items:*
${itemsList}

*Preorder Details:*
• Expected Date: ${expectedDate || 'Not specified'}
• Special Notes: ${specialNotes || 'None'}
• Total Amount: KES ${total.toLocaleString()}

*Submitted:* ${new Date().toLocaleString('en-KE')}`;
    }

    /**
     * Generate inquiry message
     * @param {Object} inquiryData - Inquiry data
     * @returns {string} - Formatted message
     */
    generateInquiryMessage(inquiryData) {
        const {
            brokerName,
            brokerEmail,
            items,
            totalOriginal,
            totalBargain
        } = inquiryData;

        const itemsList = items.map(item => {
            const difference = item.bargainPrice - item.originalPrice;
            const differenceText = difference > 0 ? `+KES ${difference.toLocaleString()}` : `-KES ${Math.abs(difference).toLocaleString()}`;

            return `• ${item.product.name} (${item.product.thickness})
  Original Price: KES ${item.originalPrice.toLocaleString()}
  Bargain Price: KES ${item.bargainPrice.toLocaleString()}
  Difference: ${differenceText}`;
        }).join('\n\n');

        const totalDifference = totalBargain - totalOriginal;
        const totalDifferenceText = totalDifference > 0 ? `+KES ${totalDifference.toLocaleString()}` : `-KES ${Math.abs(totalDifference).toLocaleString()}`;

        return `*BROKER PRICE INQUIRY - ${this.businessName}*

*Broker Details:*
• Name: ${brokerName}
• Email: ${brokerEmail}

*Price Inquiries:*
${itemsList}

*Inquiry Summary:*
• Total Original Value: KES ${totalOriginal.toLocaleString()}
• Total Bargain Value: KES ${totalBargain.toLocaleString()}
• Total Difference: ${totalDifferenceText}

*Submitted:* ${new Date().toLocaleString('en-KE')}`;
    }

    /**
     * Generate contact message
     * @param {Object} contactData - Contact data
     * @returns {string} - Formatted message
     */
    generateContactMessage(contactData) {
        const {
            name,
            email,
            phone,
            subject,
            message
        } = contactData;

        return `*CONTACT FORM SUBMISSION - ${this.businessName}*

*Customer Details:*
• Name: ${name}
• Email: ${email}
• Phone: ${phone}

*Message:*
Subject: ${subject}
Message: ${message}

*Submitted:* ${new Date().toLocaleString('en-KE')}`;
    }

    /**
     * Legacy method for backward compatibility
     * @param {string} message - Message to send
     * @param {string} type - Message type
     * @returns {boolean} - Success status
     */
    sendToWhatsApp(message, type = 'general') {
        try {
            const url = this.generateWhatsAppUrl(message);
            window.open(url, '_blank');
            return true;
        } catch (error) {
            console.error('WhatsApp Service Error:', error);
            return false;
        }
    }

    /**
     * Legacy method for backward compatibility
     * @param {Object} orderData - Order data
     * @returns {boolean} - Success status
     */
    sendOrderForm(orderData) {
        return this.sendOrder(orderData);
    }

    /**
     * Legacy method for backward compatibility
     * @param {Object} preorderData - Preorder data
     * @returns {boolean} - Success status
     */
    sendPreorderForm(preorderData) {
        return this.sendPreorder(preorderData);
    }

    /**
     * Legacy method for backward compatibility
     * @param {Object} inquiryData - Inquiry data
     * @returns {boolean} - Success status
     */
    sendInquiryForm(inquiryData) {
        return this.sendInquiry(inquiryData);
    }

    /**
     * Legacy method for backward compatibility
     * @param {Object} contactData - Contact data
     * @returns {boolean} - Success status
     */
    sendContactForm(contactData) {
        return this.sendContact(contactData);
    }
}

// Create and export singleton instance
const whatsappService = new WhatsAppService();

// Make it available globally
window.WhatsAppService = whatsappService;

// Export for module systems
export default whatsappService;