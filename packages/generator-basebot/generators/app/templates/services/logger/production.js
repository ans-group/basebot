/*********************************************************
 * Use any basebot compatible logger here.
 * Just change 'basebot-logger-debug' to the package name
 * (e.g. basebot-logger-papertrail)
 *******************************************************/

<% if (usePapertrail) { %>
export { default } from 'basebot-logger-papertrail'
<% } else { %>
export { default } from 'basebot-logger-debug'
<% }; %>
