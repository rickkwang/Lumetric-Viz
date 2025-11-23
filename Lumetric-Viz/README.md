# Lumetric 3D Data Visualization

**Lumetric** is a high-performance, interactive 3D data visualization engine. It transforms static Excel and CSV spreadsheets into immersive 3D environments, allowing users to explore data trends using Radial, Bar, Bubble, and Surface projection models. Built with **React**, **Three.js**, **TypeScript**, and **Electron**, it runs seamlessly as both a modern Web Application and a standalone Desktop Application (Windows/macOS).

---

## 🎓 Practical Tutorial: Create Your First Model

Follow these steps to generate your first 3D interactive model using Lumetric.

### Step 1: Prepare Your Data

Lumetric works best with standard Excel (`.xlsx`) or CSV files. The structure must be consistent:

1. **Open Excel** or Google Sheets.
2. **Row 1 (The Headers)**:
   * **Cell A1**: Name this "Category" (or "Month", "City", etc.).
   * **Cell B1, C1, D1...**: Name these your data series (e.g., "Sales 2023", "Profit", "Growth").
3. **Row 2+ (The Data)**: Fill in your rows.

**Sample Data:**

| Category | Sales | Profit |
| :--- | :--- | :--- |
| Jan | 100 | 20 |
| Feb | 150 | 40 |
| Mar | 120 | 30 |

### Step 2: Upload Data

1. Launch the application (`npm run dev` or open the installed app).
2. Look at the sidebar on the left.
3. Locate the box labeled **"UPLOAD DATA"**.
4. **Drag and drop** your Excel file into this box, or click it to browse your computer.

### Step 3: Explore 3D Views

Once uploaded, your model appears instantly.
* **Rotate**: Click and drag the model with your **Left Mouse Button**.
* **Move**: Click and drag with your **Right Mouse Button** to pan around.
* **Zoom**: Use your **Scroll Wheel**.

### Step 4: Customize

Use the **Control Panel** in the sidebar:
* **Switch Charts**: Click icons like "Bars", "Bubbles", or "Surface" to see different visualizations of the same data.
* **Auto Rotate**: Toggle this to make the model spin automatically for presentations.
* **Data Opacity**: Use the slider to make bars transparent, helping you see data hidden behind other rows.
* **Hide Series**: In the "Active Series" list, click the **Eye icon** to hide specific data columns temporarily.

---

## ✨ Features

* **6 Immersive 3D Modes**:
  * **Radial**: Circular polygon comparisons.
  * **Bars**: Standard comparative bar charts in 3D space.
  * **Bubbles**: Floating spheres representing magnitude.
  * **Trends**: 3D Line charts for timeline analysis.
  * **Lollipop**: Clean, modern stick-and-ball visualization.
  * **Surface**: Terrain-like topographical data mapping.
* **Drag & Drop Import**: Native support for `.xlsx`, `.xls`, and `.csv` files.
* **Desktop Native**: Run as a standalone app with no browser required.
* **Interactive Scene**:
  * Orbit controls (Rotate, Zoom, Pan).
  * Auto-rotation presentation mode.
  * Adjustable opacity for data layering.
* **Local History**: Automatically saves recent datasets for quick access.
* **Responsive**: Fully functional on Desktop and Mobile/Tablet web browsers.

---

## 🚀 Getting Started (Developers)

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/rickkwang/Lumetric-Viz.git
cd Lumetric-Viz
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

## 🎮 Controls Summary
* **Left Click + Drag**: Rotate Camera
* **Right Click + Drag**: Pan Camera
* **Scroll Wheel**: Zoom

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.