function verifyRole(requiredRoles = []) {
  return (req, res, next) => {
    const userRole = req.decoded?.role;

    if (!requiredRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied: permissions not granted" });
    }

    next();
  };
}

module.exports = verifyRole;
