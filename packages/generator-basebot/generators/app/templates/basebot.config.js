<% channelImports.forEach(function (value) {-%>
import <%- value.designation; %> from '<%- value.packageName; -%>'<% }); %>
import storage from '<%- storagePackage -%>'
import logger from '<%- loggerPackage -%>'
<% if(nlpPackage) { %>import nlp from '<%- nlpPackage -%>'<% }; %>
<% otherPackages.forEach(function (value) {-%>
import <%- value.designation; %> from '<%- value.packageName; -%>'<% }); %>

export default {
  channels: [
    <% channelImports.forEach(function (value) {-%>
    [
         <%- value.designation; %>,
         {}
        ],<% }); %>
  ],
  storage: [
    [
      storage,
      {}
    ]
  ],
  nlp: [
    <% if(nlpPackage) { %>[
      nlp,
      {}
    ]<% }; %>
  ],
  logger: [
    [
      logger,
      {}
    ]
  ],
  middleware: [
    <% otherPackages.forEach(function (value) {-%>
    [<%- value.designation; %>, {}],<% }); %>
  ]
}
