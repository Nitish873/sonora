const jwt = require('jsonwebtoken');

async function authArtist(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message : 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        if(decoded.role !== 'artist'){
            return res.status(403).json({message : "Access denied: Artist role required"});
        }

        req.user = decoded;
        next();
    }
    catch(err){
        res.clearCookie('token');
        return res.status(401).json({message : 'Invalid or expired session. Please log in again.'});
    }
}

async function authUser(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message : 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role!=='user' && decoded.role!=='artist'){
            return res.status(403).json({message : "Access denied"});
        }

        req.user = decoded;
        next();
    }
    catch(err){
        res.clearCookie('token');
        return res.status(401).json({message : 'Invalid or expired session. Please log in again.'});
    }
}

module.exports = { authArtist, authUser };
