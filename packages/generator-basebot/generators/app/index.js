const path = require('path')
const beautify = require('gulp-beautify')
const gulpif = require('gulp-if')
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
          'Azure Bot Service',
          'Amazon Alexa (voice)',
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
          'AWS DynamoDB'
        ]
      },
      {
        type: 'list',
        name: 'nlpModule',
        message: 'Do you wish to use an NLP (natural language understanding) service?',
        choices: [
          '<None>',
          'Microsoft LUIS',
          'Amazon LEX'
        ]
      },
      /* { */
      // type: 'checkbox',
      // name: 'authModules',
      // prefix: '(Optional) ',
      // message: 'Do you require any third party authorization support?',
      // choices: [
      // 'Microsoft'
      // ]
      /* }, */
      {
        type: 'confirm',
        name: 'papertrailIntegration',
        message: 'Would you like to aggregate your production logs with Papertrail?'
      },
      {
        type: 'checkbox',
        name: 'utilities',
        message: 'Enable any additional modules',
        choices: [
          'Analytics',
          'User Feedback',
          'QNA Maker Integration'
        ]
      }
    ])
  }

  configuring() {
    this.destinationRoot(this.destinationPath(this.answers.projectName))
  }

  writing() {
    const condition = file => file.extname === '.js'
    this.registerTransformStream(gulpif(condition, beautify({ indent_size: 2 })))
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), {
      'name': this.answers.projectName,
      'private': true,
      'version': '0.1.0',
      'description': 'Virtual Assistant built with Basebot',
      'main': 'build/main.js',
      'scripts': {
        'start': 'node .',
        'build': 'rm -rf ./build && npm run build-server',
        'build-docker': "node-env-run --exec 'docker build -t $DOCKER_IMAGE_NAME:latest ./build'",
        'push-docker': "node-env-run --exec 'docker push $DOCKER_IMAGE_NAME:latest'",
        'build-server': "node-env-run --exec 'npx babel ./ --out-dir build --ignore \"node_modules\",\"build\",\"__tests__\",\".git\",\".vscode\" --copy-files --source-maps' && cp web.config build/ && cp iisnode.yml build/ && cp docker-compose.yml build/ && cp Dockerfile build/ && cp .dockerignore build && cp package*.json build/",
        'dev': `DEBUG=${this.answers.botName.split(' ')[0]}* node-env-run --exec 'nodemon --exec babel-node -- ./index.js'`,
        'test': "NODE_ENV=test node-env-run --exec 'npm run jest'",
        'jest': "jest --detectOpenHandles --testRegex='(/__tests__/.*|(\\.|/)(spec))\\.[jt]sx?$' --env=node --forceExit --silent"
      },
      'keywords': [
        'bots',
        'chatbots',
        'virtual assistant',
        'basebot'
      ],
      ...coreDeps
    });

    // templates
    [
      'index.js',
      '__tests__',
      'mocks',
      'public',
      'Dockerfile',
      'docker-compose.yml',
      'web.config',
      'iisnode.yml',
      '.dockerignore',
      '.babelrc',
      'Procfile',
      'skills'
    ].forEach(quickCopy.bind(this))

    // create .gitignore
    this.fs.copy(this.templatePath('.gi'), this.destinationPath('.gitignore'))

    // env vars
    const vars = [
      { key: 'BOT_NAME', initialValue: this.answers.botName },
      { key: 'DOCKER_IMAGE_NAME', initialValue: 'YOUR_DOCKER_USERNAME/basebot-core' },
      { key: 'RESOURCE_PREFIX', initialValue: '' },
      { key: 'USE_LT_SUBDOMAIN', initialValue: this.answers.projectName + '123' }
    ]
      .concat(...this.answers.channelModules.map(channelName => defaultVars[channelName]))
      .concat(this.answers.nlpModule !== '<None>' ? defaultVars[this.answers.nlpModule] : [])
      .concat(...this.answers.utilities.map(pckgName => defaultVars[pckgName]))
      .concat(this.answers.papertrailIntegration ? defaultVars.papertrail : [])
      .concat(defaultVars[this.answers.storageModule])
      .filter(Boolean)
      .reduce((prev, curr) => prev.reduce((found, item) => item.key === curr.key, false) ? prev : prev.concat(curr), [])
    this.fs.copyTpl(
      this.templatePath('.e'),
      this.destinationPath('.env'),
      { vars }
    )

    // config file
    const additionalChannelImports = this.answers.channelModules.map(channel => channelImports[channel]).filter(Boolean)
    const otherPackages = this.answers.utilities.map(utility => ({
      designation: utility.split(' ')[0] + (utility.split(' ')[1] || ''),
      packageName: packageNames[utility]
    }))
    this.fs.copyTpl(
      this.templatePath('./basebot.config.js'),
      this.destinationPath('./basebot.config.js'),
      {
        channelImports: additionalChannelImports,
        storagePackage: packageNames[this.answers.storageModule],
        loggerPackage: this.answers.papertrailIntegration ? 'basebot-logger-papertrail' : 'basebot-logger-debug',
        nlpPackage: this.answers.nlpModule && packageNames[this.answers.nlpModule],
        otherPackages
      }
    )
  }

  install() {
    this.log('installing dependencies')
    this.npmInstall(null, { silent: true })
    const packages = [
      'basebot-core',
      'basebot-logger-debug',
      this.answers.papertrailIntegration && 'basebot-logger-papertrail',
      packageNames[this.answers.storageModule],
      ...this.answers.channelModules.map(module => packageNames[module] || ''),
      ...this.answers.utilities.map(module => packageNames[module] || ''),
      packageNames[this.answers.nlpModule]
    ].filter(Boolean)
    this.npmInstall(packages, { silent: true })
  }

  end() {

  }
}

function quickCopy(path) {
  this.fs.copy(
    this.templatePath(path),
    this.destinationPath(path)
  )
}
