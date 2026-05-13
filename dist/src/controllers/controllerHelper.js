export function controller(handlers) {
    const wrapped = {};
    for (const [name, handler] of Object.entries(handlers)) {
        wrapped[name] = async (req, res, next) => {
            try {
                await handler(req, res, next);
            }
            catch (err) {
                next(err);
            }
        };
    }
    return wrapped;
}
