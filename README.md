# Legajuu — Educator Dossier & Automated PDF Bundling Platform

![Next.js](https://img.shields.io/badge/Next.js-12-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Storage-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql&logoColor=white)
![PDF Automation](https://img.shields.io/badge/PDF-pdf--lib_%7C_JSZip-EF4444?style=flat-square)

<p align="center">
  <img src="https://raw.githubusercontent.com/jomudev/portfolio/main/public/res/Legajoo_preview_screenshot.jpg" alt="Legajuu Platform Preview" width="700" />
</p>

## Executive Summary

**Legajuu** is a full-stack **Next.js** web platform built to solve a real-world bureaucratic bottleneck in Honduras: helping public-sector teachers organize, format, merge, and export official hiring dossiers (*legajos*) required by educational institutions.

---

## Technical Architecture & Highlights

- **Object-Oriented Domain Layer (`Classes/`):** Clean domain modeling via `Legajo.js`, `Document.js`, `Directory.js`, `Bucket.js`, and `ReadFile.js` to encapsulate file structure and dossier assembly rules.
- **Automated PDF & Archive Generation (`pdf-lib`, `jszip`, `file-saver`):** Dynamically converts, validates, merges uploaded credentials into standardized PDFs, and packages complete dossiers as downloadable `.zip` archives (`libs/util/convertFiles.js`).
- **Hybrid Cloud & Relational Persistence:** Combines **Firebase** authentication and remote file buckets (`libs/remoteStorage.js`, `libs/auth.js`) with **MySQL** relational records (`enviroment/dbAuth.js`).
- **State & UI Layer:** Built with **React 18**, **NextUI**, custom React Context providers (`directoriesContext.js`, `userContext.js`), drag-and-drop/file picking (`FilePicker.js`), and interactive document previews (`DocumentView.js`).

---

## Project Structure

```text
Legajuu/
├── Classes/                        # OOP domain models (Legajo, Document, Directory, Bucket)
├── components/
│   ├── UI/                         # Reusable Dropdown, FilePicker, Modal, OptionsMenu
│   ├── context/                    # Global userContext & directoriesContext providers
│   └── ...                         # Add2Legajo, DocumentCard, DocumentView, DocumentsList
├── libs/                           # Auth, HTTP, storage, directory helpers & file converters
├── pages/                          # Next.js pages (index, create, documents) & API routes
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build && npm start
```

---

## Author & Contact

**Héctor Joann Murillo Mejía** — Mobile & Full-Stack Software Engineer (React Native · TypeScript · Node.js)

- **Email:** [joannmurillo@icloud.com](mailto:joannmurillo@icloud.com)
- **LinkedIn:** [linkedin.com/in/hector-joann-murillo-mejia](https://www.linkedin.com/in/hector-joann-murillo-mejia/)
- **GitHub:** [github.com/jomudev](https://github.com/jomudev)
- **Portfolio:** [joannmurillo.com](https://www.joannmurillo.com)
