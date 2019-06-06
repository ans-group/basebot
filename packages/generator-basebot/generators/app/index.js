const path = require('path')
const jetpack = require('fs-jetpack')
const Generator = require('yeoman-generator')
const coreDeps = require('./coredeps')
const packageNames = require('./packageNames')
const defaultVars = require('./defaultVars')
const channelImports = require('./channelImports')
const authImports = require('./authImports')

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
        "start": "node .",
        "build": "rm -rf ./build && npm run build-server && npm run build-docker",
        "build-docker": "cd build && docker build -t basebot-core .",
        "build-server": "node-env-run --exec 'npx babel ./ --out-dir build --ignore \"node_modules\",\"build\",\"__tests__\",\".git\",\".vscode\" --copy-files --source-maps' && cp docker-compose.yml build/ && cp Dockerfile build/ && cp .dockerignore build && cp package*.json build/",
        "dev": `DEBUG='${this.answers.botName}*' node-env-run --exec 'nodemon --exec babel-node -- ./index.js'`,
        "test": "NODE_ENV=test node-env-run --exec 'npm run jest'",
        "jest": "jest --detectOpenHandles --testRegex='(/__tests__/.*|(\\.|/)(spec))\\.[jt]sx?$' --env=node --forceExit --silent"
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
      'Dockerfile',
      'docker-compose.yml',
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
      'services/logger/index.js',
      'services/channels/index.js',
      'services/channels/test.js'
    ].forEach(quickCopy.bind(this))

    //create .gitignore 
    this.fs.copyTpl(this.templatePath('.gi'), this.destinationPath('.gitignore'))

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
      this.templatePath('./services/channels/production.js'),
      this.destinationPath('./services/channels/production.js'),
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
    this.fs.copyTpl(
      this.templatePath('./services/middleware/production.js'),
      this.destinationPath('./services/middleware/production.js'),
      {
        luis: this.answers.nlpModule === 'Microsoft LUIS',
        lex: this.answers.nlpModule === 'Amazon LEX',
        alexa: this.answers.channelModules.includes('Amazon Alexa (voice)')
      }
    )
  }

  install() {
    this.log('installing dependencies')
    this.npmInstall(null, { silent: true })
    const packages = [
      'basebot-util-signup',
      'basebot-logger-debug',
      this.answers.papertrailIntegration && 'basebot-logger-papertrail',
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
