import { useCallback, useState } from "react"

export const useClientRect = () => {
    const [clientRect, setClientRect] = useState(null);
    const ref = useCallback(node => {
        if (node !== null) {
            setClientRect(node.getBoundingClientRect());
        }
    }, []);
    
    return [ref, clientRect]; 
}