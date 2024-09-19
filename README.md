# Bodhi Subgraph

This subgraph indexes data from the Bodhi protocol and official apps.

## Getting Started

1. Install dependencies:

    ```bash
    yarn install
    ```

2. Copy configuration files:

    ```bash
    cp networks.json.example networks.json
    cp subgraph.yaml.example subgraph.yaml
    ```

3. Generate code:

    ```bash
    yarn codegen
    ```

## Deploying the Subgraph

### Optimism Network

To deploy on the Optimism network, run:

```bash
yarn build:op
yarn deploy
```

### Local Network

For local network development (e.g., Anvil or Hardhat node), run:

```bash
yarn build:local
yarn create:local
yarn deploy:local
```