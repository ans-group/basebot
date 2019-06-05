/*********************************************************
 * Use any botkit compatible middleware here.
 *******************************************************/
import logger from '../logger'
<% if (luis) {
  -%>
import luis from 'basebot-middleware-luis'
<% }; -%>
<% if (lex) {
  -%>
import lex from 'basebot-middleware-lex'
<% }; -%>
<% if (alexa) {
  -%>
import { heard as alexaMiddleware } from 'basebot-controller-alexa'
<% }; -%>

export default [
  <% if (luis) { %>
  {
    type: 'receive',
    handler: luis(logger).receive()
  },
  {
    type: 'hear',
    triggers: ['intent'],
    handler: luis(logger).hearIntent
  },
  <% }; %>
  <% if (lex) { %>
  {
    type: 'receive',
    handler: lex(logger).receive
  },
  {
    type: 'heard',
    handler: lex(logger).heard
  },
  <% }; %>
  <% if (alexa) { %>
  {
    type: 'heard',
    handler: alexaMiddleware(storage)
  }
  <% }; %>
]
