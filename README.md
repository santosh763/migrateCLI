# Quick Migrate CLI

**Quick Migrate** is a command-line tool that allows you to configure and manage the migration between source and target clusters. It supports clusters such as Google Kubernetes Engine (GKE), Open-source clusters, and Azure Kubernetes Service (AKS).

With this tool, you can easily initialize configurations for both source and target clusters by following an interactive CLI setup.

## Features
- **Interactive CLI Setup**: Guide users to configure their source and target clusters.
- **Support for Multiple Cluster Types**: Choose between `gke`, `opensource`, and `aks`.
- **Secure Password Entry**: Passwords are masked using asterisks (`****`).
- **Persistent Configuration**: Store configuration details in a JSON file for future use.

## Installation

To use the **Quick Migrate** CLI tool, you need Node.js installed on your machine.

### Step 1: Clone the Repository
Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/quickmigrate.git
cd quickmigrate

quickmigrate init
