# InventroniX - ECE Educational Platform

Welcome to **InventroniX**, a high-level educational platform designed to transform ECE students into core engineers through practical exposure and industry-aligned mentorship.

## Project Vision & System Organization

The system is built around the **student's journey** from novice to expert, visualized through growth metaphors and structured workflows.

### Core Concepts

#### 1. The 5-Stage Project Engine (Success Route)
Our proprietary development lifecycle that mimics Tier-1 R&D labs. This workflow is the backbone of the student's practical learning:
- **Stage 01: System Spec**: Architectural definition and BOM analysis.
- **Stage 02: Schematic Design**: Logic capture and Design Rule Checks (DRC).
- **Stage 03: Fabrication**: Assembly, soldering, and manufacturing debugging.
- **Stage 04: Firmware Rev**: Writing efficient C/C++ code (RTOS, memory optimization).
- **Stage 05: QA & Deploy**: EMI/EMC testing and final product packaging.

#### 2. Growth Metaphor (Visualized)
The platform features a **"Seed to Tree"** visualization that evolves as users scroll through the success route.
- **Seed**: The beginning of the journey (Student).
- **Sprout -> Plant**: Gaining fundamental skills.
- **Tree**: Becoming a fully fledged Core Engineer.
- This is implemented using scroll-triggered animations (`framer-motion`).

#### 3. High-Performance UX
- **Smooth Scrolling**: Integrated `lenis` for a premium, momentum-based scrolling experience.
- **Interactive UI**: Glassmorphism, 3D elements, and particle effects to engage users.

## Technology Stack

This project is built with a modern, high-performance stack:

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

- `src/components/SuccessRoute.tsx`: Implements the 5-Stage Engine timeline.
- `src/components/GrowthAnimation.tsx`: Handles the scroll-based seed-to-tree animation.
- `src/components/SmoothScroll.tsx`: Wrapper for Lenis integration.
- `src/pages/`: Contains main views (Home, Services, Contact, etc.).

## Setup & Development

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
