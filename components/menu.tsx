import IconButton from '@material-ui/core/IconButton';
import { default as MUIMenu } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

export type MenuOption = { optionName: string; optionValue: unknown };

interface MenuProps {
  options: Array<MenuOption>;
  handleOptionClick: (option: MenuOption, index: number) => void;
  selectedIndex?: number;
}

const MENU_ITEM_HEIGHT = 48;

export default function Menu(props: MenuProps): React.ReactElement {
  const { options, handleOptionClick, selectedIndex } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (_e: React.MouseEvent<HTMLElement>, index: number) => {
    handleOptionClick(options[index], index);
    handleMenuClose();
  };

  return (
    <div>
      <IconButton
        color="primary"
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <MUIMenu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: MENU_ITEM_HEIGHT * 4.5,
            width: '20ch'
          }
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} onClick={(e) => handleClick(e, index)} selected={index === selectedIndex}>
            {option.optionName}
          </MenuItem>
        ))}
      </MUIMenu>
    </div>
  );
}
