FROM python:3.11-slim

# Instalar dependencias de sistema necesarias
RUN apt-get update && apt-get install -y unzip libaio1 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar el Instant Client ZIP local al contenedor
COPY instantclient-basiclite-linux.x64-12.2.0.1.0.zip /opt/oracle/instantclient.zip

WORKDIR /opt/oracle

# Descomprimir Instant Client y crear enlace simbólico
RUN unzip instantclient.zip && \
    rm instantclient.zip && \
    ln -s /opt/oracle/instantclient_* /opt/oracle/instantclient

# Establecer variable de entorno para Oracle Instant Client
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient

# Cambiar al directorio de la aplicación
WORKDIR /app

# Copiar e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código fuente al contenedor
COPY . .

# Exponer el puerto donde corre Flask
EXPOSE 5000

# Comando para ejecutar la app
CMD ["python", "app.py"]
