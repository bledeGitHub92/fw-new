#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var ora = require('ora');
var semver = require('semver');

var spinner = ora();

var currentNodeVersion = process.versions.node;

if (semver.lt(currentNodeVersion, '4.0.0')) {
  spinner.fail(
    '你当前node版本为 ' +
    chalk.red(currentNodeVersion) +
    '。\n' +
    '  该项目要求node版本必须 ' +
    chalk.cyan('>= 4.0.0') +
    ' 。\n' +
    '  请升级你的node！'
  );
  process.exit(1);
}

var commander = require('commander');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var execSync = require('child_process').execSync;
var spawn = require('cross-spawn');
var appUpgrade = require('./upgrade');

var ownPath = __dirname;
var oldPath = process.cwd();
var projectName;
var projectCustom;

var program = commander
  .version(require('./package.json').version)
  .arguments('<project-directory>')
  .usage(chalk.green('<project-directory>') + ' [options]')
  .option('-u, --upgrade', '升级项目到tiger-new最新构建版本')
  .action(function (name) {
    projectName = name;
  })
  .parse(process.argv);

if (typeof projectName === 'undefined') {
  spinner.fail('请指定要' + (program.upgrade ? '升级' : '创建') + '的项目目录名:');
  console.log('  ' + chalk.cyan(program.name()) + chalk.green(' <项目目录>'));
  console.log();
  console.log('例如:');
  console.log('  ' + chalk.cyan(program.name()) + chalk.green(' my-react-app'));
  console.log();
  process.exit(1);
}

if (program.upgrade) {
  appUpgrade(projectName);
} else if (!isSafeToCreateProjectIn(path.resolve(projectName))) {
  spinner.fail('该文件夹（' + chalk.green(projectName) + '）已经存在，且存在导致冲突的文件.');
  console.log('  请使用一个新的文件夹名，或者使用升级命令将项目构建方式升级到最新版本：');
  console.log();
  console.log('   ' + chalk.cyan(program.name()) + ' ' + chalk.green(projectName) + chalk.cyan(' --upgrade'));
  console.log();
  process.exit(1);
} else {
  inquirer
    .prompt([
      {
        name: 'version',
        type: 'input',
        message: '请输入项目版本号:',
        default: '1.0.0',
        validate: function (input) {
          return semver.valid(input) ? true : chalk.cyan(input) + ' 不是一个有效的版本号';
        }
      },
      /*       {
              name: 'useCdn',
              type: 'confirm',
              message: '该项目是否需要托管静态资源到cdn服务器?' + chalk.grey('（默认仅支持ssh rsync方式上传到cdn）'),
              default: false
            } */
    ])
    .then(function (answers) {
      var questions = [
        {
          name: 'author',
          type: 'input',
          message: '请输入项目所属者（组织）的名字或邮箱:',
          validate: function (input) {
            return !!input || '该字段不能为空';
          }
        },
        {
          name: 'install',
          type: 'confirm',
          message: '是否自动下载依赖？',
          default: false
        },
        /*         {
                  name: 'libs',
                  type: 'list',
                  choices: [
                    { name: '无框架依赖', value: 0 },
                    { name: 'jquery 项目', value: 1 },
                    { name: 'react 项目', value: 2 },
                    { name: 'jquery + react 项目', value: 3 }
                  ],
                  message: '请选择项目框架' + chalk.grey('（将会默认安装所选相关框架依赖）') + ':',
                  default: 3
                },
                {
                  name: 'supportDecorator',
                  type: 'confirm',
                  message: '是否开启装饰器' + chalk.grey('@Decoators') + '特性?',
                  default: false
                },
                {
                  name: 'proxy',
                  type: 'input',
                  message: '项目接口代理服务器地址' + chalk.grey('（没有请留空）') + '：',
                  validate: function (input) {
                    return !input || /^http/.test(input) ? true : '请输入一个服务器地址';
                  }
                },
                {
                  name: 'isSpa',
                  type: 'confirm',
                  message: '该项目是否为SPA' + chalk.grey('（单页面应用）') + '?',
                  default: false
                },
                {
                  name: 'enableSW',
                  type: 'confirm',
                  message: '是否启用' + chalk.red('Service Worker Precache') + '离线功能支持?',
                  default: false
                } */
      ];

      /*       if (answers.useCdn) {
              questions.unshift(
                {
                  name: 'host',
                  type: 'input',
                  message: '请输入cdn服务器host地址:',
                  default: 'https://static.example.com',
                  validate: function (input) {
                    return /^http/.test(input) ? true : '请输入一个服务器地址';
                  }
                },
                {
                  name: 'pathname',
                  type: 'input',
                  message: '请输入项目在cdn服务器上的存储文件夹名:',
                  default: '/spa-' + path.basename(projectName),
                  validate: function (input) {
                    return /\s|\//.test(input.replace(/^\//, ''))
                      ? '文件夹名不能包含 空格、/ 等其它字符'
                      : true;
                  }
                }
              );
            } */

      return inquirer.prompt(questions).then(function (answers_rest) {
        return Object.assign(answers, answers_rest);
      });
    })
    .then(function (answers) {
      projectCustom = answers;
      createApp(projectName);
    });
}

