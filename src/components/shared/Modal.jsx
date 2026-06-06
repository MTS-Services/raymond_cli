import { Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'w-3/4 max-w-3xl',
    lg: 'w-3/4 max-w-4xl',
    xl: 'w-3/4 max-w-6xl',
    full: 'max-w-full mx-4',
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <Fragment>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-[fadeIn_0.2s_ease-out]'
        onClick={handleOverlayClick}
      >
        {/* Centering wrapper */}
        <div className='flex items-center justify-center min-h-screen p-4'>
          {/* Modal panel */}
          <div
            className={`bg-white rounded-xl shadow-2xl w-full ${sizes[size]} animate-[slideUp_0.3s_ease-out] ${className}`}
            role='dialog'
            aria-modal='true'
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                {title && (
                  <h2
                    id='modal-title'
                    className='text-xl font-semibold text-gray-900'
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    type='button'
                    onClick={onClose}
                    className='ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer'
                    aria-label='Close modal'
                  >
                    <X size={22} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className='p-6 max-h-[calc(100vh-200px)] overflow-y-auto'>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className='flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl'>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
