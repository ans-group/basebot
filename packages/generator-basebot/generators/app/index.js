const path = require('path')
const jetpack = require('fs-jetpack')
const Generator = require('yeoman-generator')
const coreDeps = require('../../coredeps')
const packageNames = require('../../packageNames')
const defaultVars = require('../../defaultVars')
const channelImports = require('../../channelImports')
const authImports = require('../../authImports')

module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        suffix: ` (This will create a folder in your current directory)`,
        validate(answer) {
          const fullPath = path.join(process.cwd(), answer)
          if (jetpack.exists(fullPath)) {
            return `${fullPath} already exists`
          }
          return !!answer || 'Please enter a name'
        }
      },
      {
        type: 'input',
        name: 'botName',
        message: 'What is the name of your bot?',
        default: answers => answers.projectName
      },
      {
        type: 'checkbox',
        name: 'channelModules',
        message: 'How do you want people to be able to access your bot?',
        choices: [
          'Microsoft Bot Service',
          'Amazon Alexa (voice)',
          'Slack',
          'Facebook Messenger',
          'SMS (using Twilio)',
          'Direct (Web, Apps etc)'
        ],
        validate: answer => answer.length > 0 || 'Please select at least one channel'
      },
      {
        type: 'list',
        name: 'storageModule',
        message: 'What do you want to use for storage?',
        choices: [
          'Azure Table Storage',
          'Firebase Firestore',
          'AWS DynamoDB',
          'MongoDB',
          'Redis',
          'CouchDB',
          'MySQL'
        ]
      },
      {
        type: 'list',
        name: 'nlpModule',
        message: 'Do you wish to use an NLP service?',
        choices: [
          '<None>',
          'Microsoft LUIS',
          'Amazon LEX'
        ]
      },
      {
        type: 'checkbox',
        name: 'authModules',
        prefix: '(Optional) ',
        message: 'Do you require any third party authorization support?',
        choices: [
          'Microsoft'
        ]
      },
      {
        type: 'confirm',
        name: 'papertrailIntegration',
        message: 'Would you like to aggregate your production logs with Papertrail?'
      }
    ]);
  }

  configuring() {
    this.destinationRoot(this.destinationPath(this.answers.projectName))
  }

  writing() {
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), {
      "name": this.answers.projectName,
      "private": true,
      "version": "0.1.0",
      "description": "Virtual Assistant built with Basebot",
      "main": "build/main.js",
      "scripts": {
        "start": "NODE_ENV=production node build/main.js",
        "build": "webpack --mode=production",
        "heroku-prebuild": "npm run build",
        "dev": "npx node-env-run --exec 'webpack' && npx node-env-run build/main.js",
        "test": "jest --detectOpenHandles --env=node --silent --forceExit"
      },
      "keywords": [
        "bots",
        "chatbots",
        "virtual assistant",
        "basebot"
      ],
      ...coreDeps
    });

    //templates
    [
      'index.js',
      '__tests__',
      'mocks',
      'public',
      '.gitignore',
      'Dockerfile',
      '.dockerignore',
      '.babelrc',
      'Procfile',
      'webpack.config.js',
      'skills',
      'services/index.js',
      'services/server',
      'services/middleware/index.js',
      'services/middleware/development.js',
      'services/storage/index.js',
      'services/storage/test.js',
      'services/logger/index.js',
      'services/logger/development.js',
    ].forEach(quickCopy.bind(this))

    // env vars
    const vars = [
        { key: 'BOT_NAME', initialValue: this.answers.botName },
        { key: 'USE_LT_SUBDOMAIN', initialValue: this.answers.projectName + '123' }
      ]
      .concat(...this.answers.channelModules.map(channelName => defaultVars[channelName]))
      .concat(...this.answers.authModules.map(authName => defaultVars[authName]))
      .concat(this.answers.nlpModule !== '<None>' ? defaultVars[this.answers.nlpModule] : [])
      .concat(this.answers.papertrailIntegration ? defaultVars.papertrail : [])
      .concat(defaultVars[this.answers.storageModule])
      .filter(Boolean)
    this.fs.copyTpl(
      this.templatePath('.env'),
      this.destinationPath('.env'),
      { vars }
    )

    // channels
    const additionalChannelImports = this.answers.channelModules.map(channel => channelImports[channel]).filter(Boolean)
    this.fs.copyTpl(
      this.templatePath('./services/channels.js'),
      this.destinationPath('./services/channels.js'),
      { channels: this.answers.channelModules, imports: additionalChannelImports }
    )

    // auth
    const additionalAuthImports = this.answers.authModules.map(handler => authImports[handler]).filter(Boolean)
    this.fs.copyTpl(
      this.templatePath('./services/auth.js'),
      this.destinationPath('./services/auth.js'),
      { handlers: additionalAuthImports.map(handler => handler.designation), imports: additionalAuthImports }
    )

    // storage
    // TODO fix templating for non-basebot (i.e. botkit) modules
    this.fs.copyTpl(
      this.templatePath('./services/storage/development.js'),
      this.destinationPath('./services/storage/development.js'),
      { storagePackage: packageNames[this.answers.storageModule] }
    )

    // papertrail
    this.fs.copyTpl(
      this.templatePath('./services/logger/production.js'),
      this.destinationPath('./services/logger/production.js'),
      { usePapertrail: this.answers.papertrailIntegration }
    )

    // NLP Middleware
    // TODO handle Lex
    this.fs.copyTpl(
      this.templatePath('./services/middleware/production.js'),
      this.destinationPath('./services/middleware/production.js'),
      { luis: this.answers.nlpModule === 'Microsoft LUIS' }
    )
  }
  
  install() {
    this.log('installing dependencies')
    this.npmInstall(null, {silent: true})
    const packages = [
      'basebot-util-signup',
      'basebot-logger-debug',
      this.answers.papertrailIntegration && 'basebot-logger-papertrail',
      packageNames[this.answers.storageModule],
      ...this.answers.authModules.map(module => packageNames[module] || ''),
      ...this.answers.channelModules.map(module => packageNames[module] || ''),
      packageNames[this.answers.nlpModule]
    ].filter(Boolean)
    this.npmInstall(packages, { silent: true })
  }

  end() {

  }
}

function quickCopy(path) {
  this.fs.copyTpl(
    this.templatePath(path),
    this.destinationPath(path)
  )
}