import 'dotenv/config';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const network = (process.env.SUI_NETWORK as 'mainnet' | 'testnet' | 'devnet' | 'localnet') || 'testnet';

export const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

export async function checkConnection(): Promise<boolean> {
  try {
    const checkpoint = await suiClient.getLatestCheckpointSequenceNumber();
    console.log(`✅ Sui ${network} connected. Latest checkpoint:`, checkpoint);
    return true;
  } catch (e) {
    console.error('❌ Sui connection failed:', e);
    return false;
  }
}
