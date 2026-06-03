import Joi from 'joi';

export function validate(schema) {
  return (req, res, next) => {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query
    };

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    next();
  };
}
