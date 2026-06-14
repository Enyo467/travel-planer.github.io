import React from 'react';
import '../App.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, title, children }) => {
    if (!isOpen) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSave();
        }
    };

    return (
        <div className="modal-overlay" onKeyDown={handleKeyDown}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>X</button>
                <h2 style={{ marginBottom: '20px' }}>{title}</h2>
                {children}
                <button className="save-btn" onClick={onSave}>Zapisz</button>
            </div>
        </div>
    );
};

export default Modal;
