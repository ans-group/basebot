import mapValues from 'lodash/mapValues'
import logger from './logger'
import storage from './storage'
import server from './server'
<% imports.forEach(function(value) { -%>
import <%- value.designation; %> from '<%- value.packageName; -%>'
<% }); %>


const handlers = {
  <% handlers.forEach(function(handler) { -%>
    <%- handler %>,
  <% }); %>
}

const authModules = mapValues(handlers, init => {
  const handler = init(logger)
  handler.registerEndpoints(server, storage)
})

export default authModules
