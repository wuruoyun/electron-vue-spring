export default interface Interop {
  log: {
    info: (msg: string) => void
    debug: (msg: string) => void
    warn: (msg: string) => void
    error: (msg: string) => void
    log: (msg: string) => void
  }
  setBadgeCount: (count: Number) => void
  showOpenDialog: () => Promise<string[] | undefined>
  showSaveDialog: () => Promise<string | undefined>
}
