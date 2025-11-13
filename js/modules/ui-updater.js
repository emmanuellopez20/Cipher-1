/**
 * UI Updater - Actualiza la interfaz de usuario con los resultados del análisis
 */
export class UIUpdater {
  /**
   * Actualiza la página de ejercicio
   * @param {Object} analysis - Resultado del análisis
   */
  static updateExercise(analysis) {
    // Longitud
    const lengthEl = document.getElementById('exercise-length');
    if (lengthEl) {
      lengthEl.textContent = analysis.length;
    }

    // Variedad
    const varietyEl = document.getElementById('exercise-variety');
    if (varietyEl) {
      varietyEl.textContent = analysis.variety.description || 'Ninguno';
    }

    // Entropía
    const entropyEl = document.getElementById('exercise-entropy');
    if (entropyEl) {
      entropyEl.textContent = `${analysis.entropy.toFixed(1)} bits`;
    }

    // Tiempo de descifrado
    const crackTimeEl = document.getElementById('exercise-crack-time');
    if (crackTimeEl) {
      crackTimeEl.textContent = `~${analysis.crackTime.common}`;
    }
  }

  /**
   * Actualiza la página libre
   * @param {Object} analysis - Resultado del análisis
   */
  static updateLibre(analysis) {
    // Longitud
    const lengthEl = document.getElementById('libre-length');
    if (lengthEl) {
      lengthEl.textContent = analysis.length;
    }

    // Variedad
    const varietyEl = document.getElementById('libre-variety');
    if (varietyEl) {
      const types = [];
      if (analysis.variety.hasUppercase) types.push('Mayúsculas');
      if (analysis.variety.hasLowercase) types.push('Minúsculas');
      if (analysis.variety.hasNumbers) types.push('Números');
      if (analysis.variety.hasSymbols) types.push('Símbolos');
      
      if (types.length === 0) {
        varietyEl.textContent = 'Ninguno';
      } else {
        varietyEl.textContent = `${types.length}/4 (${types.join(', ')})`;
      }
    }

    // Entropía
    const entropyEl = document.getElementById('libre-entropy');
    if (entropyEl) {
      entropyEl.textContent = `${analysis.entropy.toFixed(1)} bits`;
    }

    // Tiempo de descifrado
    const crackTimeCommonEl = document.getElementById('libre-crack-time-common');
    if (crackTimeCommonEl) {
      crackTimeCommonEl.textContent = analysis.crackTime.common;
    }

    const crackTimeAdvancedEl = document.getElementById('libre-crack-time-advanced');
    if (crackTimeAdvancedEl) {
      crackTimeAdvancedEl.textContent = analysis.crackTime.advanced;
    }

    const crackTimeMassiveEl = document.getElementById('libre-crack-time-massive');
    if (crackTimeMassiveEl) {
      crackTimeMassiveEl.textContent = analysis.crackTime.massive;
    }

    const crackTimeQuantumEl = document.getElementById('libre-crack-time-quantum');
    if (crackTimeQuantumEl) {
      crackTimeQuantumEl.textContent = analysis.crackTime.quantum;
    }

    // Barra de fortaleza
    const strengthBarEl = document.getElementById('libre-strength-bar');
    if (strengthBarEl) {
      const percentage = analysis.strength.score;
      strengthBarEl.style.width = `${percentage}%`;
      strengthBarEl.style.backgroundColor = analysis.strength.color;
    }

    // Actualizar métricas detalladas
    const lengthDetailEl = document.getElementById('libre-length-detail');
    if (lengthDetailEl) {
      lengthDetailEl.textContent = `${analysis.length} caracteres`;
      lengthDetailEl.style.color = analysis.length >= 12 ? '#22c55e' : analysis.length >= 8 ? '#f59e0b' : '#ef4444';
    }

    const varietyDetailEl = document.getElementById('libre-variety-detail');
    if (varietyDetailEl) {
      varietyDetailEl.textContent = `${analysis.variety.count}/4 tipos`;
      varietyDetailEl.style.color = analysis.variety.count >= 3 ? '#22c55e' : analysis.variety.count >= 2 ? '#f59e0b' : '#ef4444';
    }

    const entropyDetailEl = document.getElementById('libre-entropy-detail');
    if (entropyDetailEl) {
      entropyDetailEl.textContent = `${analysis.entropy.toFixed(1)} bits`;
      entropyDetailEl.style.color = analysis.entropy >= 60 ? '#22c55e' : analysis.entropy >= 40 ? '#f59e0b' : '#ef4444';
    }

    const scoreDetailEl = document.getElementById('libre-score-detail');
    if (scoreDetailEl) {
      scoreDetailEl.textContent = `${analysis.strength.score}/100`;
      scoreDetailEl.style.color = analysis.strength.color;
    }

    // Actualizar sugerencias
    this.updateLibreSuggestions(analysis);
  }

