# 📁 Inventronix - Project Structure

*Generated on: 2/12/2026, 5:23:52 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 132 |
| 📁 Total Folders | 25 |
| 🌳 Max Depth | 3 levels |
| 🛠️ Tech Stack | React, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🔵 ▲ **vercel.json** - Vercel config

## 📊 File Statistics

### By File Type

- ⚛️ **.tsx** (React TypeScript files): 76 files (57.6%)
- 📜 **.js** (JavaScript files): 11 files (8.3%)
- 🔷 **.ts** (TypeScript files): 11 files (8.3%)
- ⚙️ **.json** (JSON files): 9 files (6.8%)
- 📄 **.avif** (Other files): 5 files (3.8%)
- 📖 **.md** (Markdown files): 3 files (2.3%)
- 📄 **.example** (Other files): 2 files (1.5%)
- 📄 **.mp4** (Other files): 2 files (1.5%)
- 🖼️ **.jpg** (JPEG images): 2 files (1.5%)
- 🎨 **.css** (Stylesheets): 2 files (1.5%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.8%)
- 📄 **.** (Other files): 1 files (0.8%)
- 📄 **.lockb** (Other files): 1 files (0.8%)
- 🌐 **.html** (HTML files): 1 files (0.8%)
- 📕 **.pdf** (PDF files): 1 files (0.8%)
- 🎨 **.svg** (SVG images): 1 files (0.8%)
- 📄 **.txt** (Text files): 1 files (0.8%)
- 🖼️ **.png** (PNG images): 1 files (0.8%)
- 📄 **.eps** (Other files): 1 files (0.8%)

### By Category

- **React**: 76 files (57.6%)
- **Other**: 12 files (9.1%)
- **JavaScript**: 11 files (8.3%)
- **TypeScript**: 11 files (8.3%)
- **Config**: 9 files (6.8%)
- **Docs**: 5 files (3.8%)
- **Assets**: 4 files (3.0%)
- **Styles**: 2 files (1.5%)
- **DevOps**: 1 files (0.8%)
- **Web**: 1 files (0.8%)

### 📁 Largest Directories

- **root**: 132 files
- **src**: 87 files
- **src\components**: 64 files
- **src\components\ui**: 49 files
- **server**: 12 files

## 🌳 Directory Structure

