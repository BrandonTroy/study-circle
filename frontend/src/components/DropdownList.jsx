import { PropTypes } from 'prop-types';
import { useState } from 'react';
import { Box, Collapse, ListItemButton, Typography, List } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const DropdownList = ({
  items,
  title,
  titleVariant,
  titleSx,
  additionalHeaderContent,
  noItemsContent,
  showCount,
  startOpen,
  disableRippleOnToggle,
  disableRippleOnItems,
  renderItem,
  onClickItem
}) => {
  const [open, setOpen] = useState(Boolean(startOpen));

  return (
    <Box>
      <ListItemButton
        disableRipple={disableRippleOnToggle}
        onClick={() => setOpen(!open)}
        sx={{ justifyContent: 'space-between' }}
      >
        <Typography variant={titleVariant} display='flex' alignItems='center' sx={titleSx}>
          {title}
          {showCount && items.length > 0 && <span style={{ color: 'grey' }}>&nbsp;{'(' + items.length + ')'}</span>}
        </Typography>
        {additionalHeaderContent}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {items.map((item, index) => (
            <ListItemButton
              disableRipple={disableRippleOnItems}
              key={index}
              onClick={() => onClickItem(item)}
            >
              {renderItem(item)}
            </ListItemButton>
          ))}
          {items.length === 0 && (
            typeof noItemsContent === 'string' ?
            <Typography color='grey' textAlign='center'>{noItemsContent}</Typography>
            : noItemsContent
          )}
        </List>
      </Collapse>
    </Box>
  );
}

DropdownList.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  titleVariant: PropTypes.string,
  titleSx: PropTypes.object,
  additionalHeaderContent: PropTypes.node,
  noItemsContent: PropTypes.node,
  showCount: PropTypes.bool,
  startOpen: PropTypes.bool,
  disableRippleOnToggle: PropTypes.bool,
  disableRippleOnItems: PropTypes.bool,
  renderItem: PropTypes.func.isRequired,
  onClickItem: PropTypes.func,
}

DropdownList.defaultProps = {
  noItemsContent: 'None',
}

export default DropdownList;