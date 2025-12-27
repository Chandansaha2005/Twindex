/**
 * Twindex Frontend - Health Trajectory Simulator
 * Handles form input, prompt construction, and API communication
 */

// ============================================================================
// SLIDER VALUE SYNCHRONIZATION
// ============================================================================
function initializeSliderListeners() {
    // Age slider
    document.getElementById('age').addEventListener('input', (e) => {
        document.getElementById('ageValue').textContent = Math.round(e.target.value);
    });

    // Height slider
    document.getElementById('height').addEventListener('input', (e) => {
        document.getElementById('heightValue').textContent = Math.round(e.target.value);
        updateBMI();
    });

    // Weight slider
    document.getElementById('weight').addEventListener('input', (e) => {
        document.getElementById('weightValue').textContent = Math.round(e.target.value);
        updateBMI();
    });

    // Sleep slider
    document.getElementById('sleep').addEventListener('input', (e) => {
        document.getElementById('sleepValue').textContent = parseFloat(e.target.value).toFixed(1);
    });

    // Daily Steps slider
    document.getElementById('dailySteps').addEventListener('input', (e) => {
        document.getElementById('stepsValue').textContent = Math.round(e.target.value).toLocaleString();
    });

    // Target Sleep slider
    document.getElementById('targetSleep').addEventListener('input', (e) => {
        document.getElementById('targetSleepValue').textContent = parseFloat(e.target.value).toFixed(1);
    });

    // Target Steps slider
    document.getElementById('targetSteps').addEventListener('input', (e) => {
        document.getElementById('targetStepsValue').textContent = Math.round(e.target.value).toLocaleString();
    });

    // Duration slider
    document.getElementById('duration').addEventListener('input', (e) => {
        document.getElementById('durationValue').textContent = e.target.value;
    });

    // Fasting Glucose slider
    document.getElementById('fastingGlucose').addEventListener('input', (e) => {
        document.getElementById('glucoseValue').textContent = Math.round(e.target.value);
        updateGlucoseStatus();
    });

    // HbA1c slider
    document.getElementById('hbA1c').addEventListener('input', (e) => {
        document.getElementById('hba1cValue').textContent = parseFloat(e.target.value).toFixed(1);
        updateHbA1cStatus();
    });
}

// ============================================================================
// BMI CALCULATION & STATUS
// ============================================================================
function updateBMI() {
    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);

    if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(1);
        document.getElementById('bmiNumber').textContent = bmi;

        // Determine BMI status
        let status, emoji;
        if (bmi < 18.5) {
            status = 'Underweight';
            emoji = '⚠️';
        } else if (bmi < 25) {
            status = 'Normal Weight';
            emoji = '✅';
        } else if (bmi < 30) {
            status = 'Overweight';
            emoji = '⚠️';
        } else {
            status = 'Obese';
            emoji = '🔴';
        }

        document.getElementById('bmiStatus').textContent = status;
        document.getElementById('bmiEmoji').textContent = emoji;
    }
}

// ============================================================================
// HEALTH STATUS UPDATES
// ============================================================================
function updateGlucoseStatus() {
    const glucose = parseFloat(document.getElementById('fastingGlucose').value);
    const statusEl = document.getElementById('glucoseStatus');

    let status, className;
    if (glucose < 100) {
        status = '✓ Normal';
        className = 'normal';
    } else if (glucose < 126) {
        status = '⚠ At Risk (Prediabetes)';
        className = 'warning';
    } else {
        status = '🔴 High (Diabetes)';
        className = 'high';
    }

    statusEl.textContent = status;
    statusEl.className = 'health-status ' + className;
}

function updateHbA1cStatus() {
    const hba1c = parseFloat(document.getElementById('hbA1c').value);
    const statusEl = document.getElementById('hba1cStatus');

    let status, className;
    if (hba1c < 5.7) {
        status = '✓ Normal';
        className = 'normal';
    } else if (hba1c < 6.5) {
        status = '⚠ At Risk (Prediabetes)';
        className = 'warning';
    } else {
        status = '🔴 High (Diabetes)';
        className = 'high';
    }

    statusEl.textContent = status;
    statusEl.className = 'health-status ' + className;
}