  /**
   * Actualiza las sugerencias de mejora en modo libre
   * @param {Object} analysis - Resultado del análisis
   */
  static updateLibreSuggestions(analysis) {
    const suggestionsEl = document.getElementById('libre-suggestions');
    if (!suggestionsEl) return;

    const suggestions = [];

    // Sugerencias según el análisis
    if (analysis.length < 8) {
      suggestions.push({
        icon: 'WARNING',
        text: 'La contraseña es muy corta. Se recomienda al menos 8 caracteres.',
        priority: 'high'
      });
    } else if (analysis.length < 12) {
      suggestions.push({
        icon: 'TIP',
        text: 'Considera aumentar la longitud a 12 o más caracteres para mayor seguridad.',
        priority: 'medium'
      });
    }

    if (analysis.variety.count < 2) {
      suggestions.push({
        icon: 'WARNING',
        text: 'Agrega más tipos de caracteres (mayúsculas, minúsculas, números, símbolos).',
        priority: 'high'
      });
    } else if (analysis.variety.count < 4) {
      suggestions.push({
        icon: 'TIP',
        text: `Usa ${4 - analysis.variety.count} tipo(s) más de caracteres para aumentar la variedad.`,
        priority: 'medium'
      });
    }

    if (analysis.patterns.commonWords) {
      suggestions.push({
        icon: 'WARNING',
        text: 'Evita palabras comunes del diccionario. Usa palabras aleatorias o frases.',
        priority: 'high'
      });
    }

    if (analysis.patterns.sequences) {
      suggestions.push({
        icon: 'WARNING',
        text: 'Evita secuencias comunes (123, abc, qwerty). Usa caracteres aleatorios.',
        priority: 'high'
      });
    }

    if (analysis.patterns.repetitions) {
      suggestions.push({
        icon: 'WARNING',
        text: 'Evita repeticiones excesivas de caracteres. Usa caracteres únicos.',
        priority: 'medium'
      });
    }

    if (analysis.patterns.keyboardPatterns) {
      suggestions.push({
        icon: 'WARNING',
        text: 'Evita patrones de teclado comunes. Usa caracteres aleatorios.',
        priority: 'medium'
      });
    }

    if (suggestions.length === 0 && analysis.strength.score >= 70) {
      suggestions.push({
        icon: 'SUCCESS',
        text: 'Excelente contraseña. Mantén esta fortaleza para mayor seguridad.',
        priority: 'low'
      });
    } else if (suggestions.length === 0) {
      suggestions.push({
        icon: 'TIP',
        text: 'La contraseña es buena, pero puedes mejorarla agregando más caracteres y variedad.',
        priority: 'low'
      });
    }

    // Generar HTML de sugerencias
    suggestionsEl.innerHTML = suggestions.map(suggestion => {
      const iconMap = {
        'WARNING': '[!]',
        'TIP': '[i]',
        'SUCCESS': '[OK]'
      };
      const icon = iconMap[suggestion.icon] || '[i]';
      const colorClass = suggestion.priority === 'high' ? 'text-red-400' : 
                        suggestion.priority === 'medium' ? 'text-yellow-400' : 'text-green-400';
      return `
        <div class="flex items-start gap-2 p-3 bg-primary/5 rounded border border-primary/10">
          <span class="text-sm font-bold ${colorClass}">${icon}</span>
          <p class="text-primary/90 text-sm flex-1">${suggestion.text}</p>
        </div>
      `;
    }).join('');
  }

  /**
   * Actualiza el guided exercise para un paso específico
   * @param {number} stepNumber - Número del paso (1-4)
   * @param {Object} analysis - Resultado del análisis
   */
  static updateGuidedStep(stepNumber, analysis) {
    const stepId = `guided-step${stepNumber}`;
    
    // Actualizar entropía
    const entropyEl = document.getElementById(`${stepId}-entropy`);
    if (entropyEl) {
      entropyEl.textContent = `${analysis.entropy.toFixed(1)} bits`;
    }

    // Actualizar tiempo de crackeo
    const crackTimeEl = document.getElementById(`${stepId}-crack-time`);
    if (crackTimeEl) {
      crackTimeEl.textContent = analysis.crackTime.common;
    }

    // Actualizar fortaleza
    const strengthEl = document.getElementById(`${stepId}-strength`);
    if (strengthEl) {
      const strengthLabels = {
        'weak': 'Débil',
        'moderate': 'Moderada',
        'strong': 'Fuerte',
        'very-strong': 'Muy Fuerte'
      };
      strengthEl.textContent = `${strengthLabels[analysis.strength.level] || 'Desconocida'} (${analysis.strength.score}/100)`;
      strengthEl.style.color = analysis.strength.color;
    }

    // Actualizar iconos de candado según fortaleza
    this.updateGuidedIcons(stepNumber, analysis.strength);

    // Actualizar mensaje informativo
    this.updateGuidedInfo(stepNumber, analysis);
  }

