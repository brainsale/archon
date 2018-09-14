import isRequired from '../utils/isRequired'
import * as errorConstants from '../constants/error'

/**
 * EventListener is used to watch events on the blockchain for a set of contracts.
 * Handlers for specific events can be added. When an event log is found EventListener
 * will fire all handlers registered for the contract.
 */
class EventListener {
  /**
   * Fetch all logs from contractInstance in a block range.
   * @param {object} contractInstance - Contract instance.
   * @param {number} firstBlock - Lower bound of search range.
   * @param {number} lastBlock - Upper bound of search range.
   * @returns {Promise} All events in block range.
   */
  static getAllEventLogs = async (
    contractInstance = isRequired('contractInstance'),
    firstBlock = 0,
    lastBlock = 'latest'
  ) =>
    Promise.all(
      contractInstance.allEvents({
          fromBlock: firstBlock,
          toBlock: lastBlock
        })
        .get((error, result) => {
          if (error)
            throw new Error(errorConstants.ERROR_FETCHING_EVENTS(error))

          return result
        })
    )

  /**
   * Fetch logs from contractInstance for a specific event in a block range.
   * @param {object} contractInstance - Contract instance.
   * @param {string} eventName - Name of the event.
   * @param {number} firstBlock - Lower bound of search range.
   * @param {number} lastBlock - Upper bound of search range.
   * @param {object} filters - Extra filters
   * @returns {Promise} All events in block range.
   */
  static getEventLogs = async (
    contractInstance = isRequired('contractInstance'),
    eventName = isRequired('eventName'),
    firstBlock = 0,
    lastBlock = 'latest',
    filters = {}
  ) => {
    return new Promise((resolve, reject) => {
      contractInstance[eventName](filters, {
        fromBlock: firstBlock,
        toBlock: lastBlock
      }).get((error, result) => {
        if (error) reject(errorConstants.ERROR_FETCHING_EVENTS(error))

        resolve(result)
      })
    })
  }
}

export default EventListener
