import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
export const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        const userRole = user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};
//# sourceMappingURL=token.js.map