```
Inventronix/
├── 📄 .env.example
├── 🟡 🚫 **.gitignore**
├── 📄 .npmrc
├── 📂 .qoder/
│   ├── 📂 agents/
│   └── 📂 skills/
├── 📂 .qodo/
│   ├── 📂 agents/
│   └── 📂 workflows/
├── 📄 bun.lockb
├── ⚙️ components.json
├── 📜 eslint.config.js
├── 🌐 index.html
├── 🟡 🔒 **package-lock.json**
├── 🔴 📦 **package.json**
├── 📜 postcss.config.js
├── 📖 project_status.md
├── 🌐 public/
│   ├── 📦 assets/
│   │   ├── 📄 background.mp4
│   │   ├── 📄 contact-bg.avif
│   │   ├── 📄 creators-bg.avif
│   │   ├── 📄 faq-bg.avif
│   │   └── 🖼️ faq-new-bg.jpg
│   ├── 📕 INTX Broc.pdf
│   ├── 🎨 placeholder.svg
│   ├── 📄 robots.txt
│   └── 🖼️ thunder.png
├── 🔴 📖 **README.md**
├── 📂 server/
│   ├── 📄 .env.example
│   ├── 📂 middleware/
│   │   └── 📜 auth.js
│   ├── 📂 models/
│   │   ├── 📜 Quiz.js
│   │   └── 📜 Room.js
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 📂 routes/
│   │   ├── 📜 adminRoutes.js
│   │   ├── 📜 quizRoutes.js
│   │   └── 📜 roomRoutes.js
│   ├── 📂 Scripts/
│   │   ├── 📜 seedPythonQuiz.js
│   │   └── 📜 seedVLSIQuiz.js
│   └── 📜 server.js
├── 📁 src/
│   ├── 🎨 App.css
│   ├── ⚛️ App.tsx
│   ├── 🧩 components/
│   │   ├── ⚛️ FloatingParticles.tsx
│   │   ├── ⚛️ GrowthAnimation.tsx
│   │   ├── ⚛️ LearningTimeline.tsx
│   │   ├── ⚛️ Navigation.tsx
│   │   ├── 📂 quiz/
│   │   │   ├── ⚛️ AdminPanel.tsx
│   │   │   ├── ⚛️ JoinRoomForm.tsx
│   │   │   ├── ⚛️ Leaderboard.tsx
│   │   │   ├── ⚛️ QuestionCard.tsx
│   │   │   ├── ⚛️ QuizCreator.tsx
│   │   │   ├── ⚛️ QuizTimer.tsx
│   │   │   ├── ⚛️ StatusMessage.tsx
│   │   │   └── ⚛️ StudentQuiz.tsx
│   │   ├── ⚛️ SmoothScroll.tsx
│   │   ├── ⚛️ StatsCounter.tsx
│   │   ├── ⚛️ SuccessRoute.tsx
│   │   └── 🎨 ui/
│   │   │   ├── ⚛️ accordion.tsx
│   │   │   ├── ⚛️ alert-dialog.tsx
│   │   │   ├── ⚛️ alert.tsx
│   │   │   ├── ⚛️ aspect-ratio.tsx
│   │   │   ├── ⚛️ avatar.tsx
│   │   │   ├── ⚛️ badge.tsx
│   │   │   ├── ⚛️ breadcrumb.tsx
│   │   │   ├── ⚛️ button.tsx
│   │   │   ├── ⚛️ calendar.tsx
│   │   │   ├── ⚛️ card.tsx
│   │   │   ├── ⚛️ carousel.tsx
│   │   │   ├── ⚛️ chart.tsx
│   │   │   ├── ⚛️ checkbox.tsx
│   │   │   ├── ⚛️ collapsible.tsx
│   │   │   ├── ⚛️ command.tsx
│   │   │   ├── ⚛️ context-menu.tsx
│   │   │   ├── ⚛️ dialog.tsx
│   │   │   ├── ⚛️ drawer.tsx
│   │   │   ├── ⚛️ dropdown-menu.tsx
│   │   │   ├── ⚛️ form.tsx
│   │   │   ├── ⚛️ hover-card.tsx
│   │   │   ├── ⚛️ input-otp.tsx
│   │   │   ├── ⚛️ input.tsx
│   │   │   ├── ⚛️ label.tsx
│   │   │   ├── ⚛️ menubar.tsx
│   │   │   ├── ⚛️ navigation-menu.tsx
│   │   │   ├── ⚛️ pagination.tsx
│   │   │   ├── ⚛️ popover.tsx
│   │   │   ├── ⚛️ progress.tsx
│   │   │   ├── ⚛️ radio-group.tsx
│   │   │   ├── ⚛️ resizable.tsx
│   │   │   ├── ⚛️ scroll-area.tsx
│   │   │   ├── ⚛️ select.tsx
│   │   │   ├── ⚛️ separator.tsx
│   │   │   ├── ⚛️ sheet.tsx
│   │   │   ├── ⚛️ sidebar.tsx
│   │   │   ├── ⚛️ skeleton.tsx
│   │   │   ├── ⚛️ slider.tsx
│   │   │   ├── ⚛️ sonner.tsx
│   │   │   ├── ⚛️ switch.tsx
│   │   │   ├── ⚛️ table.tsx
│   │   │   ├── ⚛️ tabs.tsx
│   │   │   ├── ⚛️ textarea.tsx
│   │   │   ├── ⚛️ toast.tsx
│   │   │   ├── ⚛️ toaster.tsx
│   │   │   ├── ⚛️ toggle-group.tsx
│   │   │   ├── ⚛️ toggle.tsx
│   │   │   ├── ⚛️ tooltip.tsx
│   │   │   └── 🔷 use-toast.ts
│   ├── 📂 contexts/
│   │   └── ⚛️ mobile-context.tsx
│   ├── 🎣 hooks/
│   │   ├── ⚛️ use-mobile.tsx
│   │   ├── 🔷 use-toast.ts
│   │   ├── 🔷 useAdminQuiz.ts
│   │   ├── 🔷 useQuizRoom.ts
│   │   └── 🔷 useTimer.ts
│   ├── 🎨 index.css
│   ├── 📚 lib/
│   │   └── 🔷 utils.ts
│   ├── ⚛️ main.tsx
│   ├── 📄 pages/
│   │   ├── ⚛️ Contact.tsx
│   │   ├── ⚛️ Creators.tsx
│   │   ├── ⚛️ FAQ.tsx
│   │   ├── ⚛️ Home.tsx
│   │   ├── ⚛️ NotFound.tsx
│   │   ├── ⚛️ Quiz.tsx
│   │   ├── ⚛️ QuizAdmin.tsx
│   │   ├── ⚛️ QuizRoom.tsx
│   │   └── ⚛️ Services.tsx
│   ├── 📂 services/
│   │   └── 🔷 api.ts
│   ├── 📂 types/
│   │   └── 🔷 quiz.ts
│   └── 🔷 vite-env.d.ts
├── 🔷 tailwind.config.ts
├── ⚙️ tsconfig.app.json
├── 🟡 🔷 **tsconfig.json**
├── ⚙️ tsconfig.node.json
├── 🎨 UI/
│   ├── 📄 Character_Transformation_GIF_Background.mp4
│   ├── 📖 INVENTRONIX_REFACTORING_GUIDE.md
│   ├── 📄 premium_vector-1711987589978-171fa8d26254.avif
│   ├── 📄 premium_vector-1765842523485-b233f58384e1.avif
│   └── 📂 tiny-people-sitting-standing-near-giant-faq/
│   │   ├── 📄 Tiny business people with giant FAQ letters.eps
│   │   └── 🖼️ Tiny business people with giant FAQ letters.jpg
├── 🔵 ▲ **vercel.json**
└── 🔷 vite.config.ts
```

## 📖 Legend

### File Types
- 📄 Other: Other files
- 🚫 DevOps: Git ignore
- ⚙️ Config: JSON files
- 📜 JavaScript: JavaScript files
- 🌐 Web: HTML files
- 📖 Docs: Markdown files
- 🖼️ Assets: JPEG images
- 📕 Docs: PDF files
- 🎨 Assets: SVG images
- 📄 Docs: Text files
- 🖼️ Assets: PNG images
- 🎨 Styles: Stylesheets
- ⚛️ React: React TypeScript files
- 🔷 TypeScript: TypeScript files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
