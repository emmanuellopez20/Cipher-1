/**
 * Router - Navegación entre páginas en SPA
 */
export class Router {
  constructor() {
    this.currentPage = 'splash';
    this.init();
  }

  /**
   * Inicializa el router
   */
  init() {
    // Manejar hash changes
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.slice(1) || 'splash';
      this.navigate(page);
    });

    // Manejar popstate (botones atrás/adelante)
    window.addEventListener('popstate', () => {
      const page = window.location.hash.slice(1) || 'splash';
      this.navigate(page);
    });

    // Navegar a página inicial
    const initialPage = window.location.hash.slice(1) || 'splash';
    this.navigate(initialPage);

    // Inicializar navegación por data attributes
    this.initNavigation();
  }

  /**
   * Inicializa la navegación mediante data attributes
   */
  initNavigation() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-navigate]');
      if (target) {
        e.preventDefault();
        const pageId = target.getAttribute('data-navigate');
        this.navigate(pageId);
      }
    });
  }

  /**
   * Navega a una página específica
   * @param {string} pageId - ID de la página a navegar
   * @param {boolean} useSlideAnimation - Usar animación de slide (para splash -> home)
   */
  navigate(pageId, useSlideAnimation = false) {
    // Validar que la página existe
    const page = document.getElementById(pageId);
    if (!page) {
      console.error(`Page ${pageId} not found`);
      return;
    }

    // Ocultar página actual
    const currentPage = document.querySelector('.page.active');
    
    // Si es transición de splash a home, usar animación de slide
    if (useSlideAnimation && this.currentPage === 'splash' && pageId === 'home') {
      this.slideToHome(currentPage, page);
      return;
    }

    if (currentPage) {
      currentPage.classList.remove('active');
    }

    // Mostrar nueva página
    page.classList.add('active');
    this.currentPage = pageId;

    // Actualizar URL sin recargar
    if (window.location.hash !== `#${pageId}`) {
      window.history.pushState({ page: pageId }, '', `#${pageId}`);
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Ejecutar callbacks de página
    this.onPageChange(pageId);
  }

  /**
   * Animación de slide desde splash a home
   * @param {HTMLElement} splashPage - Elemento de la página splash
   * @param {HTMLElement} homePage - Elemento de la página home
   */
  slideToHome(splashPage, homePage) {
    // Prevenir scroll durante la animación
    document.body.classList.add('sliding');
    
    // Asegurar que home esté preparada
    if (!homePage.classList.contains('preparing')) {
      homePage.style.display = 'block';
      homePage.style.position = 'fixed';
      homePage.style.top = '0';
      homePage.style.left = '0';
      homePage.style.width = '100%';
      homePage.style.minHeight = '100vh';
      homePage.style.zIndex = '5';
      homePage.style.transform = 'translateY(100%)';
      homePage.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      homePage.classList.add('preparing');
    }
    
    // Forzar reflow para aplicar estilos
    homePage.offsetHeight;
    
    // Animar splash hacia arriba
    splashPage.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    splashPage.classList.add('sliding');
    splashPage.style.transform = 'translateY(-100%)';
    
    // Animar home desde abajo simultáneamente
    requestAnimationFrame(() => {
      homePage.classList.add('show');
      homePage.style.transform = 'translateY(0)';
    });
    
    // Limpiar después de la animación (600ms)
    setTimeout(() => {
      // Remover clases de animación de splash
      splashPage.classList.remove('active', 'sliding');
      splashPage.style.transform = '';
      splashPage.style.transition = '';
      
      // Preparar home para estado normal
      homePage.classList.remove('preparing', 'show');
      homePage.classList.add('active');
      homePage.style.transform = '';
      homePage.style.transition = '';
      homePage.style.position = '';
      homePage.style.zIndex = '';
      homePage.style.display = '';
      homePage.style.top = '';
      homePage.style.left = '';
      homePage.style.width = '';
      homePage.style.minHeight = '';
      
      // Remover clase de body
      document.body.classList.remove('sliding');
      
      // Actualizar estado
      this.currentPage = 'home';
      
      // Actualizar URL
      if (window.location.hash !== '#home') {
        window.history.pushState({ page: 'home' }, '', '#home');
      }

      // Scroll to top
      window.scrollTo(0, 0);

      // Ejecutar callbacks de página
      this.onPageChange('home');
    }, 600);
  }

  /**
   * Callback cuando cambia la página
   * @param {string} pageId - ID de la página actual
   */
  onPageChange(pageId) {
    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('pagechange', { 
      detail: { page: pageId } 
    }));

    // Callbacks específicos por página
    switch(pageId) {
      case 'splash':
        this.initSplash();
        break;
      case 'home':
        this.initHome();
        break;
      case 'intro':
        this.initIntro();
        break;
      case 'exercise':
        this.initExercise();
        break;
      case 'guidedexe':
        this.initGuidedExe();
        break;
      case 'comparison':
        this.initComparison();
        break;
      case 'libre':
        this.initLibre();
        break;
      case 'fin':
        this.initFin();
        break;
    }
  }

  /**
   * Inicializa la página splash
   */
  initSplash() {
    console.log('Splash page initialized');
    const splashPage = document.getElementById('splash');
    const splashMain = splashPage?.querySelector('main');
    const homePage = document.getElementById('home');
    if (!splashPage || !splashMain || !homePage) return;

    // Variables para detectar gestos
    let touchStartY = 0;
    let touchEndY = 0;
    let isDragging = false;
    let startTime = 0;
    const scrollThreshold = 80; // Píxeles necesarios para activar el slide
    const velocityThreshold = 0.3; // Velocidad mínima para activar el slide
    let homeVisible = false;

    // Preparar home para que esté lista para aparecer
    const prepareHome = () => {
      if (homeVisible) return;
      homePage.style.display = 'block';
      homePage.style.position = 'fixed';
      homePage.style.top = '0';
      homePage.style.left = '0';
      homePage.style.width = '100%';
      homePage.style.minHeight = '100vh';
      homePage.style.zIndex = '5';
      homePage.style.transform = 'translateY(100%)';
      homePage.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      homeVisible = true;
    };

    // Función para actualizar posición durante el drag
    const updateSlidePosition = (deltaY) => {
      if (deltaY <= 0) return;
      
      const progress = Math.min(deltaY / 300, 1);
      const splashTranslate = -progress * 100;
      const homeTranslate = (1 - progress) * 100;
      
      // Mover splash hacia arriba
      splashPage.style.transform = `translateY(${splashTranslate}%)`;
      
      // Mover home desde abajo (solo si el progreso es suficiente)
      if (progress > 0.1) {
        prepareHome();
        homePage.style.transform = `translateY(${homeTranslate}%)`;
      }
    };

    // Función para resetear posición
    const resetPosition = () => {
      splashPage.style.transition = 'transform 0.3s ease-out';
      splashPage.style.transform = 'translateY(0)';
      
      if (homeVisible) {
        homePage.style.transition = 'transform 0.3s ease-out';
        homePage.style.transform = 'translateY(100%)';
      }
    };

    // Detectar touch start (móvil)
    splashMain.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      startTime = Date.now();
      isDragging = true;
      splashPage.style.transition = 'none';
      if (homeVisible) {
        homePage.style.transition = 'none';
      }
    }, { passive: true });

    // Detectar touch move (móvil)
    splashMain.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      // Si el usuario desliza hacia arriba
      if (deltaY > 0) {
        e.preventDefault();
        updateSlidePosition(deltaY);
      }
    }, { passive: false });

    // Detectar touch end (móvil)
    splashMain.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const deltaY = touchStartY - touchEndY;
      const deltaTime = Date.now() - startTime;
      const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;
      
      // Si el usuario desliza hacia arriba con suficiente distancia o velocidad
      if (deltaY > scrollThreshold || (deltaY > 30 && velocity > velocityThreshold)) {
        // Completar la animación
        this.navigate('home', true);
      } else {
        // Volver a la posición original
        resetPosition();
      }
      
      isDragging = false;
    }, { passive: true });

    // Detectar scroll con rueda del mouse (desktop)
    let wheelDelta = 0;
    let wheelTimeout = null;
    splashMain.addEventListener('wheel', (e) => {
      // Si el usuario hace scroll hacia arriba
      if (e.deltaY < 0) {
        e.preventDefault();
        wheelDelta += Math.abs(e.deltaY);
        
        // Mostrar home progresivamente mientras se hace scroll
        const progress = Math.min(wheelDelta / 200, 1);
        updateSlidePosition(progress * 300);
        
        // Si el scroll es suficiente, completar la transición
        if (wheelDelta > 100) {
          if (wheelTimeout) {
            clearTimeout(wheelTimeout);
          }
          wheelTimeout = setTimeout(() => {
            this.navigate('home', true);
            wheelDelta = 0;
          }, 150);
        }
      }
    }, { passive: false });

    // Detectar teclas de flecha hacia arriba
    const handleKeyDown = (e) => {
      if (this.currentPage === 'splash' && (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === ' ')) {
        e.preventDefault();
        this.navigate('home', true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Guardar referencia para poder remover el listener después
    splashPage._keyHandler = handleKeyDown;

    // Detectar click/tap en el indicador de scroll
    const scrollIndicator = splashPage.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.pointerEvents = 'auto';
      scrollIndicator.style.cursor = 'pointer';
      scrollIndicator.addEventListener('click', () => {
        this.navigate('home', true);
      });
    }
  }

  /**
   * Inicializa la página home
   */
  initHome() {
    console.log('Home page initialized');
    
    // Remover listener de teclado de splash si existe
    const splashPage = document.getElementById('splash');
    if (splashPage && splashPage._keyHandler) {
      document.removeEventListener('keydown', splashPage._keyHandler);
      delete splashPage._keyHandler;
    }
  }

  /**
   * Inicializa la página intro
   */
  initIntro() {
    console.log('Intro page initialized');
    // El manejo del input de nombre se hace en app.js
  }

  /**
   * Inicializa la página exercise
   */
  initExercise() {
    console.log('Exercise page initialized');
    // El análisis de contraseñas se hace en app.js
  }

  /**
   * Inicializa la página guided exercise
   */
  initGuidedExe() {
    console.log('Guided exercise page initialized');
    // El análisis de contraseñas se hace en app.js
  }

  /**
   * Inicializa la página comparison
   */
  initComparison() {
    console.log('Comparison page initialized');
  }

  /**
   * Inicializa la página libre
   */
  initLibre() {
    console.log('Libre page initialized');
    // El análisis de contraseñas se hace en app.js
  }

  /**
   * Inicializa la página fin
   */
  initFin() {
    console.log('Fin page initialized');
  }
}

