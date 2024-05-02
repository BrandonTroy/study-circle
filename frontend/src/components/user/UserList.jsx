import PropTypes from 'prop-types';
import { useContext } from 'react';
import User from './User';
import DropdownList from '../DropdownList';
import ProfileContext from '../../contexts/ProfileContext';

const UserList = ({
  users,
  title,
  titleVariant,
  titleSx,
  noItemsContent,
  showCount,
  startOpen,
  disableRippleOnToggle
}) => {
  const openProfile = useContext(ProfileContext);
  
  return (
    <DropdownList
      items={users}
      title={title}
      titleVariant={titleVariant}
      titleSx={titleSx}
      noItemsContent={noItemsContent}
      showCount={showCount}
      startOpen={startOpen}
      disableRippleOnToggle={disableRippleOnToggle}
      disableRippleOnItems
      renderItem={user => <User object={user} />}
      onClickItem={user => openProfile(user.id)}
    />
  );
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  titleVariant: PropTypes.string,
  titleSx: PropTypes.object,
  noItemsContent: PropTypes.node,
  showCount: PropTypes.bool,
  startOpen: PropTypes.bool,
  disableRippleOnToggle: PropTypes.bool,
}

UserList.defaultProps = {
  title: 'Users',
  titleVariant: 'h6',
  showCount: true
}

export default UserList;