import mapValues from 'lodash/mapValues'
import logger from './logger'
/*********************************************************
 * Register any basebot compatible auth handlers here.
 * For example, we are using the microsoft auth handler below
 *******************************************************/
<% imports.forEach(function(value) { -%>
import <%- value.designation; %> from '<%- value.packageName; -%>'
<% }); %>


const handlers = {
  <% handlers.forEach(function(handler) { -%>
  <%- handler %>,
  <% }); %>
}

export default mapValues(handlers, handler => handler(logger))
