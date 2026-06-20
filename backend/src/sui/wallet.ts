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
      // Try loading as raw base64 secret key
      const decoded = Buffer.from(match[1], 'base64');
      // The decoded key might have a prefix (suiprivkey1...) or be raw bytes
      // Ed25519 secret key is 32 bytes, but with prefix it could be longer
      if (decoded.length >= 32) {
        const keypair = Ed25519Keypair.fromSecretKey(decoded.slice(0, 32));
        console.log('🔑 Loaded existing keypair. Address:', keypair.getPublicKey().toSuiAddress());
        return keypair;
      }
    } catch {
      // Try as bech32 encoded key
      try {
        const keypair = Ed25519Keypair.fromSecretKey(match[1]);
        console.log('🔑 Loaded existing keypair (bech32). Address:', keypair.getPublicKey().toSuiAddress());
        return keypair;
      } catch {
        console.log('⚠️  Could not parse stored key, generating new one...');
      }
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

// Fund wallet (Disabled for Mainnet)
export async function fundWallet(): Promise<boolean> {
  console.log(`⚠️  Faucet is disabled on Mainnet. Please send SUI to ${walletAddress} manually.`);
  return false;
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
  const balance = await getBalance();
  console.log(`💰 Wallet balance: ${balance.toFixed(4)} SUI`);
  if (balance < 0.01) {
    console.log(`⚠️  ACTION REQUIRED: Send SUI to ${walletAddress} for execution.`);
  }
  process.exit(0);
}
