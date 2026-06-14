import { useEffect, type RefObject } from 'react';

export function useClickOutside(
    isOpen: boolean,
    onClose: () => void,
    refs: RefObject<HTMLElement | null>[]
) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (refs.every(ref => !ref.current?.contains(target))) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, onClose]);
}
