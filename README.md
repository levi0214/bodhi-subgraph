# Bodhi Subgraph

This subgraph indexes data from the Bodhi protocol and official apps.

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Copy config files:
   ```bash
   cp networks.json.example networks.json
   cp subgraph.yaml.example subgraph.yaml
   ```

3. Generate code:
   ```bash
   yarn codegen
   ```

## Deployment

### Optimism Network

1. Build the subgraph:
   ```bash
   yarn build:op
   ```

2. Deploy to The Graph Studio:
   
   Visit [The Graph Studio](https://thegraph.com/studio/) to get your API key and studio name, then:
   ```bash
   graph deploy --studio YOUR_STUDIO_NAME
   ```

### Local Network

For local network development (e.g., Anvil or Hardhat node):

```bash
yarn build:local
yarn create:local
yarn deploy:local
```