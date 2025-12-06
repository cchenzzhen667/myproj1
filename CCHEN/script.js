// ==========================================
// ANIMATED BACKGROUND PARTICLES
// ==========================================

/**
 * Creates floating particles in the background
 * for a futuristic, dynamic effect
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// ANIMATED COUNTER FOR STATS
// ==========================================

/**
 * Animates numbers from 0 to target value
 * @param {HTMLElement} element - The element to animate
 * @param {number} target - The target number
 * @param {number} duration - Animation duration in ms
 * @param {boolean} isPercentage - Whether to add % symbol
 * @param {boolean} isDecimal - Whether to show decimals
 */
function animateCounter(element, target, duration, isPercentage = false, isDecimal = false) {
    let startTime = null;
    const startValue = 0;
    
    function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (target - startValue) * easeOutQuart;
        
        // Format the number
        let displayValue;
        if (isDecimal) {
            displayValue = currentValue.toFixed(1);
        } else {
            displayValue = Math.floor(currentValue).toLocaleString();
        }
        
        element.textContent = displayValue + (isPercentage ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Triggers counter animations when stats cards are visible
 */
function initStatsCounter() {
    const statCards = document.querySelectorAll('.stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target.querySelector('.stat-value');
                const target = parseInt(valueElement.dataset.target);
                
                // Determine animation type based on target value
                if (target > 100) {
                    // Large numbers (trades logged)
                    animateCounter(valueElement, target, 2000);
                } else if (target > 10) {
                    // Percentage (winrate)
                    animateCounter(valueElement, target, 2000, true);
                } else {
                    // Decimal (R:R ratio)
                    animateCounter(valueElement, target, 2000, false, true);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => observer.observe(card));
}

// ==========================================
// TRADING CHART VISUALIZATION
// ==========================================

/**
 * Draws a professional BUY signal arrow
 */
function drawBuySignal(ctx, x, y, color) {
    ctx.save();
    
    // Draw arrow pointing up
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    // Arrow triangle
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8, y + 12);
    ctx.lineTo(x + 8, y + 12);
    ctx.closePath();
    ctx.fill();
    
    // "BUY" text
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BUY', x, y - 5);
    
    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.stroke();
    
    ctx.restore();
}

/**
 * Draws a professional TP (Take Profit) signal
 */
function drawTPSignal(ctx, x, y, color) {
    ctx.save();
    
    // Draw arrow pointing down
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    // Arrow triangle (pointing down)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8, y - 12);
    ctx.lineTo(x + 8, y - 12);
    ctx.closePath();
    ctx.fill();
    
    // "TP HIT" text
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TP HIT', x, y + 20);
    
    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.stroke();
    
    ctx.restore();
}

/**
 * Draws an animated trading chart on canvas
 * Simulates a bullish trend with candlesticks
 */
function drawTradingChart() {
    const canvas = document.getElementById('tradingChart');
    if (!canvas) {
        console.warn('Trading chart canvas not found');
        return;
    }
    
    // Wait for canvas to be properly sized
    setTimeout(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('Could not get canvas context');
            return;
        }
        
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        const width = rect.width || 400;
        const height = rect.height || 300;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        // Generate price data with indicator signals
        const dataPoints = 35;
        let prices = [];
        let basePrice = 100;
        
        // Define buy signal position (before bullish move)
        const buySignalIndex = 5;
        // Define TP hit position (after bullish move)
        const tpHitIndex = 22;
        
        for (let i = 0; i < dataPoints; i++) {
            const volatility = Math.random() * 4;
            let trend = 0;
            
            // Create a clear bullish move after buy signal
            if (i < buySignalIndex) {
                // Sideways/consolidation before buy signal
                trend = (Math.random() - 0.5) * 0.5;
            } else if (i >= buySignalIndex && i < tpHitIndex) {
                // Strong bullish trend after buy signal
                trend = 0.8 + (i - buySignalIndex) * 0.15;
            } else {
                // Continue up but slower after TP hit
                trend = 0.3;
            }
            
            basePrice = basePrice + trend + (Math.random() - 0.3) * volatility;
            
            prices.push({
                open: basePrice,
                close: basePrice + (Math.random() - 0.3) * 2.5,
                high: basePrice + Math.random() * 3.5,
                low: basePrice - Math.random() * 2.5,
                isBuySignal: i === buySignalIndex,
                isTPHit: i === tpHitIndex
            });
        }
        
        // Calculate scale
        const maxPrice = Math.max(...prices.map(p => p.high));
        const minPrice = Math.min(...prices.map(p => p.low));
        const priceRange = maxPrice - minPrice;
        
        const candleWidth = width / dataPoints * 0.6;
        const spacing = width / dataPoints;
        
        let currentIndex = 0;
        
        /**
         * Animates drawing of candlesticks one by one
         */
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw grid lines
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            
            // Draw candlesticks
            for (let i = 0; i <= currentIndex && i < prices.length; i++) {
                const price = prices[i];
                const x = i * spacing + spacing / 2;
                
                // Scale prices to canvas height
                const open = height - ((price.open - minPrice) / priceRange) * height;
                const close = height - ((price.close - minPrice) / priceRange) * height;
                const high = height - ((price.high - minPrice) / priceRange) * height;
                const low = height - ((price.low - minPrice) / priceRange) * height;
                
                const isBullish = price.close > price.open;
                const color = isBullish ? '#00ff88' : '#ff4757'; // Updated colors
                
                // Draw wick (high-low line)
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, high);
                ctx.lineTo(x, low);
                ctx.stroke();
                
                // Draw body (open-close rectangle)
                ctx.fillStyle = color;
                const bodyHeight = Math.max(Math.abs(close - open), 2);
                const bodyY = Math.min(open, close);
                ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
                
                // Draw BUY signal arrow (before bullish move)
                if (price.isBuySignal && i <= currentIndex) {
                    drawBuySignal(ctx, x, low - 25, '#00ff88');
                }
                
                // Draw TP HIT signal (after bullish move)
                if (price.isTPHit && i <= currentIndex) {
                    drawTPSignal(ctx, x, high + 25, '#00d4ff');
                }
            }
            
            // Continue animation
            if (currentIndex < prices.length - 1) {
                currentIndex++;
                setTimeout(() => requestAnimationFrame(animate), 50);
            } else {
                // Add glow effect to the chart
                addChartGlow();
            }
        }
        
        /**
         * Adds a glowing line overlay on top of candlesticks
         */
        function addChartGlow() {
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#00d4ff';
            
            ctx.beginPath();
            prices.forEach((price, i) => {
                const x = i * spacing + spacing / 2;
                const y = height - ((price.close - minPrice) / priceRange) * height;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Draw indicator note/legend
            drawIndicatorNote();
        }
        
        /**
         * Draws professional indicator information note
         */
        function drawIndicatorNote() {
            ctx.save();
            
            const noteX = width - 20;
            const noteY = 20;
            const noteWidth = width - 40;
            const noteHeight = 100;
            
            // Background with blur effect
            ctx.fillStyle = 'rgba(10, 14, 39, 0.95)';
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
            
            // Rounded rectangle
            const radius = 12;
            ctx.beginPath();
            ctx.moveTo(noteX - noteWidth + radius, noteY);
            ctx.lineTo(noteX - radius, noteY);
            ctx.quadraticCurveTo(noteX, noteY, noteX, noteY + radius);
            ctx.lineTo(noteX, noteY + noteHeight - radius);
            ctx.quadraticCurveTo(noteX, noteY + noteHeight, noteX - radius, noteY + noteHeight);
            ctx.lineTo(noteX - noteWidth + radius, noteY + noteHeight);
            ctx.quadraticCurveTo(noteX - noteWidth, noteY + noteHeight, noteX - noteWidth, noteY + noteHeight - radius);
            ctx.lineTo(noteX - noteWidth, noteY + radius);
            ctx.quadraticCurveTo(noteX - noteWidth, noteY, noteX - noteWidth + radius, noteY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Text content
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            const title = 'AI-Powered Trading Indicator';
            ctx.fillText(title, noteX - noteWidth + 15, noteY + 12);
            
            ctx.font = '10px Inter, sans-serif';
            ctx.fillStyle = '#b4b9d1';
            const line1 = '✓ Trained AI indicators that cooperate';
            const line2 = '✓ Works on any chart & timeframe';
            const line3 = '✓ Available on TradingView';
            const line4 = '✓ Generates consistent profits';
            
            ctx.fillText(line1, noteX - noteWidth + 15, noteY + 32);
            ctx.fillText(line2, noteX - noteWidth + 15, noteY + 47);
            ctx.fillText(line3, noteX - noteWidth + 15, noteY + 62);
            ctx.fillText(line4, noteX - noteWidth + 15, noteY + 77);
            
            // Accent line
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(noteX - noteWidth + 15, noteY + 28);
            ctx.lineTo(noteX - noteWidth + 80, noteY + 28);
            ctx.stroke();
            
            ctx.restore();
        }
        
        animate();
    }, 100);
}

/**
 * Draws the indicator showcase chart (duplicate for showcase section)
 */
function drawIndicatorChart() {
    const canvas = document.getElementById('indicatorChart');
    if (!canvas) return;
    
    setTimeout(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = rect.width || 400;
        const height = rect.height || 300;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        // Use same data generation as main chart
        const dataPoints = 35;
        let prices = [];
        let basePrice = 100;
        const buySignalIndex = 5;
        const tpHitIndex = 22;
        
        for (let i = 0; i < dataPoints; i++) {
            const volatility = Math.random() * 4;
            let trend = 0;
            
            if (i < buySignalIndex) {
                trend = (Math.random() - 0.5) * 0.5;
            } else if (i >= buySignalIndex && i < tpHitIndex) {
                trend = 0.8 + (i - buySignalIndex) * 0.15;
            } else {
                trend = 0.3;
            }
            
            basePrice = basePrice + trend + (Math.random() - 0.3) * volatility;
            
            prices.push({
                open: basePrice,
                close: basePrice + (Math.random() - 0.3) * 2.5,
                high: basePrice + Math.random() * 3.5,
                low: basePrice - Math.random() * 2.5,
                isBuySignal: i === buySignalIndex,
                isTPHit: i === tpHitIndex
            });
        }
        
        const maxPrice = Math.max(...prices.map(p => p.high));
        const minPrice = Math.min(...prices.map(p => p.low));
        const priceRange = maxPrice - minPrice;
        const candleWidth = width / dataPoints * 0.6;
        const spacing = width / dataPoints;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw all candlesticks immediately
        prices.forEach((price, i) => {
            const x = i * spacing + spacing / 2;
            const open = height - ((price.open - minPrice) / priceRange) * height;
            const close = height - ((price.close - minPrice) / priceRange) * height;
            const high = height - ((price.high - minPrice) / priceRange) * height;
            const low = height - ((price.low - minPrice) / priceRange) * height;
            
            const isBullish = price.close > price.open;
            const color = isBullish ? '#00ff88' : '#ff4757';
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, high);
            ctx.lineTo(x, low);
            ctx.stroke();
            
            ctx.fillStyle = color;
            const bodyHeight = Math.max(Math.abs(close - open), 2);
            const bodyY = Math.min(open, close);
            ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
            
            if (price.isBuySignal) {
                drawBuySignal(ctx, x, low - 20, '#00ff88');
            }
            if (price.isTPHit) {
                drawTPSignal(ctx, x, high + 20, '#00d4ff');
            }
        });
        
        // Draw trend line
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00d4ff';
        ctx.beginPath();
        prices.forEach((price, i) => {
            const x = i * spacing + spacing / 2;
            const y = height - ((price.close - minPrice) / priceRange) * height;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
    }, 200);
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

/**
 * Enables smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

/**
 * Adds fade-in animation to elements as they scroll into view
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card, .stats-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================

/**
 * Changes header appearance on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(2, 6, 23, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(2, 6, 23, 0.8)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================
// CTA BUTTON ACTIONS
// ==========================================

/**
 * Handles click events for CTA buttons
 */
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.btn-hero, .btn-cta-large, .btn-nav-cta, .pricing-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // In a real app, this would navigate to the app or payment
            console.log('🚀 CTA clicked - Would navigate to signup/payment');
        });
    });
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// MARKET BADGE INTERACTION
// ==========================================

