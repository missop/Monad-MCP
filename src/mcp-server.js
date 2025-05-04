const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const { ethers } = require('ethers');

const MONAD_RPC_URL = 'https://testnet-rpc.monad.xyz/'; 
const provider = new ethers.JsonRpcProvider(MONAD_RPC_URL);
// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// Add an addition tool
server.tool("monad-balance",
  { address : z.string().describe("Monad testnet address to check balance for")},
  async ({address}) => {
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    return {
        "content":[{
            type:"text",
            text:balanceInEth
        }]
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
async function main() {
    await server.connect(transport);
}

main()