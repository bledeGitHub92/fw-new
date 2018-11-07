var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var ora = require('ora');

var spinner = ora();

/**
 * @desc node执行路径
 */
var ownPath = __dirname;

/**
 * @desc 待覆盖目录
 */
var overrideDirs = [
  'src/interface',
  'src/components',
  'src/e2e',
  'src/layouts',
  'src/locales',
  'src/services',
  'src/models',
  'src/pages',
  'src/utils',
  'src/assets',
  'src/defaultSettings.js',
  'src/global.less',
  'config/config.js',
  'config/plugin.config.js',
  'tsconfig.json',
  '.eslintrc.js',
];

function appUpgrade (projectName) {
  // 项目路径
  var root = path.resolve(projectName);
  var oldPackagePath = path.resolve(root, 'package.json');
  var newPackagePath = path.resolve(ownPath, 'template', 'package.json')
  var oldPackageFile = require(oldPackagePath);
  var newPackageFile = require(newPackagePath);

  if (!fs.existsSync(root)) {
    spinner.fail(chalk.red(root) + ' 貌似不存在！');
    process.exit();
  }

  if (!fs.existsSync(oldPackagePath)) {
    spinner.fail('项目目录下package.json貌似不存在！');
    process.exit();
  }

  inquirer
    .prompt([
      {
        name: 'upgrade',
        type: 'confirm',
        message:
          '请确认是否要将 ' +
          oldPackageFile.name +
          ' 升级到最新？\n' +
          chalk.red('会覆盖以下目录或文件：\n') +
          chalk.green('  /src/services/\n') +
          chalk.green('  /src/models/\n') +
          chalk.green('  /src/assets/\n') +
          chalk.green('  /src/e2e/\n') +
          chalk.green('  /src/layouts/\n') +
          chalk.green('  /src/locales/\n') +
          chalk.green('  /src/pages/基础页面\n') +
          chalk.green('  /src/utils/基础文件\n') +
          chalk.green('  /src/defaultSettings.js\n') +
          chalk.green('  /src/global.less\n') +
          chalk.green('  /config/config.js\n') +
          chalk.green('  /config/plugin.config.js\n') +
          chalk.green('  /tsconfig.json\n') +
          chalk.green('  /.eslintrc.js\n'),
        default: false
      }
    ])
    .then(answers => {
      if (answers.upgrade) {
        var questions = [];

        inquirer.prompt(questions).then(answers => {
          console.log();

          newPackageFile.name = oldPackageFile.name;
          newPackageFile.version = oldPackageFile.version;
          newPackageFile.description = oldPackageFile.description;
          newPackageFile.author = oldPackageFile.author;

          // 更新 package.json
          fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(newPackageFile, null, 2));
          // 更新 overrideDirs 里的文件
          overrideDirs.forEach(file => {
            var src = path.resolve(ownPath, 'template', file);
            var dest = path.resolve(root, file);
            fs.copySync(src, dest);
            console.log(
              chalk.dim(dest + ' 已更新!')
            );
          })

          console.log();
          spinner.succeed(
            '项目升级成功！但是你可能需要重新手动安装确实的依赖。\n'
          );
        });
      } else {
        spinner.fail('升级已取消！');
      }
    });
}

module.exports = appUpgrade;
