import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ApplicationError, ValidationErrorField } from '../libs/rest/index.js';

export function generateRandomNumber(min: number, max: number, precision = 0) {
  return +(Math.random() * (max - min) + min).toFixed(precision);
}

export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomNumber(0, items.length - 1);
  const endPosition =
    startPosition + generateRandomNumber(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Unknown error message. (Thrown value is not instance of Error).';
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
  });
}

export function createErrorObject(
  errorType: ApplicationError,
  error: string,
  details: ValidationErrorField[] = [],
) {
  return { errorType, error, details };
}

export function reduceValidationErrors(
  errors: ValidationError[],
): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}
