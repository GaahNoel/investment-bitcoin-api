export type SendToQueueInput = {
  queue: string
  data: Record<string, unknown>
}

export interface SendToQueue {
  send(input: SendToQueueInput): Promise<boolean>
}
