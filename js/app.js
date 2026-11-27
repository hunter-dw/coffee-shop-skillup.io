/* ============ CoffeeShop — interactivity ============ */

// Replace with your actual Cloudflare Worker URL after deployment
// Example: const API_URL = 'https://coffee-shop-worker.yourname.workers.dev';
const API_URL = 'https://coffee-shop-api.aswork0611.workers.dev';

document.addEventListener('DOMContentLoaded', () => {
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ---------- toast notifications ---------- */
    const toast = $('#toast');
    let toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    /* ---------- sticky navigation ---------- */
    const nav = $('.navigation');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- dropdown menus (touch / click) ---------- */
    const dropdownParents = $$('.has-dropdown');
    const isTouch = window.matchMedia('(hover: none)').matches;

    dropdownParents.forEach(li => {
        const link = li.querySelector('a');
        link.addEventListener('click', e => {
            // On touch devices: first tap opens the menu, second tap follows the link
            if (isTouch && !li.classList.contains('open')) {
                e.preventDefault();
                dropdownParents.forEach(other => other !== li && other.classList.remove('open'));
                li.classList.add('open');
            }
        });
    });

    // Close dropdowns and search on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('.has-dropdown')) {
            dropdownParents.forEach(li => li.classList.remove('open'));
        }
        if (!e.target.closest('.search-overlay') && !e.target.closest('.search-btn')) {
            searchOverlay.classList.remove('open');
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            dropdownParents.forEach(li => li.classList.remove('open'));
            searchOverlay.classList.remove('open');
        }
    });

    /* ---------- search overlay ---------- */
    const searchOverlay = $('.search-overlay');
    const searchInput = $('.search-input');

    $('.search-btn').addEventListener('click', () => {
        const isOpen = searchOverlay.classList.toggle('open');
        if (isOpen) setTimeout(() => searchInput.focus(), 250);
    });

    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) showToast(`Search: "${query}"`);
            searchOverlay.classList.remove('open');
            searchInput.value = '';
        }
    });

    /* ---------- reveal on scroll ---------- */
    const revealEls = $$('.reveal');
    const groupCounters = new Map();
    revealEls.forEach(el => {
        const parent = el.parentElement;
        const index = groupCounters.get(parent) || 0;
        groupCounters.set(parent, index + 1);
        el.style.transitionDelay = (index % 4) * 90 + 'ms';
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));

    /* ---------- button ripple effect ---------- */
    function addRipple(e) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    $$('.btn-primary, .add-cart').forEach(btn =>
        btn.addEventListener('click', addRipple)
    );

    /* ---------- smooth scroll for data-scroll buttons ---------- */
    $$('[data-scroll]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = $(btn.dataset.scroll);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ---------- play / pause toggle ---------- */
    const playWrap = $('#hero .play');
    const playToggle = $('.play-toggle');
    const heroVideo = $('#hero-video-bg');
    const videoSource = $('#video-source');

    function updateVideoSource() {
        const newSrc = window.innerWidth <= 550 ? 'videos/makecoffee_mainphone.mp4' : 'videos/makecoffee_main.mp4';
        if (videoSource.getAttribute('src') !== newSrc) {
            videoSource.setAttribute('src', newSrc);
            heroVideo.load();
            if (playWrap.classList.contains('playing')) {
                heroVideo.play();
            }
        }
    }

    window.addEventListener('resize', updateVideoSource);
    updateVideoSource();

    playToggle.addEventListener('click', () => {
        const playing = playWrap.classList.toggle('playing');
        playToggle.classList.toggle('playing', playing);

        if (playing) {
            heroVideo.style.opacity = '1';
            heroVideo.play();
            showToast('Playing intro video…');
        } else {
            heroVideo.style.opacity = '0';
            setTimeout(() => {
                heroVideo.pause();
            }, 1000); // Wait for transition
            showToast('Video paused');
        }
    });

    /* ---------- testimonial slider ---------- */
    const STAR_SVG = `<svg width="116" height="20" viewBox="0 0 116 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" fill="#FAA61A"/>
<path d="M34 0L36.2451 6.90983H43.5106L37.6327 11.1803L39.8779 18.0902L34 13.8197L28.1221 18.0902L30.3673 11.1803L24.4894 6.90983H31.7549L34 0Z" fill="#FAA61A"/>
<path d="M58 0L60.2451 6.90983H67.5106L61.6327 11.1803L63.8779 18.0902L58 13.8197L52.1221 18.0902L54.3673 11.1803L48.4894 6.90983H55.7549L58 0Z" fill="#FAA61A"/>
<path d="M82 0L84.2451 6.90983H91.5106L85.6327 11.1803L87.8779 18.0902L82 13.8197L76.1221 18.0902L78.3673 11.1803L72.4894 6.90983H79.7549L82 0Z" fill="#FAA61A"/>
<path d="M106 0L108.245 6.90983H115.511L109.633 11.1803L111.878 18.0902L106 13.8197L100.122 18.0902L102.367 11.1803L96.4894 6.90983H103.755L106 0Z" fill="#FAA61A"/>
</svg>`;

    const PEOPLE = [
        {
            name: 'John Smith',
            role: 'Product Designer',
            img: 'images/people/john-smith.jpg',
            text: 'The best coffee in town, without a doubt. The atmosphere is cozy, the baristas know their craft, and every cup of cappuccino is a small work of art. This place has become my morning ritual.'
        },
        {
            name: 'Brett Lee',
            role: 'User Experience Designer',
            img: 'images/people/brett-lee.jpg',
            text: 'I love working here with a laptop — fast Wi-Fi, calm music and the smell of freshly roasted beans. The flat white is perfectly balanced, and the desserts are always fresh. Highly recommended.'
        },
        {
            name: 'Anna Koval',
            role: 'Coffee Blogger',
            text: 'I have visited dozens of coffee shops, and this one stands out. The beans are roasted properly, the menu is thoughtful, and the staff genuinely cares about every guest. A rare find.'
        },
        {
            name: 'Mark Davis',
            role: 'Roasting Master',
            text: 'As a roasting professional, I notice details others miss. Here the grind, the water temperature and the extraction time are all dialed in. The espresso double is honest and strong — respect.'
        },
        {
            name: 'Sofia Loren',
            role: 'Regular Guest',
            text: 'Came for a quick latte and stayed for two hours. Warm light, comfortable chairs and friendly smiles. The raf with vanilla is my favorite — delicate, creamy and not too sweet.'
        },
        {
            name: 'Daniel Kim',
            role: 'Barista',
            text: 'I know coffee from the inside, and this place keeps the bar high. Fresh beans, clean machine, consistent milk texture. If you want a benchmark cappuccino — you will find it here.'
        }
    ];

    const cardsWrap = $('#testimonial-cards');
    const counter = $('#people-counter');
    const progress = $('#people-progress');
    let slideStart = 0;

    const initials = name => name.split(' ').map(word => word[0]).join('');

    function renderTestimonials() {
        cardsWrap.innerHTML = PEOPLE.slice(slideStart, slideStart + 2).map(person => `
            <div class="card">
                <div class="image">
                    ${person.img
                        ? `<img src="${person.img}" alt="${person.name}">`
                        : `<div class="avatar-initials">${initials(person.name)}</div>`}
                </div>
                <div class="text"><p>${person.text}</p></div>
                <div class="info_rate">
                    <p>${person.name}</p>
                    <span>${person.role}</span>
                    <span class="rate">${STAR_SVG}</span>
                </div>
            </div>
        `).join('');

        const end = slideStart + 2;
        counter.textContent = `${end}/${PEOPLE.length} People`;
        progress.setAttribute('width', (end / PEOPLE.length) * 120);
    }

    $('#frame3 .testimonial .next').addEventListener('click', () => {
        slideStart = (slideStart + 2) % PEOPLE.length;
        renderTestimonials();
    });
    $('#frame3 .testimonial .back').addEventListener('click', () => {
        slideStart = (slideStart - 2 + PEOPLE.length) % PEOPLE.length;
        renderTestimonials();
    });
    renderTestimonials();

    /* ---------- cart ---------- */
    let cartTotal = 0;
    const cartCount = $('.cart-count');

    $$('.add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            cartTotal += 1;
            cartCount.textContent = cartTotal;
            cartCount.classList.remove('pop');
            void cartCount.offsetWidth; // restart pop animation
            cartCount.classList.add('pop');

            const card = btn.closest('.product-card');
            const name = card ? card.querySelector('.product-name').textContent.trim() : 'Product';
            showToast(`${name} — added to cart`);
        });
    });

    $('.basket-btn').addEventListener('click', () => {
        showToast(cartTotal > 0
            ? `In your cart: ${cartTotal} item${cartTotal > 1 ? 's' : ''}`
            : 'Your cart is empty');
    });

    /* ---------- booking form validation ---------- */
    const bookingForm = $('#booking-form');
    const bookingInputs = $$('input', bookingForm);
    const bookingBtn = $('.btn-primary', bookingForm);

    bookingInputs.forEach(input => {
        input.addEventListener('input', () => input.classList.remove('error'));
    });

    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        let isValid = true;

        bookingInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        if (!isValid) {
            showToast('Please fill in all fields');
            return;
        }

        const originalText = bookingBtn.textContent;
        bookingBtn.disabled = true;
        bookingBtn.textContent = 'SENDING...';

        // Construct the full URL. If API_URL is a placeholder, it will likely fail.
        // Once replaced with a real URL (e.g., https://...workers.dev), it will work.
        const targetUrl = API_URL === 'PLACEHOLDER_WORKER_URL' ? '/api/book-table' : API_URL;

        fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                person: bookingInputs[0].value,
                date: bookingInputs[1].value,
                time: bookingInputs[2].value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                bookingBtn.classList.add('success');
                bookingBtn.textContent = 'TABLE BOOKED';
                showToast('Table booked! We will contact you soon.');
            } else {
                throw new Error();
            }
        })
        .catch(() => {
            showToast('Error sending, try again later.');
        })
        .finally(() => {
            setTimeout(() => {
                bookingBtn.disabled = false;
                bookingBtn.classList.remove('success');
                bookingBtn.textContent = originalText;
                bookingForm.reset();
            }, 3000);
        });
    });

    /* ---------- subscribe form ---------- */
    const subscribeForm = $('#subscribe-form');
    subscribeForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = $('input', subscribeForm);
        if (!input.value.trim()) return;
        showToast('Thanks for subscribing!');
        input.value = '';
    });

    /* ---------- "view all" scrolls to menu ---------- */
    const viewAll = $('.view-all');
    if (viewAll) {
        viewAll.addEventListener('click', () => {
            const menuSection = $('#menu');
            if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
