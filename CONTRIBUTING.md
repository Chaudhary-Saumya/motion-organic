# Contributing to motion-organic 🌿

First off, thank you for considering contributing to `motion-organic`! It's people like you that make open source such a wonderful community.

---

## 🚀 How Can You Contribute?

You can contribute in many ways:
- ✨ **Add a new Transition effect** (in `src/transitions/`)
- 🎨 **Add a new Typography effect** (in `src/typography/` or `src/`)
- 🐛 **Report or fix bugs**
- 📖 **Improve documentation & examples**
- ⚡ **Optimize performance and animations**

---

## 🛠️ Getting Started (Local Development)

### 1. Fork and Clone the Repository
1. Click the **Fork** button at the top right of this repository.
2. Clone your fork to your computer:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/motion-organic.git
   cd motion-organic
   ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests
Ensure all existing tests pass:
```bash
npm test
```

---

## 🎨 Adding a New Transition

1. Create a new file in `src/transitions/` (e.g., `myCoolTransition.js`).
2. Follow the standard transition signature:
   ```javascript
   import { createTransition } from './base.js';

   export const myCoolTransition = createTransition({
     name: 'myCoolTransition',
     animate(element, options = {}) {
       // Your transition logic here
     }
   });
   ```
3. Export your transition in `src/index.js` and register it in `src/auto/registry.js` if applicable.
4. Add a unit test in `test/index.test.js`.
5. Run `npm test` to make sure everything passes!

---

## 📬 Submitting a Pull Request (PR)

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/my-cool-transition
   ```
2. Commit your changes with a clear message:
   ```bash
   git commit -m "feat: add myCoolTransition effect"
   ```
3. Push to your fork:
   ```bash
   git push origin feature/my-cool-transition
   ```
4. Open a **Pull Request** on GitHub against the `main` branch.
5. Describe what your transition or fix does (bonus points for GIFs or live previews!).

---

## 📜 Code of Conduct

- Be friendly, respectful, and welcoming to everyone.
- Keep animations smooth, lightweight, and zero-dependency.

Thank you for making `motion-organic` awesome! 🚀
