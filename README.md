Personal Cloud Storage (LAN-based)
Overview

A private cloud storage system that works on local network (LAN).

Controller manages providers and consumers.

Providers are nodes that contribute storage.

Consumers upload and download files using a unique key.

The project is available as a Docker image on Docker Hub:

sathwikks21/privatecloud-app

Run
Controller

Run on the main server:

docker run -d --name controller -p 3000:3000 sathwikks21/privatecloud-app controller

Provider

Run on any node (laptop/PC) in the LAN:

docker run -d --name provider -v /path/to/storage:/app/storage sathwikks21/privatecloud-app provider --controller-ip <CONTROLLER_IP>


Replace /path/to/storage with a folder for storing files.

Replace <CONTROLLER_IP> with the LAN IP of the controller.

Consumer



Author

Sathwik Gowda K S
