import React, { useEffect, useState, useContext } from 'react'
// @material-ui
import Chip from '@material-ui/core/Chip';
// utils
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// core
import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody';
import Button from 'components/CustomButtons/Button';
import NewEvent from 'components/NewEvent/NewEvent';
import { ProjectContext } from 'layouts/Project';
import Event from 'components/Event/Event';
import 'assets/css/schedule.css'

const localizer = momentLocalizer(moment)

export default function Schedule() {
  // context
  const { pid, showPopupMessage } = useContext(ProjectContext);

  // states
  const [selectedEvent, setSelectedEvent] = useState({});
  const [showEvent, setShowEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [todayCount, setTodayCount] = useState(0);

  // functions
  const setOnShowEvent = (event) => {
    setSelectedEvent(event);
    setShowEvent(true);
  }

  // initialize
  useEffect(() => {
    fetch('/api/get-events?' + new URLSearchParams({ pid }))
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot connect to the server');
        return res;
      })
      .then(res => res.json())
      .then(events => {
        let count = 0;
        let today = moment();
        events.forEach(e => {
          let start = moment(e['start']);
          let end = moment(e['end']);
          if (today.isSameOrAfter(start, 'day') && today.isSameOrBefore(end, 'day'))
            count++;
          e['start'] = start.toDate();
          e['end'] = end.toDate();
        });
        setEvents(events);
        setTodayCount(count);
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      });
  }, []);


  return (
    <>
      <Event showEvent={showEvent} setShowEvent={setShowEvent} selectedEvent={selectedEvent} />
      <NewEvent createEventOpen={createEventOpen} setCreateEventOpen={setCreateEventOpen} />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span
          style={{
            fontSize: '15px',
          }}
        >
          <Chip label={<b style={{ color: 'green' }}>Today's Event: {todayCount}</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
        </span>
        <Button type="button" color="info" onClick={() => setCreateEventOpen(true)}>Create Event</Button>
      </div>
      <Card>
        <CardBody className="max-height">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultDate={new Date()}
            onSelectEvent={setOnShowEvent}
          />
        </CardBody>
      </Card>
    </>
  )
}