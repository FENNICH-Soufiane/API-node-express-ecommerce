export const getTokenFromHeader = (req) => {
    //get token from header
    const token = req?.headers?.authorization?.split(" ")[1];
    // console.log(token);
    
    if (token === undefined) {
        return "No token found in the header";
    } else {
        return token;
    }
};