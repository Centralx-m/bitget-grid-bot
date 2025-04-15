import { createClient } from '@supabase/supabase-js';
import { encrypt, decrypt } from './crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Using service key for admin operations
);

export default {
  async saveBotConfig(userId, config) {
    // Encrypt sensitive data
    const encryptedConfig = {
      ...config,
      apiKey: encrypt(config.apiKey),
      apiSecret: encrypt(config.apiSecret),
      passphrase: encrypt(config.passphrase)
    };

    const { data, error } = await supabase
      .from('bot_configs')
      .upsert(
        { user_id: userId, ...encryptedConfig },
        { onConflict: 'user_id' }
      )
      .select();

    if (error) throw new Error(`Database error: ${error.message}`);
    return data;
  },

  async getBotConfig(userId) {
    const { data, error } = await supabase
      .from('bot_configs')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    
    if (!data) return null;

    // Decrypt sensitive data
    return {
      ...data,
      apiKey: decrypt(data.apiKey),
      apiSecret: decrypt(data.apiSecret),
      passphrase: decrypt(data.passphrase)
    };
  },

  async logTrade(userId, tradeData) {
    const { data, error } = await supabase
      .from('trade_history')
      .insert([{ user_id: userId, ...tradeData }]);

    if (error) throw new Error(`Database error: ${error.message}`);
    return data;
  },

  async getTradeHistory(userId, limit = 100) {
    const { data, error } = await supabase
      .from('trade_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Database error: ${error.message}`);
    return data;
  }
};