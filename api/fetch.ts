export function postData<R extends Record<string, any>>(url: string, data = {}): Promise<R> {
  // Default options are marked with *
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('something goes wrong')
        }
      })
      .then((res: R) => {
        if (res.status_code === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      })
      .catch((err: Error) => {
        console.log('err', err)
        reject(err)
      })
  })
}

export function getData(url = '') {
  // Default options are marked with *
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status_code === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        console.log('err', err)
        reject(err)
      })
  })
}
