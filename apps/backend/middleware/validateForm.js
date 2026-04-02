import * as v from 'valibot';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = v.safeParse(schema, req.body);

    if (!result.success) {
      const flattened = v.flatten(result.issues);

      return res.status(400).json({
        message: 'Validation failed',
        errors: flattened.nested,
      });
    }

    req.validatedBody = result.output;

    next();
  };
};
