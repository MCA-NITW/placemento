// Animation utilities for scroll-based animations and interactive effects

export const initScrollAnimations = () => {
	// Create intersection observer for reveal-on-scroll elements
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('revealed');
				// Optional: Stop observing after animation
				// observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe all elements with reveal-on-scroll class
	const revealElements = document.querySelectorAll('.reveal-on-scroll');
	revealElements.forEach((el) => observer.observe(el));

	return observer;
};

export const addStaggeredAnimations = (elements, baseClass, delay = 100) => {
	elements.forEach((element, index) => {
		element.classList.add(baseClass);
		element.style.animationDelay = `${index * delay}ms`;
	});
};

export const addHoverEffects = () => {
	// Add interactive hover effects to cards and buttons
	const interactiveElements = document.querySelectorAll('.interactive-element, .card-animate, .hover-lift');

	interactiveElements.forEach((element) => {
		element.addEventListener('mouseenter', function () {
			this.style.transform = 'translateY(-5px) scale(1.02)';
		});

		element.addEventListener('mouseleave', function () {
			this.style.transform = 'translateY(0) scale(1)';
		});
	});
};

export const initPageTransitions = () => {
	// Add page transition effects
	const containers = document.querySelectorAll('.container');
	containers.forEach((container) => {
		container.classList.add('page-transition');
	});
};

export const animateOnLoad = () => {
	// Animate elements when page loads
	const elements = document.querySelectorAll('[class*="animate-"]');
	elements.forEach((element, index) => {
		// Add slight delay for staggered effect
		setTimeout(() => {
			element.style.animationPlayState = 'running';
		}, index * 50);
	});
};

export const initCounterAnimations = () => {
	// Animate number counters
	const counters = document.querySelectorAll('.counter, .stat-number');

	const animateCounter = (counter) => {
		const target = parseInt(counter.textContent);
		const duration = 2000; // 2 seconds
		const start = 0;
		const increment = target / (duration / 16); // 60fps
		let current = start;

		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				counter.textContent = target;
				clearInterval(timer);
			} else {
				counter.textContent = Math.floor(current);
			}
		}, 16);
	};

	const counterObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				animateCounter(entry.target);
				counterObserver.unobserve(entry.target);
			}
		});
	});

	counters.forEach((counter) => counterObserver.observe(counter));
};

export const addProgressBarAnimations = () => {
	// Animate progress bars
	const progressBars = document.querySelectorAll('.progress-bar, .loading-bar');

	progressBars.forEach((bar) => {
		const width = bar.dataset.width || '100%';
		bar.style.width = '0%';

		setTimeout(() => {
			bar.style.width = width;
		}, 500);
	});
};

export const initParallaxEffects = () => {
	// Simple parallax scrolling effect
	window.addEventListener('scroll', () => {
		const scrolled = window.pageYOffset;
		const parallaxElements = document.querySelectorAll('.parallax');

		parallaxElements.forEach((element) => {
			const rate = scrolled * -0.5;
			element.style.transform = `translateY(${rate}px)`;
		});
	});
};

export const addClickAnimations = () => {
	// Add click animations to buttons and interactive elements
	const clickables = document.querySelectorAll('button, .btn, .clickable');

	clickables.forEach((element) => {
		element.addEventListener('click', function (e) {
			// Create ripple effect
			const ripple = document.createElement('span');
			ripple.classList.add('ripple');

			const rect = this.getBoundingClientRect();
			const size = Math.max(rect.width, rect.height);
			const x = e.clientX - rect.left - size / 2;
			const y = e.clientY - rect.top - size / 2;

			ripple.style.width = ripple.style.height = size + 'px';
			ripple.style.left = x + 'px';
			ripple.style.top = y + 'px';

			this.appendChild(ripple);

			// Add pulse animation
			this.classList.add('animate-pulse');
			setTimeout(() => {
				this.classList.remove('animate-pulse');
				if (ripple.parentNode) {
					ripple.parentNode.removeChild(ripple);
				}
			}, 600);
		});
	});
};

// Initialize all animations
export const initAllAnimations = () => {
	// Wait for DOM to be ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			initScrollAnimations();
			addHoverEffects();
			initPageTransitions();
			animateOnLoad();
			initCounterAnimations();
			addProgressBarAnimations();
			initParallaxEffects();
			addClickAnimations();
		});
	} else {
		initScrollAnimations();
		addHoverEffects();
		initPageTransitions();
		animateOnLoad();
		initCounterAnimations();
		addProgressBarAnimations();
		initParallaxEffects();
		addClickAnimations();
	}
};

// CSS for ripple effect
export const addRippleCSS = () => {
	const style = document.createElement('style');
	style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 204, 102, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
	document.head.appendChild(style);
};

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
	addRippleCSS();
	initAllAnimations();
}