// ============================================================================
// GENDER SELECTION
// ============================================================================
function selectGender(button) {
    // Remove active class from all buttons
    document.querySelectorAll('.segmented-button').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    // Update hidden input
    document.getElementById('gender').value = button.dataset.gender;
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================
const form = document.getElementById('simulationForm');
const errorMessage = document.getElementById('errorMessage');
const outputSection = document.getElementById('outputSection');
const loadingState = document.getElementById('loadingState');
const resultsContainer = document.getElementById('resultsContainer');
const btnSpinner = document.getElementById('btnSpinner');

// ============================================================================
// PROMPT CONSTRUCTION
// ============================================================================
function constructPrompt() {
    // Calculate BMI for prompt
    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);
    const bmi = (weight / (height * height)).toFixed(1);

    // Collect form data
    const data = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        bmi: bmi,
        familyHistory: document.getElementById('familyHistory').value,
        fastingGlucose: document.getElementById('fastingGlucose').value,
        hbA1c: document.getElementById('hbA1c').value,
        sleep: document.getElementById('sleep').value,
        dailySteps: document.getElementById('dailySteps').value,
        sugarIntake: document.getElementById('sugarIntake').value,
        stressLevel: document.getElementById('stressLevel').value,
        targetSleep: document.getElementById('targetSleep').value,
        targetSteps: document.getElementById('targetSteps').value,
        targetSugarIntake: document.getElementById('targetSugarIntake').value,
        duration: document.getElementById('duration').value,
    };

    // Construct the prompt in the specified format
    const prompt = `
PATIENT_PROFILE:
Name: ${data.name}
Age: ${data.age}
Gender: ${data.gender}
BMI: ${data.bmi}
Family_History: ${data.familyHistory}

BASELINE_LAB_DATA:
Fasting_Glucose: ${data.fastingGlucose} mg/dL
HbA1c: ${data.hbA1c}%

CURRENT_LIFESTYLE:
Sleep: ${data.sleep} hours/night
Daily_Steps: ${data.dailySteps}
Sugar_Intake: ${data.sugarIntake}
Stress_Level: ${data.stressLevel}

SCENARIOS_TO_SIMULATE:
A) Current lifestyle continues unchanged
B) Sleep increased to ${data.targetSleep} hours, sugar intake reduced to ${data.targetSugarIntake}, daily steps increased to ${data.targetSteps}

SIMULATION_TIMEFRAME:
${data.duration} months

TASKS:
1. Simulate the future health risk trajectory for each scenario
2. Estimate relative change in Type 2 Diabetes risk as a percentage
3. Identify key lifestyle factors driving risk
4. Provide preventive, lifestyle-based suggestions
5. Explain reasoning using clear cause → effect logic

OUTPUT_FORMAT:
- Risk_Comparison_Table (with scenarios, risk levels, HbA1c trend, glucose trend)
- Key_Risk_Drivers (bullet list of lifestyle factors)
- Estimated_Risk_Change_Percentage (e.g., "-28% relative risk reduction")
- Cause_Effect_Explanation (explain how sleep, sugar, activity, stress affect diabetes risk)
- Simple_Summary (Explain like I am 12 - very simple language, friendly tone, no medical jargon)
`.trim();

    return prompt;
}

// ============================================================================
// FORM VALIDATION
// ============================================================================
function validateForm() {
    const requiredFields = [
        'name', 'age', 'gender', 'familyHistory',
        'height', 'weight', 'fastingGlucose', 'hbA1c',
        'sleep', 'dailySteps', 'sugarIntake', 'stressLevel',
        'targetSleep', 'targetSteps', 'targetSugarIntake', 'duration'
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value || field.value.trim() === '') {
            showError(`Please fill in: ${field.previousElementSibling?.textContent || fieldId}`);
            return false;
        }
    }

    return true;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// ============================================================================
// API COMMUNICATION
// ============================================================================
async function submitSimulation(event) {
    event.preventDefault();
    hideError();

    // Validate
    if (!validateForm()) {
        return;
    }

    // Show loading state
    outputSection.classList.remove('hidden');
    loadingState.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    btnSpinner.style.display = 'inline-block';

    // Scroll to output
    outputSection.scrollIntoView({ behavior: 'smooth' });

    try {
        // Construct prompt
        const prompt = constructPrompt();
        console.log('Constructed prompt:\n', prompt);

        // Prepare request payload
        const payload = {
            prompt: prompt
        };

        // Send to backend
        const response = await fetch('http://127.0.0.1:8000/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Backend error');
        }

        const result = await response.json();
        console.log('Backend response:', result);

        if (!result || !result.result) {
            throw new Error('Invalid response format: missing result field');
        }

        // Hide loading, show results
        loadingState.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        btnSpinner.style.display = 'none';

        // Parse and display results
        displayResults(result.result);
    } catch (error) {
        console.error('Error:', error);
        btnSpinner.style.display = 'none';
        loadingState.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        showError(`Error: ${error.message}`);
    }
}

