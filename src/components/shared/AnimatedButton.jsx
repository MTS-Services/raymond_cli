import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useGsapButton } from '../../hooks/useGsapButton';

const AnimatedButton = memo(
  ({
    to,
    href,
    type = 'button',
    disabled = false,
    className = '',
    children,
    onClick,
    ...rest
  }) => { 
    const ref = useGsapButton();
    const isHashLink = typeof href === 'string' && href.startsWith('#');

    const handleHashClick = (event) => {
      onClick?.(event);
      if (event.defaultPrevented || !isHashLink) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', href);
    };

    if (to) {
      return (
        <Link ref={ref} to={to} className={className} onClick={onClick} {...rest}>
          {children}
        </Link>
      );
    }

    if (href) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          onClick={handleHashClick}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={className}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
