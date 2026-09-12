/* ==========================================================================
   NEURAL A.I. ACADEMY & GALLERY - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. STATE & STORAGE MANAGEMENT
    // ----------------------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('neural_cart')) || [];
    let userPhotos = JSON.parse(localStorage.getItem('neural_user_photos')) || [];
    let soundEnabled = true;

    // Web Audio API Synthesizer Context
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
    }

    function playCyberSound(freq = 440, duration = 0.08, type = 'sine') {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context fallback silent
        }
    }

    // ----------------------------------------------------------------------
    // 2. DATASETS (5 AI COURSES & SAMPLE GALLERY)
    // ----------------------------------------------------------------------
    const coursesData = [
        {
            id: 'course-1',
            title: 'IA Mastermind: Redes Neuronales & Deep Learning Pro',
            category: 'deep-learning',
            level: 'Avanzado',
            duration: '48 Horas • 12 Módulos',
            rating: 4.9,
            price: 99.99,
            badge: 'TOP VENDIDO',
            description: 'Domina arquitecturas Transformers, PyTorch 2.0 y redes profundas desde los fundamentos matemáticos hasta el despliegue en producción.',
            syllabus: [
                'Fundamentos de tensores y cálculo de gradientes',
                'Redes Convolucionales (CNN) y Visión 2D',
                'Transformers, Mecanismos de Atención & BERT/GPT',
                'Optimización en GPU y Despliegue en Kubernetes'
            ],
            svgColor: '#00f3ff',
            svgPattern: 'neural-mesh'
        },
        {
            id: 'course-2',
            title: 'Visión por Computadora & IA Cinematográfica',
            category: 'vision',
            level: 'Intermedio',
            duration: '36 Horas • 9 Módulos',
            rating: 4.8,
            price: 89.99,
            badge: 'NUEVO',
            description: 'Creación de sistemas de seguimiento 3D, segmentación semántica en tiempo real y generación de video hiperrealista con OpenCV y CUDA.',
            syllabus: [
                'Detección de objetos con YOLOv8 y MediaPipe',
                'Reconstrucción 3D y NeRFs (Neural Radiance Fields)',
                'Generación de video fotograma a fotograma con AI',
                'Fusión de sensores y sistemas de cámara inteligentes'
            ],
            svgColor: '#9d00ff',
            svgPattern: 'cyber-eye'
        },
        {
            id: 'course-3',
            title: 'Arte Generativo & Modelos de Difusión Avanzados',
            category: 'generative',
            level: 'Todos los Niveles',
            duration: '28 Horas • 8 Módulos',
            rating: 5.0,
            price: 69.99,
            badge: 'POPULAR',
            description: 'Entrena tus propios LORAs, domina Stable Diffusion XL, Flux, ComfyUI y crea obras de arte sci-fi de resolución 8K para vender.',
            syllabus: [
                'Arquitectura de Modelos de Difusión Latente',
                'ControlNet, IP-Adapter y AnimateDiff en ComfyUI',
                'Entrenamiento de LORAs y Dreambooth personalizados',
                'Estrategias de monetización y derechos de autor'
            ],
            svgColor: '#ff007f',
            svgPattern: 'art-canvas'
        },
        {
            id: 'course-4',
            title: 'Ingeniería de Prompts & LLMs de Última Generación',
            category: 'llm',
            level: 'Principiante',
            duration: '20 Horas • 6 Módulos',
            rating: 4.9,
            price: 49.99,
            badge: 'ESENCIAL',
            description: 'Técnicas avanzadas de prompting, Chain-of-Thought, Fine-Tuning de LLMs y construcción de sistemas RAG con bases de datos vectoriales.',
            syllabus: [
                'Patrones de Prompting y Reducción de Alucinaciones',
                'Bases de Datos Vectoriales (Pinecone, ChromaDB)',
                'RAG Avanzado (Retrieval-Augmented Generation)',
                'Integración de APIs de Claude 3.5, GPT-4o & Gemini Pro'
            ],
            svgColor: '#00ffaa',
            svgPattern: 'terminal-code'
        },
        {
            id: 'course-5',
            title: 'Agentes Autónomos & Automatización IA Enterprise',
            category: 'agents',
            level: 'Avanzado',
            duration: '52 Horas • 14 Módulos',
            rating: 4.95,
            price: 119.99,
            badge: 'MASTERCLASS',
            description: 'Crea enjambres de agentes autónomos que colaboran entre sí usando LangChain, AutoGen y CrewAI para automatizar procesos complejos.',
            syllabus: [
                'Arquitectura de Agentes: Memoria, Herramientas y Planificación',
                'Orquestación Multi-Agente con AutoGen & CrewAI',
                'Integración con APIs externas y Web Scraping autónomo',
                'Caso Práctico: Agente de Trading y Análisis Financiero'
            ],
            svgColor: '#ffaa00',
            svgPattern: 'agent-core'
        }
    ];

    const initialGalleryItems = [
        {
            id: 'gal-1',
            title: 'Ciudad Cyberpunk 2099',
            author: 'NeonMaster',
            price: 29.99,
            category: 'Arte IA',
            description: 'Ilustración futurista de megatractores flotantes en un ambiente lluvioso neón.',
            imageType: 'svg-city'
        },
        {
            id: 'gal-2',
            title: 'Retrato de Androide Sintético',
            author: 'Kira Vance',
            price: 34.99,
            category: 'Retrato Futuro',
            description: 'Fotografía conceptual sci-fi con detalles cibernéticos dorados y luminiscentes.',
            imageType: 'svg-portrait'
        },
        {
            id: 'gal-3',
            title: 'Núcleo Quantum Neural',
            author: 'Dr. Cyber',
            price: 24.99,
            category: 'Texturas & FX',
            description: 'Visualización abstracta 8K de un procesador cuántico de energía pura.',
            imageType: 'svg-core'
        }
    ];

    // ----------------------------------------------------------------------
    // 3. RENDER FUNCTIONS
    // ----------------------------------------------------------------------

    // Generate SVG Visuals for Courses dynamically
    function getCourseSvg(type, color) {
        return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#070913"/>
            <defs>
                <linearGradient id="grad-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#9d00ff" stop-opacity="0.2"/>
                </linearGradient>
            </defs>
            <circle cx="200" cy="110" r="80" fill="url(#grad-${type})" opacity="0.3"/>
            <circle cx="200" cy="110" r="55" stroke="${color}" stroke-width="2" fill="none" stroke-dasharray="6 4"/>
            <path d="M 120 110 L 280 110 M 200 30 L 200 190" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
            <circle cx="200" cy="110" r="18" fill="${color}"/>
            <circle cx="150" cy="80" r="6" fill="#00f3ff"/>
            <circle cx="250" cy="80" r="6" fill="#ff007f"/>
            <circle cx="150" cy="140" r="6" fill="#00ffaa"/>
            <circle cx="250" cy="140" r="6" fill="#ffaa00"/>
            <line x1="150" y1="80" x2="200" y2="110" stroke="#00f3ff" stroke-width="1.5"/>
            <line x1="250" y1="80" x2="200" y2="110" stroke="#ff007f" stroke-width="1.5"/>
            <line x1="150" y1="140" x2="200" y2="110" stroke="#00ffaa" stroke-width="1.5"/>
            <line x1="250" y1="140" x2="200" y2="110" stroke="#ffaa00" stroke-width="1.5"/>
        </svg>`;
    }

    function getGallerySvg(type) {
        return `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#0a0d1a"/>
            <defs>
                <linearGradient id="gal-grad-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ff007f"/>
                    <stop offset="50%" stop-color="#00f3ff"/>
                    <stop offset="100%" stop-color="#9d00ff"/>
                </linearGradient>
            </defs>
            <polygon points="50,250 200,60 350,250" fill="url(#gal-grad-${type})" opacity="0.4"/>
            <circle cx="200" cy="120" r="40" fill="#00f3ff" opacity="0.6"/>
            <line x1="0" y1="250" x2="400" y2="250" stroke="#00f3ff" stroke-width="2"/>
        </svg>`;
    }

    // Render Courses
    const coursesContainer = document.getElementById('courses-container');
    function renderCourses(filter = 'all') {
        if (!coursesContainer) return;
        coursesContainer.innerHTML = '';

        const filtered = filter === 'all' 
            ? coursesData 
            : coursesData.filter(c => c.category === filter);

        filtered.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.setAttribute('data-category', course.category);

            card.innerHTML = `
                <span class="course-badge">${course.badge}</span>
                <div class="course-image-wrapper">
                    ${getCourseSvg(course.svgPattern, course.svgColor)}
                </div>
                <div class="course-body">
                    <div class="course-meta">
                        <span><i class="fa-solid fa-signal"></i> ${course.level}</span>
                        <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                    </div>
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-desc">${course.description}</p>
                    <div class="course-footer">
                        <div class="course-price">$${course.price.toFixed(2)} <small style="font-size:0.7rem;">USD</small></div>
                        <div class="course-card-actions">
                            <button class="btn btn-secondary view-course-btn" data-id="${course.id}" title="Ver Detalles">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button class="btn btn-primary add-to-cart-btn" data-id="${course.id}" data-type="course">
                                <i class="fa-solid fa-cart-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            `;
            coursesContainer.appendChild(card);
        });

        attachCourseEvents();
    }

    // Render Gallery (Combines default + uploaded user photos)
    const galleryContainer = document.getElementById('gallery-container');
    function renderGallery() {
        if (!galleryContainer) return;
        galleryContainer.innerHTML = '';

        const allItems = [...userPhotos, ...initialGalleryItems];

        allItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-card';

            const imageContent = item.imageSrc 
                ? `<img src="${item.imageSrc}" alt="${item.title}">` 
                : getGallerySvg(item.imageType || 'default');

            card.innerHTML = `
                <div class="gallery-img-wrapper">
                    ${imageContent}
                    <button class="gallery-overlay-btn share-photo-btn" data-title="${item.title}" title="Compartir Foto">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
                <div class="gallery-body">
                    <div class="gallery-meta">
                        <span class="gallery-category">${item.category || 'Galería'}</span>
                        <span class="gallery-author"><i class="fa-solid fa-user"></i> ${item.author || 'Usuario'}</span>
                    </div>
                    <h3 class="gallery-title">${item.title}</h3>
                    <div class="gallery-footer">
                        <div class="gallery-price">$${Number(item.price).toFixed(2)} USD</div>
                        <button class="btn btn-primary btn-glow-sm add-photo-cart-btn" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}">
                            <i class="fa-solid fa-cart-plus"></i> Comprar Foto
                        </button>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(card);
        });

        attachGalleryEvents();
    }

    // ----------------------------------------------------------------------
    // 4. SHOPPING CART LOGIC
    // ----------------------------------------------------------------------
    const cartBadge = document.getElementById('cart-badge-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTotalEl = document.getElementById('cart-total');

    function updateCart() {
        localStorage.setItem('neural_cart', JSON.stringify(cart));
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) cartBadge.textContent = totalItems;

        renderCartDrawer();
    }

    function renderCartDrawer() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center" style="padding: 3rem 1rem;">
                    <i class="fa-solid fa-cart-arrow-down" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p>Tu carrito está vacío.</p>
                    <small>Explora nuestros cursos de IA y fotos para añadirlos.</small>
                </div>`;
            if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00 USD';
            if (cartTotalEl) cartTotalEl.textContent = '$0.00 USD';
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-thumb">
                    <i class="fa-solid ${item.type === 'course' ? 'fa-graduation-cap' : 'fa-camera'}" style="font-size: 1.5rem; color: var(--accent-cyan); display:flex; align-items:center; justify-center; height:100%;"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} USD x ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" data-index="${index}" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        if (cartSubtotalEl) cartSubtotalEl.textContent = `$${total.toFixed(2)} USD`;
        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)} USD`;

        // Attach remove events
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1);
                playCyberSound(300, 0.05, 'square');
                updateCart();
                showToast('Elemento eliminado del carrito', 'magenta');
            });
        });
    }

    function addToCartItem(id, title, price, type) {
        const existingIndex = cart.findIndex(i => i.id === id);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ id, title, price: Number(price), type, quantity: 1 });
        }
        playCyberSound(880, 0.1, 'sine');
        updateCart();
        showToast(`¡"${title}" añadido al carrito!`, 'success');
    }

    // ----------------------------------------------------------------------
    // 5. EVENT HANDLERS & MODALS
    // ----------------------------------------------------------------------

    // Course Events
    function attachCourseEvents() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const courseId = btn.getAttribute('data-id');
                const course = coursesData.find(c => c.id === courseId);
                if (course) {
                    addToCartItem(course.id, course.title, course.price, 'course');
                }
            });
        });

        document.querySelectorAll('.view-course-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const courseId = btn.getAttribute('data-id');
                const course = coursesData.find(c => c.id === courseId);
                if (course) openCourseModal(course);
            });
        });
    }

    // Gallery Events
    function attachGalleryEvents() {
        document.querySelectorAll('.add-photo-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const title = btn.getAttribute('data-title');
                const price = btn.getAttribute('data-price');
                addToCartItem(id, `Foto: ${title}`, price, 'photo');
            });
        });

        document.querySelectorAll('.share-photo-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const title = btn.getAttribute('data-title');
                const shareData = {
                    title: `Foto en NEURAL.AI: ${title}`,
                    text: `¡Mira esta espectacular foto en venta en NEURAL.AI Academy!`,
                    url: window.location.href
                };

                if (navigator.share) {
                    try {
                        await navigator.share(shareData);
                        showToast('¡Foto compartida con éxito!', 'success');
                    } catch (err) {}
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Enlace de la foto copiado al portapapeles', 'info');
                }
            });
        });
    }

    // Category Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            playCyberSound(600, 0.05, 'triangle');
            renderCourses(filter);
        });
    });

    // Modals Management
    const cartDrawer = document.getElementById('cart-drawer');
    const cartToggle = document.getElementById('cart-toggle');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartDrawer.classList.add('active');
            playCyberSound(500, 0.08);
        });
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('active'));
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => cartDrawer.classList.remove('active'));
    }

    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCart();
            showToast('Carrito vaciado', 'magenta');
        });
    }

    // Course Detail Modal
    const courseModal = document.getElementById('course-modal');
    const courseModalContent = document.getElementById('course-modal-content');
    const closeCourseModalBtn = document.getElementById('close-course-modal');
    const courseModalOverlay = document.getElementById('course-modal-overlay');

    function openCourseModal(course) {
        if (!courseModalContent) return;

        courseModalContent.innerHTML = `
            <div class="badge-cyber">${course.badge}</div>
            <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: #fff;">${course.title}</h2>
            <p style="margin-bottom: 1.5rem; font-size: 1rem;">${course.description}</p>
            
            <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-cyber); border-radius: 8px; padding: 1.2rem; margin-bottom: 1.5rem;">
                <h4 style="color: var(--accent-cyan); margin-bottom: 0.8rem; font-size: 1rem;"><i class="fa-solid fa-list-check"></i> TEMARIO DEL CURSO</h4>
                <ul style="list-style: none; padding-left: 0;">
                    ${course.syllabus.map(s => `<li style="margin-bottom: 0.5rem; color: var(--text-muted);"><i class="fa-solid fa-check highlight" style="margin-right: 0.5rem;"></i> ${s}</li>`).join('')}
                </ul>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 700; color: var(--accent-cyan);">$${course.price.toFixed(2)} USD</div>
                <button class="btn btn-primary glow-effect" id="modal-add-cart-btn">
                    <i class="fa-solid fa-cart-plus"></i> Inscribirme Ahora
                </button>
            </div>
        `;

        courseModal.classList.add('active');
        playCyberSound(700, 0.08);

        document.getElementById('modal-add-cart-btn').addEventListener('click', () => {
            addToCartItem(course.id, course.title, course.price, 'course');
            courseModal.classList.remove('active');
        });
    }

    if (closeCourseModalBtn) closeCourseModalBtn.addEventListener('click', () => courseModal.classList.remove('active'));
    if (courseModalOverlay) courseModalOverlay.addEventListener('click', () => courseModal.classList.remove('active'));

    // Upload Photo Modal Logic
    const uploadModal = document.getElementById('upload-modal');
    const openUploadBtns = [
        document.getElementById('open-upload-modal-btn'),
        document.getElementById('nav-upload-btn'),
        document.getElementById('hero-upload-trigger'),
        document.getElementById('footer-upload-link')
    ];
    const closeUploadModalBtn = document.getElementById('close-upload-modal');
    const cancelUploadBtn = document.getElementById('cancel-upload-btn');
    const uploadModalOverlay = document.getElementById('upload-modal-overlay');

    openUploadBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                uploadModal.classList.add('active');
                playCyberSound(650, 0.08);
            });
        }
    });

    if (closeUploadModalBtn) closeUploadModalBtn.addEventListener('click', () => uploadModal.classList.remove('active'));
    if (cancelUploadBtn) cancelUploadBtn.addEventListener('click', () => uploadModal.classList.remove('active'));
    if (uploadModalOverlay) uploadModalOverlay.addEventListener('click', () => uploadModal.classList.remove('active'));

    // Image File Reader & Drag-and-Drop
    const imageDropzone = document.getElementById('image-dropzone');
    const photoFileInput = document.getElementById('photo-file-input');
    const dropzonePrompt = document.getElementById('dropzone-prompt');
    const dropzonePreview = document.getElementById('dropzone-preview');
    const imagePreviewImg = document.getElementById('image-preview-img');
    const removePreviewBtn = document.getElementById('remove-preview-btn');
    let uploadedImageDataUrl = '';

    if (imageDropzone && photoFileInput) {
        imageDropzone.addEventListener('click', (e) => {
            if (e.target !== removePreviewBtn && !removePreviewBtn.contains(e.target)) {
                photoFileInput.click();
            }
        });

        photoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleImageFile(file);
        });

        imageDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropzone.classList.add('dragover');
        });
        imageDropzone.addEventListener('dragleave', () => imageDropzone.classList.remove('dragover'));
        imageDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });
    }

    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Por favor selecciona un archivo de imagen válido', 'magenta');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImageDataUrl = e.target.result;
            imagePreviewImg.src = uploadedImageDataUrl;
            dropzonePrompt.classList.add('hidden');
            dropzonePreview.classList.remove('hidden');
            playCyberSound(800, 0.08);
        };
        reader.readAsDataURL(file);
    }

    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', () => {
            uploadedImageDataUrl = '';
            photoFileInput.value = '';
            dropzonePreview.classList.add('hidden');
            dropzonePrompt.classList.remove('hidden');
        });
    }

    // Submit Upload Photo Form
    const uploadPhotoForm = document.getElementById('upload-photo-form');
    if (uploadPhotoForm) {
        uploadPhotoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!uploadedImageDataUrl) {
                showToast('Por favor selecciona una imagen primero', 'magenta');
                return;
            }

            const title = document.getElementById('photo-title').value.trim();
            const author = document.getElementById('photo-author').value.trim();
            const price = parseFloat(document.getElementById('photo-price').value);
            const category = document.getElementById('photo-category').value;
            const description = document.getElementById('photo-desc').value.trim();

            const newPhoto = {
                id: 'user-photo-' + Date.now(),
                title,
                author,
                price,
                category,
                description,
                imageSrc: uploadedImageDataUrl
            };

            userPhotos.unshift(newPhoto);
            localStorage.setItem('neural_user_photos', JSON.stringify(userPhotos));

            renderGallery();
            uploadModal.classList.remove('active');
            uploadPhotoForm.reset();
            uploadedImageDataUrl = '';
            dropzonePreview.classList.add('hidden');
            dropzonePrompt.classList.remove('hidden');

            playCyberSound(1000, 0.15, 'sine');
            showToast('¡Tu foto se ha publicado con éxito en la galería!', 'success');
        });
    }

    // ----------------------------------------------------------------------
    // 6. CHECKOUT & WHATSAPP INTEGRATION
    // ----------------------------------------------------------------------
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutTriggerBtn = document.getElementById('checkout-trigger-btn');
    const closeCheckoutModalBtn = document.getElementById('close-checkout-modal');
    const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
    const checkoutSummaryList = document.getElementById('checkout-summary-list');
    const checkoutFinalTotal = document.getElementById('checkout-final-total');

    if (checkoutTriggerBtn) {
        checkoutTriggerBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Añade cursos o fotos a tu carrito antes de pedir', 'magenta');
                return;
            }
            openCheckoutModal();
        });
    }

    function openCheckoutModal() {
        if (!checkoutSummaryList) return;
        checkoutSummaryList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const div = document.createElement('div');
            div.className = 'checkout-summary-item';
            div.innerHTML = `
                <span>${item.title} (x${item.quantity})</span>
                <strong style="color: var(--accent-cyan);">$${itemTotal.toFixed(2)} USD</strong>
            `;
            checkoutSummaryList.appendChild(div);
        });

        if (checkoutFinalTotal) checkoutFinalTotal.textContent = `$${total.toFixed(2)} USD`;
        if (cartDrawer) cartDrawer.classList.remove('active');
        checkoutModal.classList.add('active');
        playCyberSound(750, 0.08);
    }

    if (closeCheckoutModalBtn) closeCheckoutModalBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
    if (checkoutModalOverlay) checkoutModalOverlay.addEventListener('click', () => checkoutModal.classList.remove('active'));

    // WhatsApp Order Dispatch
    const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');
    if (whatsappOrderBtn) {
        whatsappOrderBtn.addEventListener('click', () => {
            const name = document.getElementById('client-name').value.trim() || 'Cliente';
            const email = document.getElementById('client-email').value.trim() || 'No especificado';
            
            let message = `🚀 *NUEVO PEDIDO DIGITAL - NEURAL.AI ACADEMY*\n\n`;
            message += `👤 *Cliente:* ${name}\n`;
            message += `📧 *Email:* ${email}\n\n`;
            message += `🛒 *Detalle del Pedido:*\n`;

            let total = 0;
            cart.forEach((item, idx) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `${idx + 1}. ${item.title} - $${item.price.toFixed(2)} USD (x${item.quantity})\n`;
            });

            message += `\n💰 *TOTAL A PAGAR:* $${total.toFixed(2)} USD\n\n`;
            message += `Deseo proceder con el pago y obtener acceso a mis cursos/fotos.`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/51987654321?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            showToast('Redirigiendo a WhatsApp con tu pedido...', 'success');
        });
    }

    // Standard Form Submission Checkout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            cart = [];
            updateCart();
            checkoutModal.classList.remove('active');
            playCyberSound(1200, 0.2, 'sine');
            showToast('¡Pedido completado con éxito! Recibirás los accesos en tu correo.', 'success');
        });
    }

    // ----------------------------------------------------------------------
    // 7. TOAST NOTIFICATIONS & AUDIO TOGGLE
    // ----------------------------------------------------------------------
    const toastContainer = document.getElementById('toast-container');
    function showToast(msg, type = 'info') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'magenta') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.innerHTML = soundEnabled 
                ? '<i class="fa-solid fa-volume-high"></i>' 
                : '<i class="fa-solid fa-volume-xmark"></i>';
            showToast(soundEnabled ? 'Efectos de sonido ACTIVADOS' : 'Efectos de sonido DESACTIVADOS', soundEnabled ? 'info' : 'magenta');
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Initial Renders
    renderCourses();
    renderGallery();
    updateCart();

    // ----------------------------------------------------------------------
    // 8. INTERACTIVE CANVAS NEURAL NETWORK BACKGROUND
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 22), 65);
        let mouse = { x: null, y: null, radius: 140 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#00f3ff' : '#9d00ff';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interactivity
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= Math.cos(angle) * force * 2;
                        this.y -= Math.sin(angle) * force * 2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby nodes
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        const opacity = 1 - (dist / 130);
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.25})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }
});
