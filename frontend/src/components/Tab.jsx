import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Box, IconButton, Typography, Toolbar } from '@mui/material';
import { Close as CloseIcon, NavigateBefore as ReturnIcon } from "@mui/icons-material";
import { scrollBarWidth } from '../styles/theme';

/**
 * This component renders a tab with a header containing title, return button, and close button.
 * No header will be rendered if none of those three props are provided
 * @param {Node} title the title of the tab, can be a string or a component
 * @param {Function} onReturn function to call when the return button is clicked
 * @param {Function} onClose function to call when the close button is clicked
 * @param {Object} style custom styles for outer Box container of the tab
 * @param {String} padding custom padding around the content of the tab
 */
const Tab = ({ title, leftHeaderContent, rightHeaderContent, onReturn, onClose, style, padding, dontOffsetScrollbarPadding, children }) => {
  const doRenderToolbar = title || onReturn || onClose;
  const contentRef = useRef(null);
  
  useEffect(() => {
    const element = contentRef.current;
    if (!dontOffsetScrollbarPadding && element && element.scrollHeight > element.clientHeight) {
      const newPadding = parseInt(window.getComputedStyle(element)['padding-right']) - scrollBarWidth;
      element.style.paddingRight = newPadding + 'px';
    }
  }, [dontOffsetScrollbarPadding, children]);
  

  return (
    <Box style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      paddingTop: '0.2rem',
      ...style
    }}>
      {doRenderToolbar &&
        <Toolbar
          style={{
            padding: '0 0.25rem',
            minHeight: '2.25rem',
            borderBottom: '1px solid darkgray',
          }}
        >
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            {onReturn &&
              <IconButton size="small" onClick={onReturn}>
                <ReturnIcon sx={{  fontSize: '1.6em', margin: '-0.1rem' }} />
              </IconButton>
            }
            {leftHeaderContent}
          </Box>
          <Typography variant="h6" textAlign="center" flex={2}>{title}</Typography>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {rightHeaderContent}
            {onClose &&
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            }
          </Box>
        </Toolbar>
      }
      <Box
        ref={contentRef}
        style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        padding: padding || '0 1rem 1rem',
      }}>
        {children}
      </Box>
    </Box>
  );
}

Tab.propTypes = {
  title: PropTypes.node,
  leftHeaderContent: PropTypes.node,
  rightHeaderContent: PropTypes.node,
  onReturn: PropTypes.func,
  onClose: PropTypes.func,
  style: PropTypes.object,
  padding: PropTypes.string,
  dontOffsetScrollbarPadding: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Tab;