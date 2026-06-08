(() => {
    function setupCanvas(canvasId, particleCount = 80, lineDistance = 150) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();

        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
        }));

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

                ctx.fillStyle = `rgba(52, 152, 219, ${particle.size / 3})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const nextParticle = particles[j];
                    const distance = Math.hypot(
                        particle.x - nextParticle.x,
                        particle.y - nextParticle.y,
                    );

                    if (distance < lineDistance) {
                        ctx.strokeStyle = `rgba(52, 152, 219, ${1 - distance / lineDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(nextParticle.x, nextParticle.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        animate();
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupCanvas('headerCanvas', 100, 200);
        setupCanvas('aboutCanvas');
        setupCanvas('experienceCanvas');
        setupCanvas('projectsCanvas');
        setupCanvas('skillsCanvas');
        setupCanvas('contactCanvas');

        const menuToggle = document.querySelector('.menu-toggle');
        const menuIcon = menuToggle?.querySelector('i');
        const navLinks = document.querySelector('.nav-links');

        const closeMobileMenu = () => {
            navLinks?.classList.remove('active');
            menuIcon?.classList.remove('fa-times');
            menuIcon?.classList.add('fa-bars');
        };

        menuToggle?.addEventListener('click', () => {
            navLinks?.classList.toggle('active');
            menuIcon?.classList.toggle('fa-bars');
            menuIcon?.classList.toggle('fa-times');
        });

        document.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const targetId = anchor.getAttribute('href');
                if (!targetId) return;

                event.preventDefault();

                if (targetId === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth',
                });

                document.querySelectorAll('.nav-links a').forEach((link) => {
                    link.classList.toggle('active', link === anchor);
                });
            });
        });

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;

            document.querySelectorAll('section').forEach((section) => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                    });
                }
            });
        });

        const backToTopButton = document.querySelector('.back-to-top');

        window.addEventListener('scroll', () => {
            backToTopButton?.classList.toggle('active', window.pageYOffset > 300);
        });

        backToTopButton?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const timelineItems = document.querySelectorAll('.timeline-item');

        function checkTimelineItems() {
            timelineItems.forEach((item) => {
                if (item.getBoundingClientRect().top < window.innerHeight - 100) {
                    item.classList.add('visible');
                }
            });
        }

        window.addEventListener('scroll', checkTimelineItems);
        checkTimelineItems();

        const skillBars = document.querySelectorAll('.skill-progress');

        function animateSkillBars() {
            skillBars.forEach((bar) => {
                const width = bar.style.width;
                bar.style.width = '0';

                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }

        const skillsSection = document.querySelector('#skills');
        if (skillsSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(skillsSection);
        }

        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        const submitButton = document.getElementById('submitButton');
        const humanCheck = document.getElementById('humanCheck');

        function showFormStatus(type, iconClass, message) {
            if (!formStatus) return;

            formStatus.className = `form-status ${type} is-visible`;
            formStatus.innerHTML = `
                <span class="status-icon"><i class="${iconClass}"></i></span>
                <span>${message}</span>
            `;
        }

        contactForm?.addEventListener('submit', async function handleSubmit(event) {
            event.preventDefault();

            if (!humanCheck?.checked) {
                showFormStatus(
                    'error',
                    'fas fa-robot',
                    'Please confirm that you are not a robot before sending.',
                );
                humanCheck?.focus();
                return;
            }

            const originalButtonText = submitButton?.textContent || 'Send Message';
            const formData = new FormData(this);

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            showFormStatus('info', 'fas fa-paper-plane', 'Sending your message...');

            try {
                await fetch(this.action, {
                    method: this.method,
                    body: formData,
                    mode: 'no-cors',
                });

                this.reset();
                showFormStatus(
                    'success',
                    'fas fa-check',
                    'Thank you! Your message was sent successfully.',
                );
            } catch (error) {
                showFormStatus(
                    'error',
                    'fas fa-exclamation-triangle',
                    'Sorry, your message could not be sent. Please email me directly at sudeepyadav5@gmail.com.',
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    });
})();
