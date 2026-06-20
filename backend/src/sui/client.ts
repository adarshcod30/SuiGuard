import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

export const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'),
});

export async function checkConnection(): Promise<boolean> {
  try {
    const checkpoint = await suiClient.getLatestCheckpointSequenceNumber();
    console.log('✅ Sui testnet connected. Latest checkpoint:', checkpoint);
    return true;
  } catch (e) {
    console.error('❌ Sui connection failed:', e);
    return false;
  }
}
