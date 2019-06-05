const path = require('path')
const os = require('os')
const chalk = require('chalk')
const hasbin = require('hasbin')
const jetpack = require('fs-jetpack')
const spawn = require('child_process').spawn
const util = require('util')
const execWithPromise = util.promisify(require('child_process').exec)

function getPath () {
  const flutter = hasbin.sync('flutter') ? 'flutter' : path.join(os.homedir(), 'flutter/bin/flutter')
  if (!hasbin.sync('flutter') && !jetpack.exists(path.join(os.homedir(), 'flutter/bin/flutter'))) {
    console.error(chalk.red('Flutter is not installed'))
    return
  }
  return flutter
}

module.exports = {
  run(commands, cwd = process.cwd()) {
	const flutter = getPath()
	return spawn(flutter, commands, { detatch: true, stdio: 'inherit', cwd });
  },
  runAsync(commands, cwd = process.cwd()) {
    const flutter = getPath()
    return execWithPromise(`${flutter} ${commands.join(' ')}`, { cwd })
  }
}
