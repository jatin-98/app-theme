/**
 * NATURALTEIN THEME CORE INTERACTIVITY SCRIPT
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Initialize Hero Banner Swiper
  if (document.querySelector('.Main__bannerInteriorWp')) {
    new Swiper('.Main__bannerInteriorWp', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // 2. Initialize Bestsellers Swiper
  if (document.querySelector('.home_bestseller')) {
    new Swiper('.home_bestseller', {
      slidesPerView: 1.2,
      spaceBetween: 16,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2.2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      },
    });
  }

  // 3. Initialize Top Categories Swiper
  if (document.querySelector('.swiper-container-list')) {
    new Swiper('.swiper-container-list', {
      slidesPerView: 2.2,
      spaceBetween: 16,
      navigation: {
        nextEl: '.slider-button--nexts',
        prevEl: '.slider-button--prevs',
      },
      breakpoints: {
        640: {
          slidesPerView: 3.2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 24,
        },
      },
    });
  }

  // 4. Category Tabs Swiper Sync
  if (document.querySelector('.tab_section .mySwiper') && typeof Swiper !== 'undefined') {
    const swiperEl = document.querySelector('.tab_section .mySwiper');
    if (!swiperEl.swiper) {
      const tabLinks = document.querySelectorAll('.tabs-wraperr .tablinks');
      const categorySwiper = new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 400,
        autoHeight: true,
        on: {
          slideChange: function() {
            const activeIdx = this.activeIndex;
            tabLinks.forEach((btn, i) => {
              if (i === activeIdx) {
                btn.classList.add('active');
              } else {
                btn.classList.remove('active');
              }
            });
          }
        }
      });

      tabLinks.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const slideIdx = parseInt(this.getAttribute('data-slide'), 10);
          tabLinks.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          if (categorySwiper && typeof categorySwiper.slideTo === 'function') {
            categorySwiper.slideTo(slideIdx);
          }
        });
      });
    }
  }


  // 5. Interactive Price Finder
  const findButtons = document.querySelectorAll('.spwn_btn_search');
  findButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const parent = this.closest('.SPWP-inner');
      const select = parent ? parent.querySelector('.selectwishspend') : null;
      if (select && select.value) {
        const parts = select.value.split('-');
        const min = parts[0] || '0';
        const max = parts[1] || '5000';
        window.location.href = `/collections/all?filter.v.price.gte=${min}&filter.v.price.lte=${max}`;
      } else {
        window.location.href = '/collections/all';
      }
    });
  });

  // 6. Inline Variant Select Change Logic for Product Cards
  document.querySelectorAll('.custom-productElements_variant').forEach(wrapper => {
    const selects = wrapper.querySelectorAll('select.product-variant-select');
    const variantJsonEl = wrapper.parentElement.querySelector('[data-variants-json]');
    if (!variantJsonEl) return;

    let variants = [];
    try {
      variants = JSON.parse(variantJsonEl.textContent);
    } catch (e) {
      return;
    }

    selects.forEach(sel => {
      sel.addEventListener('change', function () {
        const selectedOptions = Array.from(selects).map(s => s.value);
        const matchedVariant = variants.find(v => {
          if (!v.options) return false;
          return selectedOptions.every((opt, idx) => v.options[idx] === opt);
        });

        if (matchedVariant) {
          const card = wrapper.closest('.Main__collectionGridLoop, .card-wrapper, .product-card');
          if (card) {
            // Update variant ID in form
            const idInput = card.querySelector('input[name=\"id\"]');
            if (idInput) idInput.value = matchedVariant.id;

            // Update price
            const priceEl = card.querySelector('.product-price');
            if (priceEl && matchedVariant.price) {
              const formattedPrice = typeof matchedVariant.price === 'number' && matchedVariant.price > 10000 
                ? '₹' + (matchedVariant.price / 100).toLocaleString('en-IN')
                : '₹' + matchedVariant.price.toLocaleString('en-IN');
              priceEl.textContent = formattedPrice;
            }

            // Update compare price
            const compareEl = card.querySelector('.product-compare-price del');
            if (compareEl && matchedVariant.compare_at_price) {
              const formattedCompare = typeof matchedVariant.compare_at_price === 'number' && matchedVariant.compare_at_price > 10000
                ? '₹' + (matchedVariant.compare_at_price / 100).toLocaleString('en-IN')
                : '₹' + matchedVariant.compare_at_price.toLocaleString('en-IN');
              compareEl.textContent = formattedCompare;
            }

            // Update submit button availability
            const submitBtn = card.querySelector('.quick-add__submit');
            if (submitBtn) {
              if (matchedVariant.available) {
                submitBtn.removeAttribute('disabled');
                submitBtn.querySelector('span').textContent = 'Add to cart';
              } else {
                submitBtn.setAttribute('disabled', 'disabled');
                submitBtn.querySelector('span').textContent = 'Sold out';
              }
            }
          }
        }
      });
    });
  });

  // 7. Footer Accordions for Mobile
  document.querySelectorAll('.accordion-toggle').forEach(header => {
    header.addEventListener('click', function () {
      const content = this.nextElementSibling;
      if (content) {
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
        this.classList.toggle('active', !isOpen);
      }
    });
  });

  // 8. Video Modal Popup
  const videoBlocks = document.querySelectorAll('.video_img_grid .product-block');
  videoBlocks.forEach(block => {
    block.addEventListener('click', function () {
      const videoSrc = this.getAttribute('data-video');
      if (!videoSrc) return;

      let modal = document.getElementById('nt-video-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'nt-video-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:999999;';
        modal.innerHTML = `
          <div style=\"position:relative;width:90%;max-width:800px;background:#000;border-radius:12px;overflow:hidden;\">
            <button id=\"nt-close-modal\" style=\"position:absolute;top:12px;right:16px;background:rgba(255,255,255,0.2);color:#fff;border:none;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer;z-index:10;\">&times;</button>
            <video controls autoplay style=\"width:100%;height:auto;display:block;\"></video>
          </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#nt-close-modal').addEventListener('click', () => {
          modal.style.display = 'none';
          modal.querySelector('video').pause();
        });
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
            modal.querySelector('video').pause();
          }
        });
      }
      modal.querySelector('video').src = videoSrc;
      modal.style.display = 'flex';
      modal.querySelector('video').play();
    });
  });
});
