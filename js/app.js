/**
 * App - Punto de entrada principal de la aplicación
 */
import { Router } from './router.js';
import { Storage } from './utils/storage.js';
import { PasswordAnalyzer } from './modules/password-analyzer.js';
import { UIUpdater } from './modules/ui-updater.js';

// Inicializar router
const router = new Router();

// Función de debounce para optimizar análisis en tiempo real
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Analizar contraseña y actualizar UI
function analyzePassword(password, pageId) {
  const analysis = PasswordAnalyzer.analyze(password);
  UIUpdater.update(pageId, analysis);
  return analysis;
}

// Debounced analyze para optimizar
const debouncedAnalyze = debounce(analyzePassword, 300);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('Cipher app initialized');

  // Manejar página intro - Input de nombre
  const userNameInput = document.getElementById('user-name-input');
  const introMessage = document.getElementById('intro-message');
  const userNameDisplay = document.getElementById('user-name-display');
  
  if (userNameInput && introMessage && userNameDisplay) {
    userNameInput.addEventListener('input', (e) => {
      const name = e.target.value.trim();
      if (name.length > 0) {
        // Guardar nombre en localStorage
        Storage.set('userName', name);
        
        // Mostrar mensaje
        userNameDisplay.textContent = name;
        introMessage.classList.remove('hidden');
      } else {
        introMessage.classList.add('hidden');
      }
    });

    userNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value.trim().length > 0) {
        router.navigate('exercise');
      }
    });

    // Cargar nombre guardado si existe
    const savedName = Storage.get('userName');
    if (savedName) {
      userNameInput.value = savedName;
      userNameDisplay.textContent = savedName;
      introMessage.classList.remove('hidden');
    }
  }

  // Manejar página exercise - Análisis de contraseña
  const exercisePasswordInput = document.getElementById('exercise-password-input');
  if (exercisePasswordInput) {
    // Análisis inicial
    analyzePassword(exercisePasswordInput.value, 'exercise');

    // Análisis en tiempo real
    exercisePasswordInput.addEventListener('input', (e) => {
      debouncedAnalyze(e.target.value, 'exercise');
    });
  }

  // Manejar página libre - Análisis de contraseña
  const librePasswordInput = document.getElementById('libre-password-input');
  const libreToggleVisibility = document.getElementById('libre-toggle-visibility');
  
  if (librePasswordInput) {
    // Análisis inicial
    analyzePassword(librePasswordInput.value, 'libre');

    // Análisis en tiempo real
    librePasswordInput.addEventListener('input', (e) => {
      debouncedAnalyze(e.target.value, 'libre');
    });
  }

  // Manejar toggle de visibilidad en página libre
  if (libreToggleVisibility && librePasswordInput) {
    libreToggleVisibility.addEventListener('click', () => {
      const type = librePasswordInput.getAttribute('type');
      if (type === 'password') {
        librePasswordInput.setAttribute('type', 'text');
        libreToggleVisibility.querySelector('span').textContent = 'visibility_off';
      } else {
        librePasswordInput.setAttribute('type', 'password');
        libreToggleVisibility.querySelector('span').textContent = 'visibility';
      }
    });
  }

  // Manejar ejercicios guiados
  const guidedInputs = ['guided-step1', 'guided-step2', 'guided-step3', 'guided-step4'];
  const guidedHandlers = new Map();
  
  // Función para inicializar guided exercise
  function initGuidedExercise() {
    guidedInputs.forEach((inputId, index) => {
      const input = document.getElementById(inputId);
      if (input) {
        // Remover listener anterior si existe
        if (guidedHandlers.has(inputId)) {
          input.removeEventListener('input', guidedHandlers.get(inputId));
        }

        // Análisis inicial
        const initialAnalysis = PasswordAnalyzer.analyze(input.value);
        UIUpdater.updateGuidedStep(index + 1, initialAnalysis);

        // Crear handler para análisis en tiempo real
        const handler = (e) => {
          const analysis = PasswordAnalyzer.analyze(e.target.value);
          UIUpdater.updateGuidedStep(index + 1, analysis);
        };

        // Guardar handler y agregar listener
        guidedHandlers.set(inputId, handler);
        input.addEventListener('input', handler);
      }
    });
  }

  // Inicializar guided exercise
  initGuidedExercise();

  // Escuchar cambios de página
  window.addEventListener('pagechange', (e) => {
    const pageId = e.detail.page;
    console.log(`Page changed to: ${pageId}`);

    // Re-analizar contraseñas cuando se cambia de página
    if (pageId === 'exercise' && exercisePasswordInput) {
      analyzePassword(exercisePasswordInput.value, 'exercise');
    }
    if (pageId === 'libre' && librePasswordInput) {
      analyzePassword(librePasswordInput.value, 'libre');
    }
    if (pageId === 'guidedexe') {
      // Re-analizar todos los pasos del guided exercise
      initGuidedExercise();
    }
  });
});

// Exportar router para uso global
window.router = router;

