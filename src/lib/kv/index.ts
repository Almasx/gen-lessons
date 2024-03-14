import { Redis } from '@upstash/redis'

export const kv = new Redis({
    url: 'https://enormous-hippo-34820.upstash.io',
    token: 'AYgEASQgNzBkMzQ3MzgtYmMxMC00NDMyLTk1ZTQtZDAwMDI2MDBiYWU5OTZhN2MxNDAyOTMyNDA4ZDg2ZGU5MmQzZmM2MDdmNDM=',
})