  /**
   * Actualiza los iconos de candado del guided exercise
   * @param {number} stepNumber - Número del paso (1-4)
   * @param {Object} strength - Información de fortaleza
   */
  static updateGuidedIcons(stepNumber, strength) {
    const stepId = `guided-step${stepNumber}`;
    const icon1 = document.getElementById(`${stepId}-icon1`);
    const icon2 = document.getElementById(`${stepId}-icon2`);
    const icon3 = document.getElementById(`${stepId}-icon3`);

    // Determinar colores según fortaleza
    let color1, color2, color3;
    
    if (strength.score < 30) {
      // Débil - rojo
      color1 = '#ef4444'; // lock_open rojo
      color2 = '#6b7280'; // lock_person gris
      color3 = '#6b7280'; // lock gris
    } else if (strength.score < 50) {
      // Moderada - amarillo/naranja
      color1 = '#6b7280'; // lock_open gris
      color2 = '#f59e0b'; // lock_person amarillo
      color3 = '#6b7280'; // lock gris
    } else if (strength.score < 70) {
      // Fuerte - amarillo/verde
      color1 = '#6b7280'; // lock_open gris
      color2 = '#6b7280'; // lock_person gris
      color3 = '#eab308'; // lock amarillo
    } else {
      // Muy fuerte - verde
      color1 = '#6b7280'; // lock_open gris
      color2 = '#6b7280'; // lock_person gris
      color3 = '#22c55e'; // lock verde
    }

    // Aplicar colores
    if (icon1) {
      icon1.style.color = color1;
    }
    if (icon2) {
      icon2.style.color = color2;
    }
    if (icon3) {
      icon3.style.color = color3;
    }
  }

  /**
   * Actualiza el mensaje informativo del guided exercise
   * @param {number} stepNumber - Número del paso (1-4)
   * @param {Object} analysis - Resultado del análisis
   */
  static updateGuidedInfo(stepNumber, analysis) {
    const infoEl = document.getElementById(`guided-step${stepNumber}-info`);
    if (!infoEl) return;

    // Mensajes contextuales según el análisis
    let message = '[INFO] ';
    
    if (analysis.length < 8) {
      message += 'La contraseña es muy corta. Se recomienda al menos 8 caracteres.';
    } else if (analysis.variety.count < 2) {
      message += 'Agrega más tipos de caracteres para aumentar la fortaleza.';
    } else if (analysis.patterns.commonWords) {
      message += '[!] Evita palabras comunes del diccionario.';
    } else if (analysis.patterns.sequences) {
      message += '[!] Evita secuencias comunes (123, abc, qwerty).';
    } else if (analysis.patterns.repetitions) {
      message += '[!] La repetición de caracteres no aumenta mucho la fortaleza.';
    } else if (analysis.strength.score >= 70) {
      message += '[OK] Contraseña muy fuerte. Excelente trabajo.';
    } else if (analysis.strength.score >= 50) {
      message += '[OK] Contraseña fuerte. La complejidad ha aumentado significativamente.';
    } else if (analysis.strength.score >= 30) {
      message += '[!] Contraseña moderada. Considera mejorarla.';
    } else {
      message += '[X] Contraseña débil. Se recomienda cambiarla.';
    }

    // Actualizar mensaje
    infoEl.textContent = message;
    
    // Cambiar color según fortaleza
    if (analysis.strength.score >= 70) {
      infoEl.className = 'text-green-400 text-sm font-normal leading-normal pt-1 px-4';
    } else if (analysis.strength.score >= 50) {
      infoEl.className = 'text-yellow-400 text-sm font-normal leading-normal pt-1 px-4';
    } else if (analysis.strength.score >= 30) {
      infoEl.className = 'text-orange-400 text-sm font-normal leading-normal pt-1 px-4';
    } else {
      infoEl.className = 'text-red-400 text-sm font-normal leading-normal pt-1 px-4';
    }
  }

  /**
   * Actualiza cualquier página con análisis
   * @param {string} pageId - ID de la página
   * @param {Object} analysis - Resultado del análisis
   */
  static update(pageId, analysis) {
    switch(pageId) {
      case 'exercise':
        this.updateExercise(analysis);
        break;
      case 'libre':
        this.updateLibre(analysis);
        break;
      default:
        console.warn(`No UI updater for page: ${pageId}`);
    }
  }
}

