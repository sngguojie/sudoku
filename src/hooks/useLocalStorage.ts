import { useState } from "react"

function getLocalStorage<T>(key: string): undefined | T {
  const data = localStorage.getItem(key);
  return data === null ? undefined : JSON.parse(data);
}
function updateLocalStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// This allows updating local storage whenever there is an update
// When there is a reload, we default to using the value in localStorage if it exists
const useLocalStorage = <T>(key: string, initialValue?: T) => {
  let localStorageValue = getLocalStorage<T>(key)
  let defaultValue: T | undefined = initialValue
  if (localStorageValue !== undefined) {
    defaultValue = localStorageValue
  }

  const [stateValue, setStateValue] = useState<T>(defaultValue!)
  
  const setValue = (newValue: T) => {
    setStateValue(newValue)
    updateLocalStorage(key, newValue)
  }
  return [stateValue, setValue] as [T, (newValue: T) => void]
}

export default useLocalStorage