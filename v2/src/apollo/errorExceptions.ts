/*------------------------------------------------------------------*/
/* LIST OF ALL API ERRORS TO BE HANDLED ON FRONT END AS NONE ERRORS */
/*------------------------------------------------------------------*/

/**
 *  @event -  This error is received, when there is an invalid hash. Happens when a user is trying to search for a valid hash or address.
 **/
const excpInvalidHash = 'invalid hash'

/**
 *  @event -  This error is recieved, when block has not been mined yet. Happens on Block Details Page,
 *            when a user is looking for a valid block hash or a valid block Number
 **/
const excpBlockNotMined = 'block not found'

/**
 *  @event - This error is recieved, when an uncle has not been mined yet. Happens on Uncles Details Page,
 *           when a user is looking for a valid block hash or a valid block Number
 **/
const excpUncleNotFound = 'uncle not found'

/**
 *  @event - This error is recieved, a user inputs a valid eth tx hash, but transaction does not exhist.
 *           Happens on Txs Details Page, tx is no longer in db. Was most likely dropped and exceeded limit in db
 **/
const excpTxDoNotExists = 'transaction not found'

/**
 *  @event - This error is recieved, when an Address is a not contract.
 *           Happens on Address Details Page, when we check whether or not address is a contract
 **/
const excpAddrNotContract = 'no contract found'

/**
 *  @event - This error is thrown, when an fetchMore is still pending, but user navigated to a different Page.
 *           Happens on all pages with FetchMore
 **/
const excpInvariantViolation = 'invariant violation'

/**
 *  @event - This error is thrown, when an fetching large numbers in query params ( graphql int is max of 32 bits, ).
 *          Happens when user requests block number info ( details, transfers, etc).
 *          This can be safely ignored since this kinda of blocks 2bil+ are not  being mined yet, but user still can search for it.
 **/
const excpIntViolation = 'int cannot represent non 32-bit signed integer value'

/**
 *  @function = checks whether or no an error is an exepction in production mode
 *  @param {string} - errorMessage
 *  @returns {boolean}
 **/
const isAPIExceptionProduction = (errorMessage: string): boolean => {
    const newE = errorMessage.toLowerCase()
    return (
        newE.includes(excpBlockNotMined) ||
        newE.includes(excpTxDoNotExists) ||
        newE.includes(excpUncleNotFound) ||
        newE.includes(excpAddrNotContract) ||
        newE.includes(excpInvariantViolation) ||
        newE.includes(excpInvalidHash) ||
        newE.includes(excpIntViolation)
    )
}

/**
 *  @function = checks whether or no an error is an exepction in development mode
 *  @param {string} - errorMessage
 *  @returns {boolean}
 **/
const isAPIExceptionDev = (errorMessage: string): boolean => {
    return errorMessage.toLowerCase().includes(excpAddrNotContract)
}

export { isAPIExceptionProduction, isAPIExceptionDev, excpBlockNotMined, excpTxDoNotExists, excpUncleNotFound, excpAddrNotContract, excpInvariantViolation }
