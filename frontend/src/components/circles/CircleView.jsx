import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Tab from '../Tab';
import CircleProfile from './CircleProfile';
import Chat from '../Chat';
import { getCircle } from "../../api/circlesApi";


// Used to view specific circle
const CircleView = ({ openCircle, setIsCircleOpen, style }) => {  
  const [circle, setCircle] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  useEffect(() => {
    getCircle(openCircle).then(data => setCircle(data));
  }, [openCircle]);

  if (!circle) return null;
  return (
    <Tab
      title={<span style={{ cursor: 'pointer' }} onClick={() => setDetailsOpen(true)}>{circle.name}</span>}
      onReturn={detailsOpen ? () => setDetailsOpen(false) : undefined}
      onClose={() => setIsCircleOpen(false)}
      style={style}
      padding='0'
    >
      {detailsOpen ? <CircleProfile id={openCircle} /> : <Chat id={circle.chat_id} />}
    </Tab>
  )
}

CircleView.propTypes = {
  openCircle: PropTypes.number.isRequired,
  setIsCircleOpen: PropTypes.func.isRequired,
  style: PropTypes.object
}

export default CircleView;