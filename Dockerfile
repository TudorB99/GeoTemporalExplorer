FROM python:3.13-slim

WORKDIR /code

# Copy and install dependencies first (better caching)
COPY server/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir -r /code/requirements.txt

# Copy only the server code (ignore clients for now)
COPY server /code/server

EXPOSE 8000

CMD ["uvicorn", "server.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
