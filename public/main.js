const API_BASE = '';

// Smooth Mouse tracking for cards
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.tool-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Show/hide case options based on operation
const transformOp = document.getElementById('transform-operation');
if (transformOp) {
  transformOp.addEventListener('change', function() {
    const caseSelect = document.getElementById('transform-case');
    if (caseSelect) {
      caseSelect.style.display = this.value === 'case' ? 'block' : 'none';
      // Add animation when showing
      if (this.value === 'case') {
        caseSelect.style.animation = 'slideDown 0.3s ease';
      }
    }
  });
}

async function apiCall(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    // Artificial delay for "network feel" and to show off animations
    await new Promise(r => setTimeout(r, 600));
    
    const response = await fetch(API_BASE + endpoint, options);
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function showResult(elementId, content, isError = false) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  el.className = `result show ${isError ? 'error' : 'success'}`;
  el.innerHTML = content;
  
  // Re-trigger animation
  el.style.animation = 'none';
  el.offsetHeight; /* trigger reflow */
  el.style.animation = 'slideDown 0.4s ease forwards';
}

// Stats Analysis
async function analyzeStats(btn) {
  const text = document.getElementById('stats-input').value;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span>Analyzing...';
  btn.disabled = true;

  const result = await apiCall('/analyze/stats', 'POST', { text });
  
  if (result.success) {
    const d = result.data;
    showResult('stats-result', `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${d.wordCount}</div>
          <div class="stat-label">Words</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${d.sentenceCount}</div>
          <div class="stat-label">Sentences</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${d.readingTimeMinutes}</div>
          <div class="stat-label">Min Read</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${d.characterCount}</div>
          <div class="stat-label">Characters</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${d.characterCountNoSpaces}</div>
          <div class="stat-label">No Spaces</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="font-size: 1.5rem">${d.mostFrequentWord?.count || 0}</div>
          <div class="stat-label">"${d.mostFrequentWord?.word || 'N/A'}"</div>
        </div>
      </div>
    `);
  } else {
    showResult('stats-result', `<strong>Error:</strong> ${result.error}`, true);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

// Transform Text
async function transformText(btn) {
  const text = document.getElementById('transform-input').value;
  const operation = document.getElementById('transform-operation').value;
  const targetCase = document.getElementById('transform-case').value;
  
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span>Transforming...';
  btn.disabled = true;

  const body = { text, operation };
  if (operation === 'case') body.options = { targetCase };

  const result = await apiCall('/transform', 'POST', body);
  
  if (result.success) {
    showResult('transform-result', `
      <div style="margin-bottom: 8px; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Original</div>
      <div style="margin-bottom: 16px; opacity: 0.6; font-family: monospace;">${result.data.original}</div>
      <div style="margin-bottom: 8px; font-size: 0.8rem; color: var(--primary); text-transform: uppercase; letter-spacing: 1px;">Result</div>
      <div style="font-size: 1.25rem; color: #fff; font-weight: 600; font-family: monospace; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid var(--glass-border);">${result.data.result}</div>
    `);
  } else {
    showResult('transform-result', `<strong>Error:</strong> ${result.error}`, true);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

// Validate Text
async function validateText(btn) {
  const text = document.getElementById('validate-input').value;
  const type = document.getElementById('validate-type').value;
  
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span>Validating...';
  btn.disabled = true;

  const result = await apiCall('/validate', 'POST', { text, type });
  
  if (result.success) {
    const isValid = result.data.isValid;
    const typeLabels = {
      email: isValid ? 'Valid Email' : 'Invalid Email',
      url: isValid ? 'Valid URL' : 'Invalid URL',
      palindrome: isValid ? 'Is a Palindrome! ✨' : 'Not a Palindrome',
      profanity: isValid ? 'Clean Text' : 'Contains Profanity'
    };
    
    const colorClass = isValid ? 'color: #00ff88;' : 'color: #ff0055;';
    const icon = isValid ? '✅' : '❌';

    showResult('validate-result', `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 1.4rem; font-weight: 700; ${colorClass} margin-bottom: 10px;">
          ${icon} ${typeLabels[type]}
        </div>
        ${!isValid && type === 'palindrome' ? '<p style="margin-top: 12px; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">🐛 Hint: Try "racecar" vs "Race Car" - see the bug?</p>' : ''}
      </div>
    `);
  } else {
    showResult('validate-result', `<strong>Error:</strong> ${result.error}`, true);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

// Sentiment Analysis
async function analyzeSentiment(btn) {
  const text = document.getElementById('sentiment-input').value;
  
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span>Analyzing...';
  btn.disabled = true;

  const result = await apiCall('/analyze/sentiment', 'POST', { text });
  
  if (result.success) {
    const sentiment = result.data.sentiment;
    const score = result.data.score;
    const emoji = sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😞' : '😐';
    const color = sentiment === 'positive' ? '#00ff88' : sentiment === 'negative' ? '#ff0055' : '#ffcc00';
    
    showResult('sentiment-result', `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 4rem; margin-bottom: 16px; filter: drop-shadow(0 0 20px ${color}); animation: fadeUp 0.5s;">${emoji}</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: ${color}; text-transform: uppercase; letter-spacing: 2px;">
          ${sentiment}
        </div>
        <div style="margin-top: 12px; color: var(--text-muted);">
          Sentiment Score: <strong style="color: #fff">${score > 0 ? '+' : ''}${score}</strong>
        </div>
      </div>
    `);
  } else {
    showResult('sentiment-result', `<strong>Error:</strong> ${result.error}`, true);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

// Frequency Analysis
async function analyzeFrequency(btn) {
  const text = document.getElementById('frequency-input').value;
  
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span>Scanning...';
  btn.disabled = true;

  const result = await apiCall('/analyze/stats', 'POST', { text });
  
  if (result.success) {
    const word = result.data.mostFrequentWord;
    showResult('frequency-result', `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 12px;">Most Frequent Word</div>
        <div style="font-size: 3rem; color: var(--primary); font-weight: 800; text-shadow: 0 0 30px rgba(0, 242, 255, 0.4); margin-bottom: 8px;">
          "${word?.word || 'N/A'}"
        </div>
        <div style="font-size: 1.1rem; color: var(--text-muted);">
          Occurrences: <strong style="color: #fff;">${word?.count || 0}</strong>
        </div>
      </div>
    `);
  } else {
    showResult('frequency-result', `<strong>Error:</strong> ${result.error}`, true);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}

// Health Check
async function checkHealth(btn) {
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span>Checking...';
  btn.disabled = true;

  const result = await apiCall('/health');
  
  if (result.success) {
    showResult('health-result', `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 4rem; margin-bottom: 16px; animation: pulse 2s infinite;">💚</div>
        <div style="font-size: 1.4rem; color: #00ff88; font-weight: 700; margin-bottom: 8px;">System Online</div>
        <div style="font-family: monospace; font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 20px; display: inline-block;">
          ${result.data.timestamp}
        </div>
      </div>
    `);
  } else {
    showResult('health-result', `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 4rem; margin-bottom: 16px;">❌</div>
        <div style="font-size: 1.4rem; color: #ff0055; font-weight: 700; margin-bottom: 8px;">System Offline</div>
      </div>
    `, true);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
}
