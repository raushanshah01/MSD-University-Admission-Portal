// Keyboard shortcuts for better accessibility and productivity

export const setupKeyboardShortcuts = (navigate) => {
  const handleKeyPress = (event) => {
    // Check if user is typing in an input field
    const isInputFocused = 
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.isContentEditable;

    // Don't trigger shortcuts when typing
    if (isInputFocused && !event.ctrlKey && !event.altKey && !event.metaKey) {
      return;
    }

    // Ctrl/Cmd + K: Search courses
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      navigate('/courses');
    }

    // Ctrl/Cmd + H: Go home
    if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
      event.preventDefault();
      navigate('/');
    }

    // Ctrl/Cmd + D: Go to dashboard
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'applicant') {
        navigate('/applicant');
      }
    }

    // Ctrl/Cmd + /: Show help
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault();
      navigate('/help');
    }

    // Escape: Close modals or go back
    if (event.key === 'Escape') {
      // Custom escape handling can be added here
      console.log('Escape pressed');
    }

    // Alt + 1-9: Quick navigation
    if (event.altKey && /^[1-9]$/.test(event.key)) {
      event.preventDefault();
      const shortcuts = [
        '/', // Alt+1: Home
        '/courses', // Alt+2: Courses
        '/applicant/apply', // Alt+3: Apply
        '/applicant/applications', // Alt+4: My Applications
        '/profile', // Alt+5: Profile
        '/help', // Alt+6: Help
      ];
      const index = parseInt(event.key) - 1;
      if (shortcuts[index]) {
        navigate(shortcuts[index]);
      }
    }
  };

  document.addEventListener('keydown', handleKeyPress);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
};

// Show keyboard shortcuts help modal
export const showKeyboardShortcutsHelp = () => {
  const shortcuts = [
    { keys: 'Ctrl/Cmd + K', description: 'Search Courses' },
    { keys: 'Ctrl/Cmd + H', description: 'Go to Home' },
    { keys: 'Ctrl/Cmd + D', description: 'Go to Dashboard' },
    { keys: 'Ctrl/Cmd + /', description: 'Show Help' },
    { keys: 'Alt + 1', description: 'Navigate to Home' },
    { keys: 'Alt + 2', description: 'Navigate to Courses' },
    { keys: 'Alt + 3', description: 'Start Application' },
    { keys: 'Alt + 4', description: 'View My Applications' },
    { keys: 'Alt + 5', description: 'View Profile' },
    { keys: 'Alt + 6', description: 'Open Help' },
    { keys: 'Escape', description: 'Close Modal/Cancel' },
  ];

  return shortcuts;
};
