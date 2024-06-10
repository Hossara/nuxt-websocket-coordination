import { hash } from "ohash"
import { klona } from 'klona';
import { applyPatch } from "mendoza";

export const useSharedState = <T extends Record<string, any>>(id = "state") => {
  const state = useState(() => ({}) as T)

  // Prefetch state before data send to client
  onServerPrefetch(async () => {
    // Fetch state
    const data = await $fetch(`/api/state/${id}`, {
      responseType: 'json'
    })

    // Set server fetch data or empty state
    state.value = data as T || {}
  })

  // Send back to client
  if(import.meta.client) {
    let snapshot = hash(state.value)
    let oldState = klona(state.value)
    let paused = false

    // Initilize websocket client
    const ws = useWebsocket()!

    const diff = useMendoza()!

    // Send new state changes to server
    const syncState = async (newState: T) => {
      if(paused) {
        paused = false
        return
      }

      // Check if websocket ready
      await ws.ready

      const patch = await diff(oldState, newState)

      // Send new state to all subscribers and server using websocket
      ws.ws.send(JSON.stringify({id, patch}))

      // Send new state to server
      // await $fetch(`/api/state/${id}`, {
      //   method: "PUT",
      //   body: newState
      // })
    }

    // On recieve any message
    ws.ws.addEventListener("message", event => {
      const data = JSON.parse(event.data)

      // Check the cache id
      if(data.id === id) {
        const newState = applyPatch(oldState, data.patch)
        const newSnapshot = hash(newState)

        // Chech if data hash is as the same as previous data (Avoid duplication)
        if(newSnapshot !== snapshot) {
          // Set a new data hash
          snapshot = newSnapshot

          // Pause sending data
          paused = true

          // Update state
          state.value = newState

          oldState = klona(newState)
        }
      }
    })
    
    // Watch deeply if state changes
    watch(state, syncState, {deep: true, flush: "post"})
  }

  return state
}