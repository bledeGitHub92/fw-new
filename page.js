var inquirer = require('inquirer');
var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var spinner = require('ora')();

function page (pageName) {
  const src = path.resolve(__dirname, 'page');
  const root = path.resolve();
  const dest = path.resolve(pageName);

  if (fs.existsSync(dest)) {
    spinner.fail(chalk.red(dest) + ' 已存在。');
    process.exit(1);
  }

  inquirer
    .prompt([
      {
        name: 'page',
        type: 'confirm',
        message:
          '将在'
          + chalk.green(root)
          + '目录下创建'
          + chalk.green(pageName)
          + '页面模板',
        default: false
      }
    ]).then((answers) => {
      if (answers.page) {
        try {
          fs.copySync(src, dest);
          spinner.succeed(
            chalk.green('页面模板创建成功！')
          );
        } catch (e) {
          spinner.fail('页面模板创建失败，请重试。');
        }
      } else {
        spinner.fail('页面模板创建取消。');
      }
    });
}

module.exports = page;
