# Lumetric-Viz[README.md](https://github.com/user-attachments/files/23696652/README.md)

**Lumetric** is a high-performance, interactive 3D data visualization engine. It transforms static Excel and CSV spreadsheets into immersive 3D environments, allowing users to explore data trends using Radial, Bar, Bubble, and Surface projection models.

Built with **React**, **Three.js**, **TypeScript**, and **Electron**, it runs seamlessly as both a modern Web Application and a standalone Desktop Application (Windows/macOS).

---

## ✨ Features

*   **6 Immersive 3D Modes**:
    *   **Radial**: Circular polygon comparisons.
    *   **Bars**: Standard comparative bar charts in 3D space.
    *   **Bubbles**: Floating spheres representing magnitude.
    *   **Trends**: 3D Line charts for timeline analysis.
    *   **Lollipop**: Clean, modern stick-and-ball visualization.
    *   **Surface**: Terrain-like topographical data mapping.
*   **Drag & Drop Import**: Native support for `.xlsx`, `.xls`, and `.csv` files.
*   **Desktop Native**: Run as a standalone app with no browser required.
*   **Interactive Scene**:
    *   Orbit controls (Rotate, Zoom, Pan).
    *   Auto-rotation presentation mode.
    *   Adjustable opacity for data layering.
*   **Local History**: Automatically saves recent datasets for quick access.
*   **Responsive**: Fully functional on Desktop and Mobile/Tablet web browsers.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/lumetric-3d-viz.git
cd lumetric-3d-viz
npm install
```

### 2. Running the Web Version (Development)
Start the local development server to view in your browser:

```bash
npm run dev
```
> Access at: `http://localhost:5173`

### 3. Running the Desktop App (Electron)
Test the application in a native window environment:

```bash
npm run electron:dev
```

### 4. Building the Executable (Release)
To generate an installer file (`.exe` for Windows, `.dmg` for Mac) to share with others:

```bash
npm run electron:build
```
> The output files will be generated in the `dist_electron` folder.

---

## 📊 Data Format Guide

To ensure your data renders correctly, please format your Excel or CSV file as follows:

*   **Row 1 (Header)**:
    *   Column A: **Category Name** (e.g., Month, Product, Region).
    *   Column B+: **Series Names** (e.g., 2023 Sales, 2024 Sales).
*   **Row 2+ (Data)**: The actual values.

**Example Table:**

| (A) Category | (B) Revenue | (C) Profit | (D) Costs |
| :--- | :--- | :--- | :--- |
| January | 500 | 200 | 300 |
| February | 750 | 350 | 400 |
| March | 600 | 150 | 450 |

> **Note**: The app automatically cleans generic formatting (like "$" signs) from numbers.

---

## 🎮 Controls

*   **Left Click + Drag**: Rotate the camera.
*   **Right Click + Drag**: Pan the camera position.
*   **Scroll Wheel**: Zoom in/out.
*   **Sidebar**: Use the menu to switch charts, upload files, or toggle opacity.

---

## 🛠️ Tech Stack

*   **Core**: React 18, TypeScript, Vite
*   **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
*   **Animation**: @react-spring/three
*   **Data Parsing**: SheetJS (xlsx)
*   **Desktop Runtime**: Electron
*   **Styling**: TailwindCSS

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
