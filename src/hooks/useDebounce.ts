import { useRef } from "react";

interface Function {
    func: () => void;
}

const useDebounce = () => {
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const debounce = (props: Function, delay: number) => {
        const { func } = props;
        if(debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            func()
            debounceTimeout.current = null;
        }, delay)
    };

    return debounce
}

export default useDebounce;