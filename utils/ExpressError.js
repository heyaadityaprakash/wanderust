class ExpressError extends Error {
    constructor(statuscode,message) {
        super(message)
        this.statuscode = statuscode;
        this.message = message;
        
    }
}
export default ExpressError;