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
 *           Happens on Txs Details Page, tx is no longer in db. Was most likely was dropped and exceeded limit in db
 **/
const excpTxDoNotExists = 'cannot return null for non-nullable field query.gettransactionbyhash'

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
        newE.includes(excpInvalidHash)
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
