# Twindex Frontend - Quick Start Guide

## ⚡ 30-Second Setup

### 1. Start Backend
```bash
cd d:\Projects\Twindex\Twindex
uvicorn app.main:app --reload --port 8000
```

### 2. Open Frontend
```bash
# Option A: Direct (fastest for testing)
# Open d:\Projects\Twindex\Twindex\frontend\index.html in browser

# Option B: Via Python server
cd d:\Projects\Twindex\Twindex\frontend
python -m http.server 8000
# Visit http://localhost:8000
```

### 3. Test It
1. Fill out the health form (all fields required)
2. Click "Run Simulation"
3. Wait for AI response
4. Review results in cards

---

## 📋 Form Fields (All Required)

### Patient Profile
- **Full Name**: e.g., "John Doe"
- **Age**: 18-120 years
- **Gender**: Male / Female / Other
- **Height**: cm (100-250)
- **Weight**: kg (30-200) → *BMI auto-calculates*
- **Family History**: e.g., "Yes" or "No"

### Baseline Lab Data
- **Fasting Glucose**: mg/dL (normal < 100)
- **HbA1c**: % (normal < 5.7)

### Current Lifestyle
- **Sleep**: hours/night (2-12)
- **Daily Steps**: number (0-50000)
- **Sugar Intake**: Low / Medium / High
- **Stress Level**: Low / Medium / High

### Scenario B (Improvements)
- **Target Sleep**: hours/night (2-12)
- **Target Daily Steps**: number (0-50000)
- **Target Sugar Intake**: Low / Medium / High

### Timeframe
- **Duration**: months (1-120), default 9

---

## 🎨 UI Overview

### Input Section (Bento Grid)
- 6 responsive cards
- Auto-calculating BMI
- Real-time validation

### Output Section (Results Grid)
- Risk Comparison table
- Key Risk Drivers list
- Risk Change percentage
- Cause-Effect explanation
- Simple Summary
- Full AI Response (expandable)

---

## 🔧 How It Works

```
User Input → Form Validation → Prompt Construction
      ↓
JSON Payload → HTTP POST to Backend
      ↓
Backend (Gemini AI) → Generates Analysis
      ↓
Response Parsing → HTML Rendering → Display
```

### Prompt Format
The frontend automatically constructs:
```
PATIENT_PROFILE:
Name: [value]
Age: [value]
... (all patient data)

SCENARIOS_TO_SIMULATE:
A) Current lifestyle continues unchanged
B) Sleep increased to X hours, ...

TASKS:
1. Simulate future health trajectory
2. Estimate diabetes risk change (%)
3. Identify key risk drivers
... (instructions for AI)
```

---

## 🐛 Debugging

### Check Backend
```powershell
# Verify backend is running
Invoke-WebRequest -Uri http://127.0.0.1:8000/health -UseBasicParsing
```

### Browser Console
```javascript
// Open Developer Tools (F12)
// Console tab shows:
// - "Twindex Frontend Ready"
// - Constructed prompt (logged)
// - API response (logged)
// - Any errors
```

### Network Tab
- Check `POST /simulate` request
- Verify 200 status
- See full request/response

---

## ✨ Features

✅ **Form Validation**
- All fields required
- Clear error messages
- Auto-calculation of BMI

✅ **Loading State**
- Spinner animation
- "Simulating future health trajectories…"
- Prevents double-submission

✅ **Output Formatting**
- Markdown to HTML conversion
- Tables rendered properly
- Lists formatted correctly

✅ **Responsive Design**
- Desktop: Full bento grid
- Tablet: Adjusted layout
- Mobile: Single column

✅ **Security**
- HTML escaping (XSS prevention)
- No inline eval()
- Safe markdown parsing

---

## 🚀 Production Deployment

### Files to Deploy
```
frontend/
├── index.html      (everything bundled)
└── script.js       (vanilla JS)
```

