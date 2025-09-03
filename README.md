# Personal Cloud Storage (LAN-based, Dockerized)

## Overview
This project is a **private cloud storage system** that works on a **local network (LAN)**.  
It allows multiple devices to join as storage providers using Docker, while consumers can upload and download files using a unique key.  
The project image is available on Docker Hub:


---

## Features
- **Controller** to manage providers and consumers  
- **Providers** can join dynamically as storage nodes  
- **Consumers** upload/download files with unique keys  
- **Automatic routing** when a provider is full  
- **Data isolation** per consumer key  
- **LAN-only operation** (no internet required)  

---

## Architecture

- **Controller**: Manages providers, keys, and routing of files  
- **Provider**: Contributes storage to the system  
- **Consumer**: Uploads and downloads their files securely  

---

## Requirements
- Docker installed on all devices  
- Devices connected over the same LAN  
- curl (for consumer testing)  

---

## Run

### 1. Controller (Main Server)
Run on the central server:
```bash
docker run -d --name controller -p 3000:3000 sathwikks21/privatecloud-app controller
```
### 2. Providers
```bash
docker run -d --name provider -v /path/to/storage:/app/storage sathwikks21/privatecloud-app provider --controller-ip <CONTROLLER_IP>
```
Sathwik Gowda K S
PES University
