import * as MicrosoftGraph from '@microsoft/microsoft-graph-client'
import moment from 'moment'
import striptags from 'striptags'
import { AllHtmlEntities as Entities } from 'html-entities'

const log = require('debug')('basebot:services:calendar:log')
const error = require('debug')('basebot:services:calendar:error')

const entities = new Entities()

const responseStatuses = {
  none: '#a9a9a9', // gray
  organizer: '#32cd32', // green
  tentativelyAccepted: '#f5b455', // yellow
  accepted: '#32cd32', // green
  declined: '#e41d1d', // red
  notResponded: '#a9a9a9' // gray
}

const getEvents = async ({ token }, query = {}) => {
  query = Object.assign({
    top: 1,
    daysAhead: 100
  }, query)
  if (token) {
    // Initialize Graph client
    const client = MicrosoftGraph.Client.init({
      authProvider: (done) => {
        done(null, token)
      }
    })

    // Set start of the calendar view to today, right now
    const start = new Date()
    // Set end of the calendar view to x days from start
    const end = new Date(new Date(start).setDate(start.getDate() + query.daysAhead))

    log('fetching event(s)')
    try {
      // Get the first x events for the coming x days
      const result = await client
        .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
        .top(query.top)
        .select('subject,start,end,attendees,body,isCancelled,onlineMeetingUrl,location,organizer,responseStatus,webLink')
        .orderby('start/dateTime')
        .get()
      const attachments = result.value.map(event => {
        console.log(event)
        const attachment = {
          title: event.subject,
          thumb: `https://dummyimage.com/75x75/0074c6/ffffff.png&text=${moment(event.start).format('MMM Do')}`,
          color: responseStatuses[event.responseStatus.response],
          buttons: [{
            text: 'View Event',
            url: event.webLink
          }],
          // text: entities.decode(striptags(event.body.content)),
          values: [
            {
              key: 'Starts',
              value: moment(event.start.dateTime).format('HH:mm, DD/MM/YY')
            },
            {
              key: 'Ends',
              value: moment(event.end.dateTime).format('HH:mm, DD/MM/YY')
            }
          ]
        }
        if (event.location && event.location.displayName) {
          attachment.values.push({
            key: 'Location',
            value: event.location.displayName
          })
        }
        if (event.organizer && event.organizer.emailAddress) {
          attachment.values.push({
            key: 'Organiser',
            value: event.organizer.emailAddress.name
          })
        }
        if (event.onlineMeetingUrl) {
          attachment.buttons.push(
            {
              text: 'Start Online Meeting',
              url: event.onlineMeetingUrl
            }
          )
        }
        return attachment
      })
      return {
        attachments,
        success: true
      }
    } catch (err) {
      error(err)
      return {
        err,
        success: false
      }
    }
  }
}

export {
  getEvents
}