function createApp(name) {
  var root = path.resolve(name);
  var appName = path.basename(root);
  var pkgVendor = [];

  switch (projectCustom.libs) {
    case 1:
      pkgVendor.push('jquery');
      break;
    case 2:
      pkgVendor.push('react', 'react-dom');
      break;
    case 3:
      pkgVendor.push('jquery', 'react', 'react-dom');
      break;
  }

  if (projectCustom.enableSW) {
    pkgVendor.push('utils/serviceWorker/register');
  }

  pkgVendor.push('normalize.css', './static/css/vendor.scss');

  fs.ensureDirSync(name);

  process.chdir(root);

  run(root, appName);
}

function shouldUseYarn() {
  try {
    execSync('yarn --version', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    return false;
  }
}

function install(callback) {
  var command = shouldUseYarn() ? 'yarn' : 'npm';
  var args = ['install'];

  var child = spawn(command, args, {
    stdio: 'inherit'
  });

  child.on('close', function (code) {
    callback(code, command, args);
  });

  process.on('exit', function () {
    child.kill();
  });
}

function run(appPath, appName) {
  var templatePath = path.join(ownPath, 'template');

  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
    var packageFile = require(path.resolve(appPath, 'package.json'));
    packageFile.name = appName;
    packageFile.author = projectCustom.author;
    packageFile.version = projectCustom.version;
    packageFile.vendor = projectCustom.pkgVendor;
    fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(packageFile, null, 2));
  }

  fs.move(path.join(appPath, '.gitignore'), path.join(appPath, '.gitignore'), function (err) {
    if (err) {
      // Append if there's already a `.gitignore` file there
      if (err.code === 'EEXIST') {
        var data = fs.readFileSync(path.join(appPath, 'gitignore'));

        fs.appendFileSync(path.join(appPath, '.gitignore'), data);
        fs.unlinkSync(path.join(appPath, 'gitignore'));
      } else {
        throw err;
      }
    }
  });

  if (projectCustom.install) {
    install(function (code, command, args) {
      if (code !== 0) {
        console.error('`' + command + ' ' + args.join(' ') + '` 运行失败');
        return;
      }

      console.log();
      spinner.succeed('项目 ' + chalk.green(appName) + ' 已创建成功，路径：' + chalk.green(appPath));
    })
  } else {
    spinner.succeed(
      '项目创建成功！但是你需要手动安装依赖。\n' +
      '运行\n' +
      chalk.green('cd ' + appName) + '\n' +
      chalk.green((shouldUseYarn() ? 'yarn' : 'npm') + ' install')
    );
  }
}

// If project only contains files generated by GH, it’s safe.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebookincubator/create-react-app/pull/368#issuecomment-243446094
function isSafeToCreateProjectIn(root) {
  var validFiles = ['.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', 'README.md', 'LICENSE'];

  return (
    !fs.existsSync(root) ||
    fs.readdirSync(root).every(function (file) {
      return validFiles.indexOf(file) >= 0;
    })
  );
}
