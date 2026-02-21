# PM Builder

A keynote-quality HTML presentation on how AI is changing what product managers do.

## What's Inside

**The Upended Product Cycle** challenges five core PM beliefs that no longer hold when building is faster than speccing. It covers:

- Why the economics of product development flipped
- Five PM beliefs that got upended (research-first, spec-driven, say no, AI as tool, data-driven)
- The PM Builder Stack: a 5-level framework for where to start
- Practical actions for individual PMs and PM leaders

Built with [Reveal.js](https://revealjs.com/). Designed for projection. Works on any screen.

## 🎯 View the Deck

👉 **[View Presentation](https://kunalbabre.github.io/pm-builder/)**

## 📂 Structure

```
index.html          # Slides (content only — easy to edit)
assets/
  styles.css        # Design system (colors, typography, components)
  deck.js           # Navigation, menu, Reveal.js config (auto-generates from slides)
```

### Adding/Removing Slides

Just edit `index.html`. Navigation and menu auto-generate from two attributes:
- `data-act="Act Name"` on the first slide of each act (creates nav bar sections + menu groups)
- `data-menu-title="Title"` on each slide (creates menu entries)

## 🧭 Navigation

- **Arrow keys** or **swipe** to navigate slides
- **M** to open the slide menu
- **F** for fullscreen
- **S** for speaker notes view

## 📄 License

MIT
