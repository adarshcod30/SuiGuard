import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { suiClient } from './client.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.resolve(__dirname, '../../.env');

// Load or generate keypair
function loadOrCreateKeypair(): Ed25519Keypair {
  const envContent = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf-8') : '';
  const match = envContent.match(/^SUI_PRIVATE_KEY=(.+)$/m);

  if (match && match[1] && match[1] !== '<auto_generated>') {
    try {
      const keypair = Ed25519Keypair.fromSecretKey(
        Buffer.from(match[1].replace('suiprivkey', ''), 'base64')
      );
      console.log('🔑 Loaded existing keypair. Address:', keypair.getPublicKey().toSuiAddress());
      return keypair;
    } catch {
      console.log('⚠️  Could not parse stored key, generating new one...');
    }
  }

  const keypair = Ed25519Keypair.generate();
  const secretKey = Buffer.from(keypair.getSecretKey()).toString('base64');
  
  // Write to .env
  let newEnv = envContent.includes('SUI_PRIVATE_KEY=')
    ? envContent.replace(/^SUI_PRIVATE_KEY=.*/m, `SUI_PRIVATE_KEY=${secretKey}`)
    : envContent + `\nSUI_PRIVATE_KEY=${secretKey}`;
  
  fs.writeFileSync(ENV_PATH, newEnv);
  console.log('🔑 Generated new keypair. Address:', keypair.getPublicKey().toSuiAddress());
  console.log('💾 Private key saved to .env');
  return keypair;
}

export const keypair = loadOrCreateKeypair();
export const walletAddress = keypair.getPublicKey().toSuiAddress();

// Fund wallet from testnet faucet
export async function fundWallet(): Promise<boolean> {
  console.log(`💧 Requesting testnet SUI for ${walletAddress}...`);
  try {
    const response = await fetch('https://faucet.testnet.sui.io/v1/gas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        FixedAmountRequest: { recipient: walletAddress }
      }),
    });
    const data = await response.json() as any;
    if (data.error) {
      // Rate limited — wallet may already have funds
      console.log('ℹ️  Faucet rate limited (wallet may already have SUI)');
      return true;
    }
    console.log('✅ Testnet SUI received!');
    await new Promise(r => setTimeout(r, 3000)); // wait for indexing
    return true;
  } catch (e) {
    console.error('Faucet error:', e);
    return false;
  }
}

export async function getBalance(): Promise<number> {
  try {
    const balance = await suiClient.getBalance({
      owner: walletAddress,
      coinType: '0x2::sui::SUI',
    });
    return Number(balance.totalBalance) / 1_000_000_000;
  } catch {
    return 0;
  }
}

// Run if executed directly: node wallet.ts
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const funded = await fundWallet();
  const balance = await getBalance();
  console.log(`💰 Wallet balance: ${balance.toFixed(4)} SUI`);
  process.exit(funded ? 0 : 1);
}
