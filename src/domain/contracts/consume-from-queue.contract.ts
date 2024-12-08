export type ConsumeFromQueueInput = {
  queue: string
  callback: (message: string) => Promise<void>
}

export interface ConsumeFromQueue {
  consume(input: ConsumeFromQueueInput): Promise<void>
}
