# backend/Dockerfile

FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the application
CMD ["python", "back.py"]
