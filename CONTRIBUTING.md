# Contributing to motion-organic 🌿

Thank you for your interest in contributing to **`motion-organic`**! We welcome contributions from developers of all skill levels to help expand our collection of organic page transitions, typography effects, and physics engines.

> 🌐 **Live Preview & Showcase:**  
> Before building or testing, explore all existing transitions and typography effects on the official playground: **[https://motion-organic.kharsan.com](https://motion-organic.kharsan.com/)**

---

## 🚀 Ways to Contribute

- ✨ **Add a new Transition effect** in `src/transitions/`
- 🎨 **Add a new Typography effect** in `src/primitives/`
- ⚡ **Optimize physics or rendering performance**
- 🐛 **Report or fix issues**
- 📖 **Improve documentation and examples**

---

## 🛠️ Development Setup

### 1. Clone the Repository

Fork the repository on GitHub, then clone your fork locally:

```bash
git clone https://github.com/Chaudhary-Saumya/motion-organic.git
cd motion-organic
```

If you are working from your own fork:
```bash
git remote add upstream https://github.com/Chaudhary-Saumya/motion-organic.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

Run the built-in test suite to verify everything works:

```bash
npm test
```

---

## 🎨 Adding a New Transition

1. Create a new module inside `src/transitions/` (e.g. `src/transitions/wavePortal.js`).
2. Implement your transition using the `createTransition` helper:

```javascript
import { createTransition } from './base.js';

export const wavePortal = createTransition({
  name: 'wavePortal',
  animate(element, options = {}) {
    // Transition animation logic
  }
});
```

3. Export the new transition in `src/index.js` and register it in `src/auto/registry.js`.
4. Add corresponding tests in `test/index.test.js`.
5. Run `npm test` to ensure all tests pass.

---

## 🎨 Adding a Typography Effect

1. Create the effect in `src/primitives/` (e.g. `src/primitives/myEffectText.js`).
2. Export the component in `src/react/Primitives.js` and `src/react/MoText.js`.
3. Ensure zero external runtime dependencies are introduced.

---

## 📬 Pull Request Workflow

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/wave-portal-transition
   ```

2. Make your changes and commit with a clear, conventional commit message:
   ```bash
   git commit -m "feat(transitions): add wavePortal transition"
   ```

3. Push your branch:
   ```bash
   git push origin feature/wave-portal-transition
   ```

4. Open a **Pull Request** on GitHub against the `main` branch.
5. Provide a summary of your changes and include a screen recording or GIF if introducing a visual effect.

---

## 📜 Code Style & Standards

- **Zero Runtime Dependencies:** Keep the core library lightweight and dependency-free.
- **Physics-Driven:** Use natural easing and spring physics where appropriate.
- **Cross-Framework Compatibility:** Ensure primitives work smoothly across Vanilla JS and React.

Thank you for helping make `motion-organic` better! 🚀
