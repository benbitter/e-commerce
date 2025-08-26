const sanitizeUser=(user)=>{
    return {_id:user._id,email:user.email,isAdmin:user.isAdmin}
}

export { sanitizeUser };
