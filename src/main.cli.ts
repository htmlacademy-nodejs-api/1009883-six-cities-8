import { CLIApplication } from './cli/cli-application.js';
import { HelpCommand, VersionCommand } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([new HelpCommand(), new VersionCommand()]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