// ============================================================================
// RESULT PARSING & DISPLAY
// ============================================================================
function displayResults(rawOutput) {
    // Store raw output for debugging
    document.getElementById('fullResponse').textContent = rawOutput;

    // Parse output sections
    const sections = parseOutput(rawOutput);

    // Populate result cards
    displayRiskTable(sections.riskComparison);
    displayRiskDrivers(sections.riskDrivers);
    displayRiskChange(sections.riskChange);
    displayCauseEffect(sections.causeEffect);
    displaySimpleSummary(sections.simpleSummary);
}

function parseOutput(output) {
    // Extract sections from the raw AI output
    const sections = {
        riskComparison: extractSection(output, 'Risk_Comparison_Table|Risk Comparison'),
        riskDrivers: extractSection(output, 'Key_Risk_Drivers|Key Risk Drivers'),
        riskChange: extractSection(output, 'Estimated_Risk_Change|Estimated Risk Change'),
        causeEffect: extractSection(output, 'Cause.*Effect|Cause.*Effect'),
        simpleSummary: extractSection(output, 'Simple_Summary|Simple Summary'),
    };

    return sections;
}

function extractSection(text, sectionPattern) {
    if (!text || typeof text !== 'string') return 'No data available';
    const regex = new RegExp(`${sectionPattern}[:\\n]*([\\s\\S]*?)(?=(^[A-Z_-]|$))`, 'im');
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : 'No data available';
}

function displayRiskTable(content) {
    const tableDiv = document.getElementById('riskTable');
    tableDiv.innerHTML = formatMarkdown(content);
}

function displayRiskDrivers(content) {
    const driversDiv = document.getElementById('riskDrivers');
    driversDiv.innerHTML = formatMarkdown(content);
}

function displayRiskChange(content) {
    const changeDiv = document.getElementById('riskChange');
    changeDiv.innerHTML = formatMarkdown(content);
}

function displayCauseEffect(content) {
    const causeDiv = document.getElementById('causeEffect');
    causeDiv.innerHTML = formatMarkdown(content);
}

function displaySimpleSummary(content) {
    const summaryDiv = document.getElementById('simpleSummary');
    summaryDiv.innerHTML = formatMarkdown(content);
}

// ============================================================================
// MARKDOWN-STYLE FORMATTING
// ============================================================================
function formatMarkdown(text) {
    if (!text || typeof text !== 'string') return '<p>No data available</p>';

    let html = text;

    // Escape HTML
    html = escapeHtml(html);

    // Convert markdown tables (pipe-separated)
    html = html.replace(/\|(.+)\|/g, (match) => {
        const rows = match.split('\n').filter(r => r.includes('|'));
        if (rows.length === 0) return match;

        let table = '<table>';
        rows.forEach((row, index) => {
            const cells = row.split('|').slice(1, -1).map(c => c.trim());
            const tag = index === 0 ? 'th' : 'td';
            table += `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
        });
        table += '</table>';
        return table;
    });

    // Convert headings
    html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');

    // Convert bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Convert italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Convert lists
    html = html.replace(/^\s*[-•*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, (match) => `<ul>${match}</ul>`);

    // Convert line breaks to paragraphs
    html = html.split('\n\n').map(p => {
        if (p.includes('<h') || p.includes('<table') || p.includes('<ul') || p.includes('<li')) {
            return p;
        }
        return p.trim() ? `<p>${p.trim()}</p>` : '';
    }).join('');

    return html;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// RESET FUNCTIONALITY
// ============================================================================
function resetSimulation() {
    outputSection.classList.add('hidden');
    form.scrollIntoView({ behavior: 'smooth' });
}

form.addEventListener('reset', () => {
    // Reinitialize sliders to default values
    updateBMI();
    updateGlucoseStatus();
    updateHbA1cStatus();
    initializeSliderListeners();
    hideError();
});

// ============================================================================
// FORM SUBMISSION
// ============================================================================
form.addEventListener('submit', submitSimulation);

// ============================================================================
// INITIALIZE
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeSliderListeners();
    updateBMI();
    updateGlucoseStatus();
    updateHbA1cStatus();
    console.log('Twindex Frontend Ready');
});

