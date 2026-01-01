# Tom Scanner

A handwritten Tamil text to Word converter using Tesseract OCR.

## Prerequisites

- Node.js (v20 or later)
- Python 3 (for the OCR engine)

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Setup Database**
    This project uses SQLite. Initialize the database with:
    ```bash
    npm run db:push
    ```

## Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Building for Production

1.  **Build the project**
    ```bash
    npm run build
    ```

2.  **Start the production server**
    ```bash
    npm start
    ```
