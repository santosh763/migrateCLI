#!/usr/bin/env node
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();
program.version('1.0.0');

const clusterOptions = ['gke', 'opensourse', 'aks'];

const configFilePath = path.join(__dirname, 'migrationConfig.json');  // Path to save the config

// Main async function to handle CLI setup and commands
async function main() {
  const inquirer = await import('inquirer');

  async function promptClusterDetails(type) {
    console.log(`\nConfiguring ${type} cluster:`);

    const { clusterChoice } = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'clusterChoice',
        message: `Please select the ${type} cluster:`,
        choices: clusterOptions,
      },
    ]);

    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Cluster selected: ${clusterChoice}`);

    const additionalInfo = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'userId',
        message: `Enter your ${type} cluster user ID:`,
      },
      {
        type: 'password',
        name: 'password',
        message: `Enter your ${type} cluster password:`,
        mask: '*',  // Mask with asterisk by default
      },
      {
        type: 'input',
        name: 'clusterApiUrl',
        message: `Enter the ${type} cluster API URL:`,
      },
    ]);

    // Save details in a JSON object
    const configData = {
      clusterChoice,
      userId: additionalInfo.userId,
      password: additionalInfo.password,  // Store the password securely
      clusterApiUrl: additionalInfo.clusterApiUrl,
    };

    // Read the existing config file or initialize a new one
    let migrationConfig = {};
    if (fs.existsSync(configFilePath)) {
      migrationConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    }

    migrationConfig[type] = configData;

    // Write updated data to the config file
    fs.writeFileSync(configFilePath, JSON.stringify(migrationConfig, null, 2));

    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Cluster configuration saved.`);
  }

  // The 'init' command
  program
    .command('init')
    .description('Initialize Quick Migrate configuration')
    .action(async () => {
      await promptClusterDetails('source');
      await promptClusterDetails('target');

      console.log(`\nMigration configuration saved to ${configFilePath}`);
    });

  // Custom help command
  program
    .command('help')
    .description('Show help information for using Quick Migrate CLI')
    .action(() => {
      console.log(`
Quick Migrate CLI

Commands:
  init                    Initialize Quick Migrate configuration
  help                    Show this help message

Description:
  This CLI tool allows you to configure source and target clusters for migration. 
  Use the 'init' command to start the configuration process.

Cluster Types:
  - gke                    Google Kubernetes Engine
  - opensource             Open-source cluster
  - aks                    Azure Kubernetes Service

You can select the source and target clusters and provide the necessary details for migration.

Example Usage:
  quickmigrate init      - Start the configuration process for source and target clusters.
`);
    });

  // Parse the command line arguments
  program.parse(process.argv);
}

// Run the main function
main().catch((error) => console.error(error));
