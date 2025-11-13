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
   */
  navigate(pageId) {
    // Validar que la página existe
    const page = document.getElementById(pageId);
    if (!page) {
      console.error(`Page ${pageId} not found`);
      return;
    }

    // Ocultar página actual
    const currentPage = document.querySelector('.page.active');
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
    // Auto-navegar a home después de 3 segundos solo si no hay hash en la URL
    if (!window.location.hash || window.location.hash === '#splash') {
      setTimeout(() => {
        if (this.currentPage === 'splash') {
          this.navigate('home');
        }
      }, 3000);
    }
  }

  /**
   * Inicializa la página home
   */
  initHome() {
    console.log('Home page initialized');
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