### No Additional Requirements
- No npm install
- No build step
- No webpack/bundler
- No external CDNs (Google Fonts only)

### Deployment Options
1. **Static hosting**: Netlify, Vercel, GitHub Pages
2. **Web server**: Nginx, Apache, Node.js
3. **Docker**: Simple container with static server
4. **S3 + CloudFront**: AWS setup

---

## 📝 Example Usage

### Sample Input
```
Name: Sarah Johnson
Age: 42
Gender: Female
Height: 165 cm
Weight: 72 kg → BMI: 26.4
Family History: Yes
Fasting Glucose: 115 mg/dL
HbA1c: 6.2%
Sleep: 6 hours/night
Daily Steps: 4000
Sugar Intake: High
Stress Level: High
Target Sleep: 8
Target Steps: 8000
Target Sugar: Low
Duration: 9 months
```

### Expected Output
1. **Risk Comparison Table**
   - Scenario A: High Risk, ↑ HbA1c, ↑ Glucose
   - Scenario B: Moderate Risk, ↓ HbA1c, ↓ Glucose

2. **Key Risk Drivers**
   - High sugar consumption
   - Insufficient sleep
   - Sedentary lifestyle
   - Elevated HbA1c (prediabetic)

3. **Risk Change**: -35% relative risk reduction

4. **Cause-Effect**: Detailed explanation of how each factor affects risk

5. **Simple Summary**: Kid-friendly explanation

---

## 🎓 Code Structure

### index.html
- HTML structure (semantic)
- Embedded CSS (complete styling)
- No external CSS file

### script.js
- Form handling
- BMI calculation
- Prompt construction
- API communication (fetch)
- Response parsing
- HTML rendering

---

## 🔐 Security Features

✅ HTML escaping for all user content
✅ No eval() or dynamic code execution
✅ CORS headers from backend
✅ Input validation before submission
✅ Safe markdown conversion

---

## 📱 Responsive Breakpoints

| Device | Layout | Cards/Row |
|--------|--------|-----------|
| Desktop (1200px+) | Grid | Auto-fit |
| Tablet (768px) | Grid | 2 cols |
| Mobile (<768px) | Stack | 1 col |

---

## 🎯 Key Technologies

- **HTML5**: Semantic structure
- **CSS3**: Grid, Flexbox, Variables
- **JavaScript ES6**: Modern syntax
- **Fetch API**: HTTP requests
- **Regular Expressions**: Markdown parsing

**No frameworks. Pure vanilla web tech.**

---

## ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Form fields are interactive
- [ ] BMI auto-calculates correctly
- [ ] Form validation works (try submitting empty)
- [ ] API call succeeds (check Network tab)
- [ ] Results display properly
- [ ] Mobile layout looks good
- [ ] Console has no errors
- [ ] Can start new simulation

---

## 📚 File Sizes

- `index.html` - ~27 KB (includes all CSS)
- `script.js` - ~12 KB
- `README.md` - ~8 KB (this file)
- **Total** - ~47 KB (production ready)

---

## 🆘 Troubleshooting

### "Cannot connect to backend"
- Verify backend is running: `uvicorn app.main:app --reload --port 8000`
- Check firewall isn't blocking localhost:8000
- Check browser console for CORS errors

### "Form validation errors"
- All fields are required
- Check field constraints (age 18-120, height 100-250, etc.)
- Error message shows which field has issues

### "Results not displaying"
- Check browser console for JavaScript errors
- Verify backend response in Network tab
- Check if AI response is empty/error

### "API returns error"
- Check backend logs for Gemini API key issues
- Verify `.env` file has valid API key
- Check Gemini API quota (429 errors = quota exceeded)

---

## 🎉 You're Ready!

The frontend is **production-ready** and can be deployed immediately.
- Zero external dependencies
- Zero build step required
- Works in any modern browser
- Optimized for performance

**Happy simulating!**
