## Node.js Web Application with Docker, Prometheus, Grafana, Alertmanager, and Nginx Integration

#Overview

This project demonstrates how to Dockerize a Node.js web application and monitor it using Prometheus, visualize metrics using Grafana, manage alerts with Alertmanager, and reverse proxy the application using Nginx.

## Table of Contents
- [Project Architecture](#project-architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Compose Configuration](#docker-compose-configuration)
- [Running the Project](#running-the-project)
- [Monitoring Setup](#monitoring-setup)
  - [Prometheus Configuration](#prometheus-configuration)
  - [Grafana Setup](#grafana-setup)
  - [Alertmanager Setup](#alertmanager-setup)
- [Useful Commands](#useful-commands)
- [Contribution](#contribution)

# Project Architecture
The project consists of the following components:

- Node.js Web Application: A web application built using the Express framework.
- Prometheus: Monitors the web app and system metrics.
- Grafana: Provides dashboards to visualize the metrics.
- Alertmanager: Configures alerts for system and app monitoring.
- Node Exporter: Exports system metrics for Prometheus.
- cAdvisor: Monitors and provides container resource usage data.
- Nginx: Acts as a reverse proxy for the web app.
- Docker: Containerizes all components for easy deployment and management.

# Features
- Dockerized Node.js web application for portability.
- System monitoring and container resource usage via Prometheus, Node Exporter, and cAdvisor.
- Real-time visualization with Grafana.
- Alerts configured with Prometheus and managed by Alertmanager.
- Reverse proxy with Nginx.

# Prerequisites
Make sure you have the following installed on your machine:

- Docker
- Node.js
- Prometheus

## Installation
1. Clone the repository:
'''bash
git clone <repository-url>
cd <repository-folder>

2. Ensure environment variables for Grafana are set in your .env file:
''''
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=admin
''''
3. Build the Docker image for the Node.js web application:
''''
docker-compose build
''''

# Docker Compose Configuration
Your docker-compose.yml file orchestrates multiple services. Here's a brief overview of each service:

- Node.js Web Application: The web app container exposed on port 5000.
- Prometheus: Collects metrics from the web application and system services. Exposed on port 9090.
- Alertmanager: Manages alerts defined by Prometheus, exposed on port 9093.
- Grafana: Provides visualization for the collected metrics. Exposed on port 3000.
- Node Exporter: Exports system-level metrics (CPU, memory, disk usage).
- cAdvisor: Monitors and exports Docker container metrics, exposed on port 8081.
- Nginx: Acts as a reverse proxy for the web app, exposed on port 80.
Here is the full docker-compose.yml file for reference:

''''
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
    restart: unless-stopped
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"
    command:
      - "--config.file=/etc/alertmanager/alertmanager.yml"
    restart: unless-stopped
    networks:
      - monitoring

  webapp:
    build: .
    container_name: Nodejs-Prometheus-Docker
    ports:
      - "5000:5000"
    restart: unless-stopped
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    restart: unless-stopped
    networks:
      - monitoring

  cadvisor:
    image: google/cadvisor:latest
    container_name: cadvisor
    ports:
      - "8081:8081"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    restart: unless-stopped
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_USER=${GF_SECURITY_ADMIN_USER}
      - GF_SECURITY_ADMIN_PASSWORD=${GF_SECURITY_ADMIN_PASSWORD}
    volumes:
      - ./grafana:/var/lib/grafana
    ports:
      - "3000:3000"
    networks:
      - monitoring

  nginx:
    image: nginx:latest
    container_name: nginx-proxy
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/.htpasswd:/etc/nginx/.htpasswd
    ports:
      - "80:80"
    networks:
      - monitoring

networks:
  monitoring:
    driver: bridge
''''

#Running the Project
To start all services, use the following command:
''''
docker-compose up -d
''''

Once started, the following services will be available:

- Node.js Web Application: '''' http://localhost:5000 ''''
- Prometheus Dashboard: '''' http://localhost:9090 ''''
- Grafana Dashboard: '''' http://localhost:3000 (default credentials: admin / admin) ''''
- Alertmanager: '''' http://localhost:9093 ''''
- cAdvisor: '''' http://localhost:8081 ''''
- Node Exporter: Accessible to Prometheus at '''' http://localhost:9100 ''''

#Monitoring Setup

#Prometheus Configuration
Prometheus collects metrics from the web application and system services. The configuration file (prometheus.yml) includes scraping jobs for both the app and the system:

''''
scrape_configs:
  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['webapp:5000']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8081']
''''

#Grafana Setup
Grafana connects to Prometheus for data visualization. You can configure Grafana by:

Logging into Grafana at '''' http://localhost:3000. ''''
Adding Prometheus as a data source '''' (URL: http://prometheus:9090). ''''
Importing or creating custom dashboards for the collected metrics.

#Alertmanager Setup
Alertmanager manages alerts from Prometheus. Example alert configuration in prometheus.yml:

''''
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - '../alertmanager/alertmanager.yml'
''''
Define custom alert rules in '''' alertmanager.yml '''' for Prometheus to trigger alerts.

#Useful Commands
- Stop the containers:
''''
docker-compose down
''''
- Rebuild the application:
''''
docker-compose build
''''
- review logs:
''''
docker-compose logs
''''

#Contributing
Contributions are welcome! Please open an issue or submit a pull request if you want to contribute to this project.
