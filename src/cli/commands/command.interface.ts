export interface Command {
  readonly name: string;
  execute(...parameters: string[]): void | Promise<void>;
}
