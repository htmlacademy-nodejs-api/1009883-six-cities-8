import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._arameters: string[]): Promise<void> {
    console.info(`Программа для подготовки данных для REST API сервера.

Пример: cli.js --<${chalk.blue('command')}> [${chalk.cyan('--arguments')}]

Команды:

 ${chalk.cyan('--version')}:                   ${chalk.magenta('# выводит номер версии')}
 ${chalk.cyan('--help')}:                      ${chalk.magenta('# печатает этот текст')}
 ${chalk.cyan('--import')} <path>:             ${chalk.magenta('# импортирует данные из TSV')}
 ${chalk.cyan('--generate')} <n> <path> <url>  ${chalk.magenta('# генерирует произвольное количество тестовых данных')}`);
  }
}
