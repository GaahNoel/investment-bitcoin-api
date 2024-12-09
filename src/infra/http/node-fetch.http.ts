import { HttpGetClient, HttpGetClientInput } from '../contracts/http-client.contract'

export class NodeFetch implements HttpGetClient {
  async get<T>(input: HttpGetClientInput): Promise<T> {
    const url = new URL(input.url)
    const query = input.query

    if (query !== undefined) {
      Object.keys(query).forEach((key) => {
        url.searchParams.append(key, query[key])
      })
    }

    const rawResponse = await fetch(url.toString(), {
      method: 'GET',
    })

    return await rawResponse.json()
  }
}
