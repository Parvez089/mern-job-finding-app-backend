export const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}

export const checkRole = (roles) = (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
        return res.status(403).json({ message: "Access denied" })
    }

    next();
}