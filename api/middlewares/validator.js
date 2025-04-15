import Joi from 'joi';

const tradingPairSchema = Joi.string()
  .pattern(/^[A-Z]{3,}\/[A-Z]{3,}$/)
  .required();

const botConfigSchema = Joi.object({
  tradingPair: tradingPairSchema,
  investment: Joi.number().positive().required(),
  upperPrice: Joi.number().positive().required(),
  lowerPrice: Joi.number().positive().less(Joi.ref('upperPrice')).required(),
  gridLevels: Joi.number().integer().min(5).max(200).required()
});

export function validateBotConfig(data) {
  const { error, value } = botConfigSchema.validate(data, {
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { error: errors };
  }

  return { value };
}