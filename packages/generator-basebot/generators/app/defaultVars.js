module.exports = {
  'Microsoft': [
    { key: 'MS_APP_ID' },
    { key: 'MS_APP_PASSWORD' },
    { key: 'MS_APP_SCOPES', initialValue: 'openid profile offline_access User.Read' }
  ],
  'Microsoft Bot Service': [
    { key: 'MS_APP_ID' },
    { key: 'MS_APP_PASSWORD' }
  ],
  'Amazon Alexa (voice)': [],
  'Azure Table Storage': [
    { key: 'DB_URL', initialValue: '(YOUR AZURE TABLE STORAGE CONNECTION STRING)' }
  ],
  'Firebase Firestore': [
    { key: 'DB_URL', initialValue: '(YOUR FIRESTORE URL)' },
    { key: 'FIREBASE', initialValue: '(YOUR FIREBASE SERVICE ACCOUNT JSON)' }
  ],
  'AWS DynamoDB': [
    { key: 'AWS_REGION', initialValue: 'eu-west-1' },
    { key: 'AWS_ACCESS_KEY_ID' },
    { key: 'AWS_SECRET_ACCESS_KEY' }
  ],
  'MongoDB': [
    { key: 'DB_URL', initialValue: '(YOUR MONGO URI)' }
  ],
  'Redis': [],
  'CouchDB': [
    { key: 'DB_URL', initialValue: '(YOUR COUCHDB URI)' }
  ],
  'MySQL': [
    { key: 'DB_HOST', initialValue: '(YOUR MYSQL HOST)' },
    { key: 'DB_USER', initialValue: '(YOUR MYSQL USER NAME)' },
    { key: 'DB_PASS', initialValue: '(YOUR MYSQL PASSWORD)' },
    { key: 'DB_NAME', initialValue: '(YOUR MYSQL DB NAME)' }
  ],
  'Papertrail': [
    { key: 'PAPERTRAIL_HOST' },
    { key: 'PAPERTRAIL_PORT' }
  ],
  'Amazon Alexa (voice)': [],
  'Microsoft LUIS': [
    { key: 'LUIS_URI' }
  ],
  'Slack': [
    { key: 'SLACK_CLIENT_ID' },
    { key: 'SLACK_CLIENT_SECRET' },
    { key: 'SLACK_REDIRECT_URI' },
    { key: 'SLACK_SCOPES', initialValue: 'incoming-webhook,team:read,users:read,channels:read,im:read,im:write,groups:read,emoji:read,chat:write:bot' }
  ],
  'Facebook Messenger': [
    { key: 'MESSENGER_ACCESS_TOKEN' },
    { key: 'MESSENGER_VERIFY_TOKEN' }
  ],
  'SMS (using Twilio)': [
    { key: 'TWILIO_ACCOUNT_SID' },
    { key: 'TWILIO_AUTH_TOKEN' },
    { key: 'TWILIO_NUMBER' }
  ],
  'Amazon LEX': [
    { key: 'AWS_REGION', initialValue: 'eu-west-1' },
    { key: 'AWS_ACCESS_KEY_ID' },
    { key: 'AWS_SECRET_ACCESS_KEY' }
  ],
  'Direct (Web, Apps etc)': [
  ]
}
