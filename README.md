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
2. Provider (Storage Node)

Run on any laptop/PC in the LAN to contribute storage:

docker run -d --name provider -v /path/to/storage:/app/storage sathwikks21/privatecloud-app provider --controller-ip <CONTROLLER_IP>


Replace /path/to/storage with the folder for storing files

Replace <CONTROLLER_IP> with the LAN IP of the controller

3. Consumer (User Access)

Consumers interact with the system using their unique key.

Upload a file:

curl -F "file=@mydoc.pdf" http://<CONTROLLER_IP>:3000/upload?key=<YOUR_KEY>


Download a file:

curl http://<CONTROLLER_IP>:3000/download/mydoc.pdf?key=<YOUR_KEY> -o mydoc.pdf

Example Workflow

Start the controller on one server

Run providers on laptops/PCs in the LAN

Consumer receives a key from the controller

Consumer uploads a file → stored on available provider

If a provider is full, uploads are routed to another provider

Consumer can download their file anytime using the key

Future Enhancements

Persistent metadata store (currently in-memory)

Web UI for consumers

Replication across nodes

End-to-end encryption

Author

Sathwik Gowda K S
PES University
