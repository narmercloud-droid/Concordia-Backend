export function slowQueryDetector(threshold = 200) {
  return (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      if (ms > threshold) {
        console.warn(`[SLOW] ${req.method} ${req.url} took ${ms}ms`);
      }
    });
    next();
  };
}
