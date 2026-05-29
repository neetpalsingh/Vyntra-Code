# Vyntra Code - Debug Checklist

## 🔍 Current Situation Analysis

**What we saw in Debug Console:**
- ❌ Augment extension errors (unrelated to Vyntra Code)
- ❓ No "Vyntra Code extension activated" message visible

## ✅ Verified Working
- ✅ Build successful (all packages compile)
- ✅ `extension/dist/extension.js` exists
- ✅ Backend running on http://localhost:8000
- ✅ Extension entry point is valid JavaScript

## 🎯 What to Check

### Step 1: Confirm Extension Development Host Launched
When you pressed F5, did you see:
- [ ] A **new VS Code window** opened
- [ ] The title bar says **"[Extension Development Host]"**
- [ ] The status bar shows debug mode (orange/red color)

**If NO**: The debugger didn't start. Try:
```
1. Close all VS Code windows
2. Reopen the Vyntra-Code folder
3. Press F5 again
```

### Step 2: Check Debug Console Output
In the **original VS Code window** (not Extension Development Host):

1. Open Debug Console (`Ctrl+Shift+Y`)
2. Look for **ALL** output (scroll to top if needed)
3. Search for: `"Vyntra Code extension activated"`

**What to look for:**
```
✅ Good - Extension activated:
   console.log('Vyntra Code extension activated')

❌ Bad - Extension failed to load:
   Error: Cannot find module '@vyntra/shared'
   Error: Failed to activate extension

❓ Nothing - Extension didn't even try to load:
   (means activation event didn't fire)
```

### Step 3: Check Extension Development Host Console
In the **Extension Development Host window**:

1. Press `Ctrl+Shift+I` to open Developer Tools
2. Go to **Console** tab
3. Look for any errors related to Vyntra

### Step 4: Try Running Commands
In the **Extension Development Host window**:

1. Press `Ctrl+Shift+P`
2. Type: `Vyntra`
3. **Expected**: You should see:
   - Vyntra: Open Chat
   - Vyntra: Explain Selected Code
   - Vyntra: Refactor Selected Code
   - Vyntra: Generate Tests
   - Vyntra: Run Agent Task

**If you don't see these commands**, the extension didn't register.

### Step 5: Check Activity Bar
In the **Extension Development Host window**:

Look at the **Activity Bar** (left side icons). You should see:
- [ ] A Vyntra icon (chat bubble or custom icon)

Click it to open the chat panel.

---

## 🐛 Troubleshooting Guide

### Issue: Extension Not Activating

**Symptom**: No "Vyntra Code extension activated" in console

**Possible Causes:**
1. **Wrong launch configuration** - Check `.vscode/launch.json`
2. **Build issue** - Extension didn't compile properly
3. **Extension path wrong** - VS Code can't find the extension

**Solution:**
```powershell
# Rebuild everything
npm run build:all

# Check for errors
npm run build:extension
```

### Issue: "Cannot find module" Error

**Symptom**: Error about missing `@vyntra/shared` or other module

**Solution:**
```powershell
# The extension can't import from shared package
# This is because extension uses CommonJS but shared is now ES modules
```

**FIX NEEDED**: We may need to create a CommonJS build of shared for the extension.

### Issue: Commands Not Showing

**Symptom**: Can't find Vyntra commands in Command Palette

**Possible Causes:**
1. Extension didn't activate
2. Package.json `contributes.commands` not registered
3. Activation event didn't fire

**Solution:**
- Check if `package.json` exists in `extension/` folder
- Verify commands are defined in `contributes.commands`

---

## 🔬 Detailed Debug Steps

### A. Check if Extension is Loading

1. In Debug Console, run this command (if you have access):
   ```javascript
   vscode.extensions.all.find(e => e.id.includes('vyntra'))
   ```

2. Or check the Extension Development Host:
   - Help → Toggle Developer Tools
   - Console tab
   - Type: `vscode.extensions.all`
   - Look for vyntra extension

### B. Verify Extension Package.json

The extension must have:
- ✅ `"main": "./dist/extension.js"`
- ✅ `"activationEvents": ["onStartupFinished"]`
- ✅ Commands defined in `contributes.commands`

### C. Check Module Resolution

The biggest risk is that the extension (CommonJS) can't import from shared (ES modules).

**Test**: Look in Debug Console for:
```
Error [ERR_REQUIRE_ESM]: require() of ES Module
```

If you see this, we need to create a CommonJS build of shared.

---

## 🚨 Most Likely Issue

Based on the errors we fixed earlier, **the most likely problem** is:

### **Extension can't import `@vyntra/shared` because it's now ES modules**

The extension uses:
```typescript
import { Message, MessageRole } from '@vyntra/shared';
```

But it's compiled to CommonJS:
```javascript
const shared = require('@vyntra/shared');
```

And `@vyntra/shared` is now outputting ES modules!

---

## 🔧 Quick Fix to Test

**Option 1: Check if this is the issue**

Look in Debug Console for an error like:
```
Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/shared/dist/index.js
```

**Option 2: If that's the error**

We need to:
1. Create a CommonJS build of shared for the extension
2. Update extension's tsconfig to use a different output
3. Or bundle the extension with webpack/esbuild to handle ES modules

---

## 📋 What to Share With Me

Please copy and paste:

1. **Full Debug Console Output** (from the start, including Vyntra messages)
2. **Extension Development Host Console** (Ctrl+Shift+I → Console)
3. **Answer these questions:**
   - Did Extension Development Host window open? (Yes/No)
   - Can you see Vyntra commands in Command Palette? (Yes/No)
   - Any errors mentioning "vyntra" or "shared" or "require" or "import"?

This will help me identify the exact issue! 🔍
