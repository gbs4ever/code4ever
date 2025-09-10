/**
 * Google Analytics utility module
 * Handles tracking events and user interactions
 */

// Configuration from environment variables
const ANALYTICS_CONFIG = {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID',
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    debug: import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
    environment: import.meta.env.VITE_ANALYTICS_ENVIRONMENT || 'development',
    siteUrl: import.meta.env.VITE_SITE_URL || 'https://www.code4ever.dev',
    siteName: import.meta.env.VITE_SITE_NAME || 'Code4Ever'
};

/**
 * Initialize Google Analytics
 */
export function initAnalytics() {
    if (!ANALYTICS_CONFIG.enabled || typeof gtag === 'undefined') {
        console.log('Analytics disabled or gtag not available');
        return;
    }

    // Enhanced measurement settings
    gtag('config', ANALYTICS_CONFIG.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        // Enable enhanced measurement features
        allow_google_signals: true,
        allow_ad_personalization_signals: false,
        // Custom parameters
        custom_map: {
            custom_parameter_1: 'business_type',
            custom_parameter_2: 'user_intent'
        }
    });

    if (ANALYTICS_CONFIG.debug) {
        console.log('Google Analytics initialized with ID:', ANALYTICS_CONFIG.measurementId);
    }
}

/**
 * Track page views
 * @param {string} pagePath - The page path
 * @param {string} pageTitle - The page title
 */
export function trackPageView(pagePath, pageTitle = document.title) {
    if (!ANALYTICS_CONFIG.enabled || typeof gtag === 'undefined') return;

    gtag('config', ANALYTICS_CONFIG.measurementId, {
        page_path: pagePath,
        page_title: pageTitle,
    });

    if (ANALYTICS_CONFIG.debug) {
        console.log('Page view tracked:', { pagePath, pageTitle });
    }
}

/**
 * Track custom events
 * @param {string} eventName - The event name
 * @param {Object} parameters - Event parameters
 */
export function trackEvent(eventName, parameters = {}) {
    if (!ANALYTICS_CONFIG.enabled || typeof gtag === 'undefined') return;

    gtag('event', eventName, {
        event_category: parameters.category || 'engagement',
        event_label: parameters.label || '',
        value: parameters.value || 1,
        custom_parameter_1: parameters.businessType || '',
        custom_parameter_2: parameters.userIntent || '',
        ...parameters
    });

    if (ANALYTICS_CONFIG.debug) {
        console.log('Event tracked:', { eventName, parameters });
    }
}

/**
 * Track form submissions
 * @param {string} formName - The name of the form
 * @param {Object} formData - Form data (non-sensitive)
 */
export function trackFormSubmission(formName, formData = {}) {
    trackEvent('form_submit', {
        category: 'form',
        label: formName,
        form_name: formName,
        business_type: formData.businessType || 'unknown',
        user_intent: formData.userIntent || 'contact'
    });
}

/**
 * Track button clicks
 * @param {string} buttonName - The button name or ID
 * @param {string} section - The section where the button is located
 */
export function trackButtonClick(buttonName, section = '') {
    trackEvent('click', {
        category: 'button',
        label: buttonName,
        section: section,
        button_name: buttonName
    });
}

/**
 * Track navigation events
 * @param {string} linkText - The link text
 * @param {string} destination - The destination (href)
 */
export function trackNavigation(linkText, destination) {
    trackEvent('navigate', {
        category: 'navigation',
        label: linkText,
        destination: destination,
        link_text: linkText
    });
}

/**
 * Track section scrolling (for measuring engagement)
 * @param {string} sectionName - The section name
 */
export function trackSectionView(sectionName) {
    trackEvent('scroll', {
        category: 'engagement',
        label: `section_${sectionName}`,
        section_name: sectionName
    });
}

/**
 * Track file downloads
 * @param {string} fileName - The downloaded file name
 * @param {string} fileType - The file type
 */
export function trackDownload(fileName, fileType) {
    trackEvent('file_download', {
        category: 'download',
        label: fileName,
        file_name: fileName,
        file_type: fileType
    });
}

/**
 * Track external link clicks
 * @param {string} url - The external URL
 * @param {string} linkText - The link text
 */
export function trackExternalLink(url, linkText) {
    trackEvent('click', {
        category: 'external_link',
        label: url,
        link_text: linkText,
        external_url: url
    });
}

/**
 * Track conversion events (leads, etc.)
 * @param {string} conversionType - Type of conversion
 * @param {number} value - Conversion value
 */
export function trackConversion(conversionType, value = 0) {
    trackEvent('conversion', {
        category: 'conversion',
        label: conversionType,
        value: value,
        conversion_type: conversionType
    });
}

/**
 * Track user engagement time on specific sections
 * @param {string} sectionName - The section name
 * @param {number} timeSpent - Time spent in milliseconds
 */
export function trackEngagementTime(sectionName, timeSpent) {
    trackEvent('engagement_time', {
        category: 'engagement',
        label: sectionName,
        value: Math.round(timeSpent / 1000), // Convert to seconds
        section_name: sectionName,
        time_spent: timeSpent
    });
}

/**
 * Set user properties for better segmentation
 * @param {Object} properties - User properties
 */
export function setUserProperties(properties) {
    if (!ANALYTICS_CONFIG.enabled || typeof gtag === 'undefined') return;

    gtag('config', ANALYTICS_CONFIG.measurementId, {
        user_properties: {
            business_type: properties.businessType || '',
            user_intent: properties.userIntent || '',
            page_type: properties.pageType || 'website',
            ...properties
        }
    });

    if (ANALYTICS_CONFIG.debug) {
        console.log('User properties set:', properties);
    }
}

export default {
    init: initAnalytics,
    trackPageView,
    trackEvent,
    trackFormSubmission,
    trackButtonClick,
    trackNavigation,
    trackSectionView,
    trackDownload,
    trackExternalLink,
    trackConversion,
    trackEngagementTime,
    setUserProperties
};
