/*********************************************************
 * Use any botkit compatible middleware here.
 *******************************************************/
import logger from '../logger'
<% if (luis) { -%>
import luis from 'basebot-middleware-luis'
<% }; -%>

export default [
  <% if (luis) { %>
  {
    type: 'receive',
    handler: luis(logger).receive
  },
  {
    type: 'hear',
    handler: luis(logger).hearIntent
  },
  <% }; %>
]