/**
 * Adds click interaction to market badges
 */
function initMarketBadges() {
    const badges = document.querySelectorAll('.market-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('click', () => {
            // Remove active class from all
            badges.forEach(b => b.style.background = '');
            
            // Add active state
            badge.style.background = 'rgba(16, 185, 129, 0.2)';
            badge.style.borderColor = '#10b981';
        });
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all features when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Trader Edge Tracker - Landing Page Loaded');
    
    try {
        // Initialize all features
        createParticles();
        initStatsCounter();
        drawTradingChart();
        drawIndicatorChart();
        initSmoothScrolling();
        initScrollAnimations();
        initHeaderScroll();
        initCTAButtons();
        initMarketBadges();
        initParallax();
        initPremiumAnimations();
        
        // Redraw chart on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                drawTradingChart();
            }, 250);
        });
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// ==========================================
// PREMIUM ANIMATIONS
// ==========================================

/**
 * Adds parallax effect to hero section
 */
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

/**
 * Adds intersection observer for fade-in animations
 */
function initPremiumAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all premium cards
    document.querySelectorAll('.feature-card, .stats-card, .pricing-card, .testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ==========================================
// CONSOLE EASTER EGG
// ==========================================

console.log('%c⚡ Trader Edge Tracker PRO', 'color: #00ff88; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff88;');
console.log('%c🚀 Premium Trading Journal Platform', 'color: #00d4ff; font-size: 14px;');
console.log('%c💎 Built for serious traders who want results', 'color: #b4b9d1; font-size: 12px;');
