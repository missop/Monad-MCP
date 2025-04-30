const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { ethers } = require('ethers');


const MONAD_RPC_URL = 'https://testnet-rpc.monad.xyz/'; 
const provider = new ethers.JsonRpcProvider(MONAD_RPC_URL);
const app = new Koa();
const router = new Router();

// 中间件
app.use(bodyParser());

// 健康检查
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' };
});
router.get('/balance', async (ctx) => {
    const {address} = process.env
    try {
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
  
      ctx.body = {
        address,
        balance: balanceInEth,
        unit: 'MONAD',
        status:200
      };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch balance', details: err.message };
    }
  });

// 挂载路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
});