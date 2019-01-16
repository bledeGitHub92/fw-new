var inquirer = require('inquirer');
var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var spinner = require('ora')();

async function page(pageName) {
  const { type } = await select();
  const src = path.resolve(__dirname, type);
  const root = path.resolve();
  const dest = path.resolve(pageName);

  if (fs.existsSync(dest)) {
    spinner.fail(chalk.red(dest) + ' 已存在。');
    process.exit(1);
  }

  confirm(src, root, dest, pageName);
}

function select() {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          name: 'type',
          type: 'list',
          message: '请选择模板类型',
          choices: [
            { name: 'erp模板', value: 'page' },
            { name: 'app模板', value: 'pageApp' },
          ],
          default: 0
        }
      ]).then((answers) => {
        resolve(answers);
      })
  })
}

function confirm(src, root, dest, pageName) {
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
          + '模板',
        default: false
      }
    ]).then((answers) => {
      if (answers.page) {
        try {
          fs.copySync(src, dest);
          spinner.succeed(
            chalk.green('模板创建成功！')
          );
        } catch (e) {
          spinner.fail('模板创建失败，请重试。');
        }
      } else {
        spinner.fail('模板创建取消。');
      }
    });
}

module.exports = page;