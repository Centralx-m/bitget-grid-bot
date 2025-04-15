import applyMiddlewares from './middlewares';
import db from './lib/db';
import { validateBotConfig } from './middlewares/validator';

async function handler(req, res) {
  try {
    const { action } = req.method === 'GET' ? req.query : req.body;
    const userId = req.headers['x-user-id']; // From authentication

    if (req.method === 'POST' && action === 'start') {
      const validation = validateBotConfig(req.body);
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.error
        });
      }

      const botConfig = {
        ...validation.value,
        userId,
        active: true,
        createdAt: new Date().toISOString()
      };

      await db.saveBotConfig(userId, botConfig);
      
      return res.json({
        success: true,
        message: 'Bot started successfully',
        botId: userId // Using user ID as bot identifier
      });

    } else if (req.method === 'POST' && action === 'stop') {
      await db.saveBotConfig(userId, { active: false });
      
      return res.json({
        success: true,
        message: 'Bot stopped successfully'
      });

    } else if (req.method === 'GET' && action === 'history') {
      const history = await db.getTradeHistory(userId);
      return res.json({
        success: true,
        history
      });

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

export default applyMiddlewares(handler);