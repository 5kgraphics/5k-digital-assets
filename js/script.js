        // Firebase configuration
        const firebaseConfig = {
  apiKey: "AIzaSyCA6yVgH1snvuW-BOGbi4YX8xIGBRU4TKQ",
  authDomain: "digital-studio-19b83.firebaseapp.com",
  projectId: "digital-studio-19b83",
  storageBucket: "digital-studio-19b83.firebasestorage.app",
  messagingSenderId: "156700490401",
  appId: "1:156700490401:web:aaacdae02f2b8ee3530ee0",
  measurementId: "G-3GKD8FM4D9"
};

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();

        // Product data
        let products = [];

        // DOM Elements
        const productsContainer = document.getElementById('products-container');
        const paginationContainer = document.getElementById('pagination');
        const homePage = document.getElementById('home-page');
        const productDetailPage = document.getElementById('product-detail-page');
        const detailImage = document.getElementById('detail-image');
        const detailType = document.getElementById('detail-type');
        const detailTitle = document.getElementById('detail-title');
        const detailDescription = document.getElementById('detail-description');
        const detailDownload = document.getElementById('detail-download');
        const backToProducts = document.getElementById('back-to-products');
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');
        const filterType = document.getElementById('filter-type');
        const sortBy = document.getElementById('sort-by');
        const navLinks = document.querySelectorAll('.nav-links a');
        const mobileMenu = document.querySelector('.mobile-menu');
        const navMenu = document.querySelector('.nav-links');
        const themeToggle = document.getElementById('themeToggle');
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const contactForm = document.getElementById('contactForm');
        const contactSupportBtn = document.getElementById('contact-support-btn');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const digitalText = document.getElementById('digitalText');
        const digitalBinary = document.getElementById('digitalBinary');
        const digitalParticles = document.getElementById('digitalParticles');
        const controlsSection = document.getElementById('controls-section');
        
        // Verification Modal Elements
        const verificationModal = document.getElementById('verificationModal');
        const verificationClose = document.getElementById('verificationClose');
        const verificationCancel = document.getElementById('verificationCancel');
        const verificationContinue = document.getElementById('verificationContinue');
        const verificationStatus = document.getElementById('verificationStatus');
        const vpnWarning = document.getElementById('vpnWarning');
        const recaptchaElement = document.getElementById('recaptchaElement');
        const manualVerification = document.getElementById('manualVerification');
        const manualVerifyBtn = document.getElementById('manualVerifyBtn');
        
        // Cookie Consent Elements
        const cookieConsent = document.getElementById('cookieConsent');
        const cookieAccept = document.getElementById('cookieAccept');
        const cookieDecline = document.getElementById('cookieDecline');

        // Pagination variables
        let currentPage = 1;
        const productsPerPage = 9;

        // Search variables
        let searchTimeout;
        
        // VPN/Proxy detection variables
        let isUsingVPN = false;
        let currentProduct = null;
        let recaptchaResponse = null;
        let recaptchaWidgetId = null;

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Check cookie consent first
            if(cookieConsent) checkCookieConsent();
            
            // Show loading animation initially
            showLoadingAnimation();
            
            // Create digital text animation
            if(digitalText) createDigitalTextAnimation();
            
            // Create binary rain
            if(digitalBinary) createBinaryRain();
            
            // Create digital particles
            if(digitalParticles) createDigitalParticles();
            
            // Load products after a short delay to show the loading animation
            setTimeout(() => {
                loadProducts();
                setupEventListeners();
                checkThemePreference();
                hideLoadingAnimation();
            }, 1500);
        });

        // Cookie Consent Functions
        function checkCookieConsent() {
            const cookieConsentGiven = localStorage.getItem('cookieConsent');
            
            if (!cookieConsentGiven) {
                // Show cookie consent banner after a short delay
                setTimeout(() => {
                    cookieConsent.classList.add('active');
                }, 1000);
            }
        }

        function acceptCookies() {
            localStorage.setItem('cookieConsent', 'all');
            cookieConsent.classList.remove('active');
            // Initialize analytics or other tracking here if needed
        }

        function declineCookies() {
            localStorage.setItem('cookieConsent', 'essential');
            cookieConsent.classList.remove('active');
            // Only use essential cookies
        }

        // Create digital text animation
        function createDigitalTextAnimation() {
            const text = "digital assets";
            const letters = text.split('');
            
            digitalText.innerHTML = '';
            letters.forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter; // Use non-breaking space
                span.style.setProperty('--i', index);
                digitalText.appendChild(span);
            });
        }

        // Create binary rain effect
        function createBinaryRain() {
            const binaryChars = ['0', '1'];
            const binaryCount = 50;
            
            for (let i = 0; i < binaryCount; i++) {
                const span = document.createElement('span');
                span.className = 'binary-char';
                span.textContent = binaryChars[Math.floor(Math.random() * 2)];
                span.style.left = `${Math.random() * 100}%`;
                span.style.setProperty('--i', i);
                digitalBinary.appendChild(span);
            }
        }

        // Create digital particles
        function createDigitalParticles() {
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'digital-particle';
                
                // Random position
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                
                // Random size
                const size = Math.random() * 4 + 2;
                
                // Random color from theme
                const colors = [
                    'var(--primary)',
                    'var(--secondary)',
                    'var(--accent)',
                    'var(--success)'
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Random animation delay
                const delay = Math.random() * 2;
                
                // Set styles
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.backgroundColor = color;
                particle.style.boxShadow = `0 0 10px ${color}`;
                particle.style.setProperty('--i', delay);
                
                digitalParticles.appendChild(particle);
            }
        }

        // Load products from Firebase
        async function loadProducts() {
            try {
                const productsSnapshot = await db.collection('products').get();
                products = [];
                productsSnapshot.forEach(doc => {
                    const productData = doc.data();
                    // Ensure all required fields exist with fallbacks
                    const product = {
                        id: doc.id,
                        title: productData.name || productData.title || 'Untitled Product',
                        type: productData.category || productData.type || 'Uncategorized',
                        description: productData.description || 'No description available',
                        image: productData.image || 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                        downloadUrl: productData.download || productData.downloadUrl || '#'
                    };
                    products.push(product);
                });
                
                if (products.length === 0) {
                    loadSampleProducts();
                } else {
                    if(productsContainer) displayProducts();
                }
            } catch (error) {
                console.error('Error loading products:', error);
                loadSampleProducts();
            }
        }

        // Fallback sample products
        function loadSampleProducts() {
            products = [
                {
                    id: 1,
                    title: "Minimal UI Kit",
                    type: "UI-Kit",
                    description: "<h3>Complete UI Component Library</h3><p>A clean and modern UI kit with 50+ components for web and mobile applications. Perfect for designers and developers looking to speed up their workflow with reusable components.</p><ul><li>Responsive design elements</li><li>Dark and light variants</li><li>Figma source files included</li></ul>",
                    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 2,
                    title: "Creative Brush Pack",
                    type: "Brush",
                    description: "<h3>Professional Digital Art Brushes</h3><p>Collection of 30 high-quality Photoshop brushes for digital artists and designers. Includes ink, watercolor, and texture brushes for various artistic styles.</p><p><em>Perfect for creating stunning digital artwork with professional results.</em></p>",
                    image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 3,
                    title: "Social Media Marketing Course",
                    type: "Course",
                    description: "<h3>Master Social Media Marketing</h3><p>Complete guide to social media marketing with actionable strategies and templates. Learn how to grow your audience, create engaging content, and measure your success.</p><p><strong>What you'll learn:</strong></p><ol><li>Content strategy development</li><li>Platform-specific optimization</li><li>Analytics and ROI tracking</li></ol>",
                    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 4,
                    title: "Modern Font Bundle",
                    type: "Font",
                    description: "<h3>Premium Typography Collection</h3><p>Package of 15 contemporary fonts perfect for branding and web design projects. Includes sans-serif, serif, and display fonts with multiple weights.</p><p style=\"text-align: center;\"><u>Licensed for commercial use</u></p>",
                    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 5,
                    title: "Lightroom Presets Pack",
                    type: "Preset",
                    description: "<h3>Professional Photo Editing Presets</h3><p>Professional Lightroom presets to enhance your photography with one click. Includes presets for portraits, landscapes, and creative editing styles.</p><blockquote>Transform your photos in seconds with these professionally crafted presets.</blockquote>",
                    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 6,
                    title: "Website Template Bundle",
                    type: "Template",
                    description: "<h3>Responsive Website Templates</h3><p>Responsive HTML templates for various business niches with modern design. Fully customizable and optimized for performance and SEO.</p><table><tr><th>Features</th><th>Benefits</th></tr><tr><td>Mobile-first design</td><td>Better user experience</td></tr><tr><td>SEO optimized</td><td>Higher search rankings</td></tr></table>",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 7,
                    title: "Audio Pack Bundle",
                    type: "Audio",
                    description: "<h3>Professional Sound Effects Collection</h3><p>High-quality audio pack with 100+ sound effects for videos, podcasts, and multimedia projects. Includes transitions, ambient sounds, and musical elements.</p><ul><li>WAV and MP3 formats</li><li>Royalty-free license</li><li>Professionally mastered</li></ul>",
                    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 8,
                    title: "Ebook Design Template",
                    type: "Ebook",
                    description: "<h3>Professional Ebook Templates</h3><p>Beautifully designed ebook templates for Kindle, PDF, and other formats. Includes cover designs, chapter layouts, and typography styles.</p><p><em>Perfect for authors and content creators looking to publish professional ebooks.</em></p>",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                },
                {
                    id: 9,
                    title: "Texture Collection",
                    type: "Texture",
                    description: "<h3>Premium Texture Pack</h3><p>Collection of 50 high-resolution textures including wood, metal, fabric, and abstract patterns. Perfect for adding depth and realism to your designs.</p><blockquote>All textures are 4K resolution and seamlessly tileable.</blockquote>",
                    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    downloadUrl: "#"
                }
            ];
            if(productsContainer) displayProducts();
        }

        // Save contact form to Firebase
        async function saveContactForm(formData) {
            try {
                await db.collection('contactMessages').add({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'unread'
                });
                return true;
            } catch (error) {
                console.error('Error saving contact form:', error);
                return false;
            }
        }

        // Track download
        async function trackDownload(productId, productTitle) {
            try {
                await db.collection('downloads').add({
                    productId: productId,
                    productTitle: productTitle,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    userAgent: navigator.userAgent
                });
            } catch (error) {
                console.error('Error tracking download:', error);
            }
        }

        // Set up event listeners
        function setupEventListeners() {
            // Cookie consent event listeners
            if(cookieAccept && cookieDecline) {
                cookieAccept.addEventListener('click', acceptCookies);
                cookieDecline.addEventListener('click', declineCookies);
            }
            
            // Navigation Links - Standard multi-page behavior
            if(navLinks) {
                navLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        // Don't prevent default; let the href="page.html" work naturally
                        // Just update active class logic if needed, but typically browser handles this
                        // However, we can add a loading effect
                        showLoadingAnimation();
                        setTimeout(() => hideLoadingAnimation(), 500); 
                    });
                });
            }

            // Footer links event listeners
            document.querySelectorAll('.footer-links a').forEach(link => {
                link.addEventListener('click', function(e) {
                    showLoadingAnimation();
                });
            });

            // Mobile menu toggle
            if(mobileMenu && navMenu) {
                mobileMenu.addEventListener('click', function() {
                    navMenu.classList.toggle('active');
                });
            }

            // Back to products button
            if(backToProducts) {
                backToProducts.addEventListener('click', function() {
                    window.location.href = 'index.html';
                });
            }

            // Theme toggle
            if(themeToggle) {
                themeToggle.addEventListener('click', toggleTheme);
            }

            // Scroll to top button
            if(scrollTopBtn) {
                scrollTopBtn.addEventListener('click', scrollToTop);
                window.addEventListener('scroll', toggleScrollTopButton);
            }

            // Search and filter
            if(searchInput) {
                searchInput.addEventListener('input', handleSearchInput);
                searchInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.blur();
                        handleSearchInput();
                    }
                });
            }
            if(searchClear) {
                searchClear.addEventListener('click', clearSearch);
            }
            if(filterType) {
                filterType.addEventListener('change', handleFilterChange);
            }
            if(sortBy) {
                sortBy.addEventListener('change', handleFilterChange);
            }

            // Contact form
            if(contactForm) {
                contactForm.addEventListener('submit', handleContactSubmit);
            }
            
            // Contact support button
            if(contactSupportBtn) {
                contactSupportBtn.addEventListener('click', function() {
                    window.location.href = 'contact.html';
                });
            }
            
            // Verification modal event listeners
            if(verificationClose) verificationClose.addEventListener('click', closeVerificationModal);
            if(verificationCancel) verificationCancel.addEventListener('click', closeVerificationModal);
            if(verificationContinue) verificationContinue.addEventListener('click', proceedWithDownload);
            if(manualVerifyBtn) manualVerifyBtn.addEventListener('click', enableManualVerification);
            
            // Check if we are on the product detail page to load data
            if(window.location.pathname.includes('product-detail.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                const productId = urlParams.get('id');
                if(productId) {
                    // Wait for products to load first
                    const checkProducts = setInterval(() => {
                        if(products.length > 0) {
                            clearInterval(checkProducts);
                            showProductDetailContent(productId);
                        }
                    }, 100);
                }
            }
        }

        // Enhanced search functionality
        function handleSearchInput() {
            // Show/hide clear button based on input
            if (searchInput.value.length > 0) {
                searchClear.style.display = 'block';
            } else {
                searchClear.style.display = 'none';
            }
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            // Set a new timeout to delay the search
            searchTimeout = setTimeout(() => {
                filterProducts();
            }, 300); // 300ms delay for better performance
        }

        // Handle filter and sort changes
        function handleFilterChange() {
            filterProducts();
        }

        // Clear search input
        function clearSearch() {
            searchInput.value = '';
            searchClear.style.display = 'none';
            filterProducts();
        }

        // Function to strip HTML tags from text (for search/filter only)
        function stripHtmlTags(text) {
            if (!text) return '';
            return text.replace(/<[^>]*>/g, '');
        }

        // Function to truncate text (preserves HTML for preview)
        function truncateText(text, maxLength = 100) {
            if (!text) return '';
            
            // Create a temporary div to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';
            
            if (plainText.length <= maxLength) return text;
            
            // Find the position to truncate
            const truncated = plainText.substring(0, maxLength);
            
            // Try to close any open HTML tags
            const tagStack = [];
            let result = '';
            let i = 0;
            let j = 0;
            
            while (i < text.length && j < maxLength) {
                if (text[i] === '<') {
                    // Find the end of the tag
                    const tagEnd = text.indexOf('>', i);
                    if (tagEnd === -1) break;
                    
                    const tag = text.substring(i, tagEnd + 1);
                    result += tag;
                    
                    // Check if it's an opening or closing tag
                    if (tag[1] !== '/') {
                        // Opening tag
                        const tagName = tag.match(/<(\w+)/);
                        if (tagName && !['br', 'img', 'hr', 'input', 'meta', 'link'].includes(tagName[1].toLowerCase())) {
                            tagStack.push(tagName[1].toLowerCase());
                        }
                    } else {
                        // Closing tag
                        const tagName = tag.match(/<\/(\w+)/);
                        if (tagName) {
                            const index = tagStack.lastIndexOf(tagName[1].toLowerCase());
                            if (index !== -1) {
                                tagStack.splice(index, 1);
                            }
                        }
                    }
                    
                    i = tagEnd + 1;
                } else {
                    result += text[i];
                    i++;
                    j++;
                }
            }
            
            // Close any remaining open tags
            while (tagStack.length > 0) {
                result += `</${tagStack.pop()}>`;
            }
            
            return result + '...';
        }

        // Display products based on current filters and pagination
        function displayProducts() {
            // Get filtered and sorted products
            const filteredProducts = getFilteredProducts();
            const sortedProducts = sortProducts(filteredProducts);
            
            // Calculate pagination
            const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const productsToShow = sortedProducts.slice(startIndex, endIndex);
            
            // Clear container
            productsContainer.innerHTML = '';
            
            // Display products or no results message
            if (productsToShow.length === 0) {
                productsContainer.innerHTML = `
                    <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--gray); margin-bottom: 1rem;"></i>
                        <h3 style="color: var(--text-color); margin-bottom: 1rem;">No products found</h3>
                        <p style="color: var(--gray);">Try adjusting your search or filter criteria</p>
                    </div>
                `;
            } else {
                productsToShow.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.title}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <span class="product-type">${product.type}</span>
                            <h3 class="product-title">${product.title}</h3>
                            <div class="product-description">${truncateText(product.description, 100)}</div>
                            <div class="product-actions">
                                <button class="more-info-btn" onclick="window.location.href='product-detail.html?id=${product.id}'">More Info</button>
                            </div>
                        </div>
                    `;
                    productsContainer.appendChild(productCard);
                });
            }
            
            // Display pagination
            displayPagination(totalPages);
        }

        // Get filtered products based on search and filter criteria
        function getFilteredProducts() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const selectedType = filterType.value;
            
            return products.filter(product => {
                // Check if product exists and has required properties
                if (!product || !product.title || !product.description) {
                    return false; // Skip invalid products
                }
                
                const productTitle = stripHtmlTags(product.title || '').toLowerCase();
                const productDescription = stripHtmlTags(product.description || '').toLowerCase();
                const productType = product.type || '';
                
                // Enhanced search logic - prioritize title matches, especially first words
                let matchesSearch = false;
                
                if (searchTerm.length > 0) {
                    // Split search term into words
                    const searchWords = searchTerm.split(/\s+/);
                    
                    // Get the first word of the product title
                    const titleFirstWord = productTitle.split(/\s+/)[0];
                    
                    // Check if all search words are found in title (primary) or description (secondary)
                    const titleMatches = searchWords.every(word => productTitle.includes(word));
                    const descriptionMatches = searchWords.every(word => productDescription.includes(word));
                    
                    // Check if first word of title matches any search word
                    const firstWordMatches = searchWords.some(word => titleFirstWord.includes(word));
                    
                    // Prioritize title matches, especially first word matches
                    if (titleMatches) {
                        matchesSearch = true;
                    } else if (firstWordMatches) {
                        matchesSearch = true;
                    } else if (descriptionMatches) {
                        matchesSearch = true;
                    }
                } else {
                    matchesSearch = true; // No search term, show all
                }
                
                const matchesType = selectedType === 'All Types' || productType === selectedType;
                
                return matchesSearch && matchesType;
            });
        }

        // Sort products based on selected criteria with search relevance
        function sortProducts(productsToSort) {
            const sortValue = sortBy.value;
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            // If there's a search term, prioritize relevance
            if (searchTerm.length > 0) {
                return productsToSort.sort((a, b) => {
                    // Calculate relevance scores
                    const aScore = calculateRelevanceScore(a, searchTerm);
                    const bScore = calculateRelevanceScore(b, searchTerm);
                    
                    // Sort by relevance (descending)
                    return bScore - aScore;
                });
            }
            
            // Otherwise, use the selected sort method
            switch(sortValue) {
                case 'Alphabetical (A-Z)':
                    return productsToSort.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                case 'Alphabetical (Z-A)':
                    return productsToSort.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                case 'Newest First':
                    return productsToSort.sort((a, b) => (b.id || 0) - (a.id || 0));
                case 'Most Popular':
                    return productsToSort;
                default:
                    return productsToSort;
            }
        }

        // Calculate relevance score for search results
        function calculateRelevanceScore(product, searchTerm) {
            let score = 0;
            
            const productTitle = stripHtmlTags(product.title || '').toLowerCase();
            const productDescription = stripHtmlTags(product.description || '').toLowerCase();
            const searchWords = searchTerm.split(/\s+/);
            
            // Get the first word of the product title
            const titleFirstWord = productTitle.split(/\s+/)[0];
            
            // Check each search word
            searchWords.forEach(word => {
                // Exact match in title (highest priority)
                if (productTitle === word) {
                    score += 10;
                }
                // First word of title matches (high priority)
                else if (titleFirstWord.includes(word)) {
                    score += 8;
                }
                // Word appears at the beginning of title
                else if (productTitle.startsWith(word)) {
                    score += 6;
                }
                // Word appears in title
                else if (productTitle.includes(word)) {
                    score += 4;
                }
                // Word appears in description
                else if (productDescription.includes(word)) {
                    score += 2;
                }
            });
            
            return score;
        }

        // Display pagination buttons with the format <12345.....>12
        function displayPagination(totalPages) {
            paginationContainer.innerHTML = '';
            
            if (totalPages <= 1) return;
            
            // Previous button
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&laquo;';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayProducts();
                    scrollToTop();
                }
            });
            paginationContainer.appendChild(prevButton);
            
            // Always show first page
            const firstPageButton = document.createElement('button');
            firstPageButton.textContent = '1';
            firstPageButton.className = 1 === currentPage ? 'active' : '';
            firstPageButton.addEventListener('click', () => {
                currentPage = 1;
                displayProducts();
                scrollToTop();
            });
            paginationContainer.appendChild(firstPageButton);
            
            // Show pages around current page
            let startPage = Math.max(2, currentPage - 2);
            let endPage = Math.min(totalPages - 1, currentPage + 2);
            
            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                endPage = Math.min(totalPages - 1, 5);
            }
            
            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 4);
            }
            
            // Add ellipsis after first page if needed
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.className = i === currentPage ? 'active' : '';
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    displayProducts();
                    scrollToTop();
                });
                paginationContainer.appendChild(pageButton);
            }
            
            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            
            // Always show last page if there's more than one page
            if (totalPages > 1) {
                const lastPageButton = document.createElement('button');
                lastPageButton.textContent = totalPages;
                lastPageButton.className = totalPages === currentPage ? 'active' : '';
                lastPageButton.addEventListener('click', () => {
                    currentPage = totalPages;
                    displayProducts();
                    scrollToTop();
                });
                paginationContainer.appendChild(lastPageButton);
            }
            
            // Next button
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '&raquo;';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayProducts();
                    scrollToTop();
                }
            });
            paginationContainer.appendChild(nextButton);
        }

        // Show product detail page content (Separated from animation logic)
        function showProductDetailContent(productId) {
            const product = products.find(p => p.id == productId);
            
            if (product && productDetailPage) {
                detailImage.innerHTML = `<img src="${product.image}" alt="${product.title}">`;
                detailType.textContent = product.type;
                detailTitle.textContent = product.title;
                // Display HTML content directly (with sanitization)
                detailDescription.innerHTML = sanitizeHtml(product.description);
                
                // Set up download button with verification
                detailDownload.onclick = function() {
                    currentProduct = product;
                    showVerificationModal();
                };
                
                productDetailPage.classList.add('active');
                if(controlsSection) controlsSection.classList.remove('hidden'); // Ensure controls visible if needed
            }
            hideLoadingAnimation();
            scrollToTop();
        }

        // Basic HTML sanitization function
        function sanitizeHtml(html) {
            if (!html) return '';
            
            // Create a temporary div to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Remove script tags and on* attributes
            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach(script => script.remove());
            
            const allElements = tempDiv.querySelectorAll('*');
            allElements.forEach(element => {
                // Remove all event handlers
                const attributes = Array.from(element.attributes);
                attributes.forEach(attr => {
                    if (attr.name.startsWith('on')) {
                        element.removeAttribute(attr.name);
                    }
                });
            });
            
            return tempDiv.innerHTML;
        }

        // Show loading animation
        function showLoadingAnimation() {
            loadingOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling during animation
        }

        // Hide loading animation
        function hideLoadingAnimation() {
            loadingOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Filter products when search or filter changes
        function filterProducts() {
            currentPage = 1;
            if(productsContainer) displayProducts();
        }

        // Handle contact form submission
        async function handleContactSubmit(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            const success = await saveContactForm(formData);
            
            if (success) {
                alert('Thank you for your message! We will get back to you soon.');
                e.target.reset();
            } else {
                alert('There was an error sending your message. Please try again.');
            }
        }

        // Toggle between light and dark theme
        function toggleTheme() {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            
            // Save theme preference
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        }

        // Check for saved theme preference
        function checkThemePreference() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            if(themeToggle) themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }

        // Toggle scroll to top button
        function toggleScrollTopButton() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        }

        // Scroll to top function
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // VPN/Proxy Detection Functions
        async function checkForVPN() {
            try {
                // Use ipapi.co to check IP information
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                
                // Check for common VPN/proxy indicators
                const isProxy = data.proxy || false;
                const isHosting = data.org && (
                    data.org.toLowerCase().includes('hosting') ||
                    data.org.toLowerCase().includes('data center') ||
                    data.org.toLowerCase().includes('cloud') ||
                    data.org.toLowerCase().includes('server')
                );
                
                // Check if the IP is from a known VPN provider
                const knownVPNProviders = [
                    'nordvpn', 'expressvpn', 'surfshark', 'cyberghost', 
                    'private internet access', 'hotspot shield', 'tunnelbear',
                    'windscribe', 'protonvpn', 'mullvad', 'ipvanish'
                ];
                
                const isKnownVPN = knownVPNProviders.some(provider => 
                    data.org && data.org.toLowerCase().includes(provider)
                );
                
                // Check if the timezone doesn't match the IP location
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const ipTimezone = data.timezone;
                const timezoneMismatch = timezone && ipTimezone && 
                    !timezone.toLowerCase().includes(ipTimezone.toLowerCase().substring(0, 3));
                
                // Consider it a VPN if any of these conditions are true
                isUsingVPN = isProxy || isHosting || isKnownVPN || timezoneMismatch;
                
                return isUsingVPN;
            } catch (error) {
                console.error('Error checking for VPN:', error);
                // Default to false if we can't determine
                return false;
            }
        }
        
        // reCAPTCHA Callback Functions
        function onRecaptchaSuccess(response) {
            console.log('reCAPTCHA verified successfully');
            recaptchaResponse = response;
            verificationContinue.disabled = false;
            
            // Update status to show success
            verificationStatus.className = 'verification-status success';
            verificationStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Human verification complete</span>';
        }
        
        function onRecaptchaExpired() {
            console.log('reCAPTCHA expired');
            recaptchaResponse = null;
            verificationContinue.disabled = true;
            
            // Update status to show expired
            verificationStatus.className = 'verification-status error';
            verificationStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Verification expired</span>';
        }
        
        function onRecaptchaError() {
            console.log('reCAPTCHA error');
            recaptchaResponse = null;
            verificationContinue.disabled = true;
            
            // Update status to show error
            verificationStatus.className = 'verification-status error';
            verificationStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Verification error</span>';
            
            // Show manual verification option after 5 seconds
            setTimeout(() => {
                manualVerification.style.display = 'block';
            }, 5000);
        }
        
        // Verification Modal Functions
        function showVerificationModal() {
            verificationModal.classList.add('active');
            resetVerificationModal();
            
            // Start the verification process
            checkConnectionAndShowVerification();
        }
        
        function closeVerificationModal() {
            verificationModal.classList.remove('active');
            resetVerificationModal();
        }
        
        function resetVerificationModal() {
            verificationStatus.className = 'verification-status checking';
            verificationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Checking your connection...</span>';
            vpnWarning.style.display = 'none';
            verificationContinue.disabled = true;
            recaptchaResponse = null;
            manualVerification.style.display = 'none';
            
            // Reset reCAPTCHA
            if (window.grecaptcha && recaptchaWidgetId !== null) {
                grecaptcha.reset(recaptchaWidgetId);
            }
        }
        
        async function checkConnectionAndShowVerification() {
            // Check for VPN/Proxy
            isUsingVPN = await checkForVPN();
            
            if (isUsingVPN) {
                // Show VPN warning
                verificationStatus.className = 'verification-status error';
                verificationStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>VPN/Proxy detected</span>';
                vpnWarning.style.display = 'block';
                verificationContinue.disabled = true;
            } else {
                // Show loading message
                verificationStatus.className = 'verification-status checking';
                verificationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading verification...</span>';
                
                // Render reCAPTCHA with explicit callback
                if (window.grecaptcha) {
                    try {
                        // Clear any existing reCAPTCHA
                        recaptchaElement.innerHTML = '';
                        
                        // Render new reCAPTCHA
                        recaptchaWidgetId = grecaptcha.render('recaptchaElement', {
                            'sitekey': '6LdpSvgrAAAAAEm7vYPzFAGtmO8QvpO9dJwFHNEj', // Replace with your actual key
                            'callback': onRecaptchaSuccess,
                            'expired-callback': onRecaptchaExpired,
                            'error-callback': onRecaptchaError
                        });
                        
                        // Update status after a short delay
                        setTimeout(() => {
                            if (verificationStatus.className.includes('checking')) {
                                verificationStatus.className = 'verification-status success';
                                verificationStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Connection verified - Please complete the verification below</span>';
                            }
                        }, 1000);
                    } catch (error) {
                        console.error('Error rendering reCAPTCHA:', error);
                        onRecaptchaError();
                    }
                } else {
                    // If reCAPTCHA is not loaded, wait and try again
                    setTimeout(() => {
                        if (window.grecaptcha) {
                            checkConnectionAndShowVerification();
                        } else {
                            onRecaptchaError();
                        }
                    }, 2000);
                }
            }
        }
        
        function enableManualVerification() {
            verificationStatus.className = 'verification-status success';
            verificationStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Manually verified</span>';
            verificationContinue.disabled = false;
            manualVerification.style.display = 'none';
        }
        
        function proceedWithDownload() {
            if (!currentProduct) return;
            
            // Double-check reCAPTCHA response if not manually verified
            if (!recaptchaResponse && !manualVerification.style.display === 'block') {
                verificationStatus.className = 'verification-status error';
                verificationStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Please complete the verification</span>';
                return;
            }
            
            // Track the download
            trackDownload(currentProduct.id, currentProduct.title);
            
            // Close the modal
            closeVerificationModal();
            
            // If there's a download URL, redirect to it
            if (currentProduct.downloadUrl && currentProduct.downloadUrl !== '#') {
                window.open(currentProduct.downloadUrl, '_blank');
            } else {
                // Fallback to alert
                alert(`Downloading: ${currentProduct.title}\n\nThis would typically redirect to the download page or start the download process.`);
            }
        }
        
        // Make callback functions globally accessible
        window.onRecaptchaSuccess = onRecaptchaSuccess;
        window.onRecaptchaExpired = onRecaptchaExpired;
        window.onRecaptchaError = onRecaptchaError;