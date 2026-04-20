import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided." });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log("JWT Error:", error.message);
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