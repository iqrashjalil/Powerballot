const errorMiddleware = (err, req, res, next) => {
     let message = err.message || "Internal Server Error";
     let statusCode = err.status || 500;


res.status(statusCode).json({
    success: false,
    message: message,
});
}
export default errorMiddleware;