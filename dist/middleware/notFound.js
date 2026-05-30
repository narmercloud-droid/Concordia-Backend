export function notFound(req, res) {
    res.status(404).tson({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
}
