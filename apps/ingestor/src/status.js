const STATUS_FILE = 'status'

class Status {
  constructor(db) {
    this.db = db
  }

  getLastBlock() {
    return new Promise((resolve, reject) => {
      this.db
        .get(STATUS_FILE)
        .then(data => {
          if (data.lastBlock) return resolve(data.lastBlock)
          else return resolve(0)
        })
        .catch(err => {
          if (err.code === 'NoSuchKey') return resolve(0)
          else return reject(err)
        })
    })
  }

  setLastBlock(newBlock) {
    return new Promise((resolve, reject) => {
      let _data = {}
      this.db
        .get(STATUS_FILE)
        .then(data => {
          _data = data
          _data.lastBlock = newBlock
          this.db
            .put(STATUS_FILE, _data)
            .then(resolve)
            .catch(reject)
        })
        .catch(err => {
          if (err.code === 'NoSuchKey') {
            _data.lastBlock = newBlock
            this.db
              .put(STATUS_FILE, _data)
              .then(resolve)
              .catch(reject)
          } else return reject(err)
        })
    })
  }
}

export default Status
