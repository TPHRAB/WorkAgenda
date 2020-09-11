import React, { useEffect, useState } from 'react'
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
import 'assets/css/schedule.css'


const localizer = momentLocalizer(moment)

const now = new Date()

let myEventsList = [
  {
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    title: 'Point in Time Event',
    start: now,
    end: now,
  },
]

export default function Schedule() {

  // states
  const [events, setEvents] = useState(myEventsList);
  const [createEventOpen, setCreateEventOpen] = useState(false);

  // funcitons
  const handleSelect = ({ start, end }) => {
    console.log(start, end)
    const title = window.prompt('New Event name')
    if (title)
      setEvents([{ start, end, title }, ...events]);
  }

  // initialize
  useEffect(() => {

  }, []);

  return (
    <>
      <NewEvent createEventOpen={createEventOpen} setCreateEventOpen={setCreateEventOpen} />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span
          style={{
            fontSize: '15px',
          }}
        >
          <Chip label={<b style={{ color: 'green' }}>Today's Event: 1</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
        </span>
        <Button type="button" color="info" onClick={() => setCreateEventOpen(true)}>Submit Bug</Button>
      </div>
      <Card>
        <CardBody className="max-height">
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultDate={new Date()}
            onSelectEvent={event => alert(event.title)}
            onSelectSlot={handleSelect}
          />
        </CardBody>
      </Card>
    </>
  )
}