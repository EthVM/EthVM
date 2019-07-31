const hexCharacters = 'abcdef0123456789';

export function randomAddress() {
  let result = '0x';
  for (let i = 0; i < 40; i++) {
    const idx = Math.floor(Math.random() * hexCharacters.length);
    result += hexCharacters.charAt(idx);
  }
  return result;
}

export function randomValue() {
  return Math.floor(Math.random() * 10000000000000);
}

/**
 *
 * @callback f
 * @param timeout
 * @returns {Promise}
 */
export async function awaitableTimeout(f, timeout) {

  return new Promise((resolve, reject) => {

    setTimeout(async () => {
      try {
        resolve(await f());
      } catch (e) {
        reject(e);
      }
    }, timeout);

  });

}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
