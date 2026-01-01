FROM node:20-bookworm

# Install system dependencies for Python and Tesseract
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    tesseract-ocr \
    tesseract-ocr-tam \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Set up Python environment
RUN python3 -m venv .venv
ENV PATH="/app/.venv/bin:$PATH"

# Install Python dependencies
RUN pip install --no-cache-dir pillow pytesseract python-docx

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
# Ensure the app uses the virtual environment's python
ENV VIRTUAL_ENV=/app/.venv

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
